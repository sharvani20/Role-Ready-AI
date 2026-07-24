import os
import json
import re
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def _to_list(value):
    if isinstance(value, list):
        return [str(item).strip() for item in value if str(item).strip()]
    if isinstance(value, str):
        if not value.strip():
            return []
        return [part.strip() for part in re.split(r"\n|,", value) if part.strip()]
    return []


def _normalize_score(value):
    if isinstance(value, (int, float)):
        return int(value)
    if isinstance(value, str):
        match = re.search(r"(\d+)", value)
        if match:
            return int(match.group(1))
    return 0


def _calculate_fallback_score(resume_text: str, job_description: str, skills, missing_skills):
    resume_lower = (resume_text or "").lower()
    job_lower = (job_description or "").lower()

    resume_keywords = set(re.findall(r"[a-z0-9+#.]+", resume_lower))
    job_keywords = set(re.findall(r"[a-z0-9+#.]+", job_lower))

    if job_keywords:
        overlap = resume_keywords & job_keywords
        if overlap:
            overlap_score = int((len(overlap) / max(1, len(job_keywords))) * 100)
        else:
            overlap_score = 0
    else:
        overlap_score = 0

    matched_count = len([skill for skill in skills if skill.lower() in resume_lower])
    missing_count = len([skill for skill in missing_skills if skill.lower() in resume_lower])

    if skills or missing_skills:
        skill_score = int((matched_count / max(1, len(skills) + len(missing_skills))) * 100)
    else:
        skill_score = 0

    combined_score = int((overlap_score * 0.5) + (skill_score * 0.5))
    if combined_score < 20 and (skills or missing_skills):
        combined_score = 20
    return max(0, min(100, combined_score))


def parse_analysis_response(content: str):
    cleaned = content.strip()
    cleaned = cleaned.replace("```json", "").replace("```", "").strip()

    try:
        parsed = json.loads(cleaned)
    except json.JSONDecodeError:
        match = re.search(r"\{.*\}", cleaned, re.DOTALL)
        if match:
            try:
                parsed = json.loads(match.group(0))
            except json.JSONDecodeError:
                parsed = {}
        else:
            parsed = {}

    if not isinstance(parsed, dict):
        parsed = {}

    return {
        "score": _normalize_score(parsed.get("score", 0)),
        "skills": _to_list(parsed.get("skills", [])),
        "missing_skills": _to_list(parsed.get("missing_skills", [])),
        "strengths": _to_list(parsed.get("strengths", [])),
        "weaknesses": _to_list(parsed.get("weaknesses", [])),
        "suggestions": _to_list(parsed.get("suggestions", [])),
    }


def analyze_resume(resume_text: str, job_description: str):
    prompt = f"""
You are an ATS and resume analysis AI.

Analyze the resume against the job description.

Return ONLY valid JSON.
Do not add explanations, markdown, or text outside JSON.

Required format:
{{
  "score": 0,
  "skills": [],
  "missing_skills": [],
  "strengths": [],
  "weaknesses": [],
  "suggestions": []
}}

Resume:
{resume_text}

Job Description:
{job_description}
"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": "Return only valid JSON."},
            {"role": "user", "content": prompt},
        ],
        temperature=0.1,
    )

    content = response.choices[0].message.content

    # Print the actual AI response for debugging
    print("========== GROQ RAW RESPONSE ==========")
    print(content)
    print("=======================================")

    parsed = parse_analysis_response(content)

    if parsed["score"] == 0 and any([
        parsed["skills"],
        parsed["missing_skills"],
        parsed["strengths"],
        parsed["weaknesses"],
        parsed["suggestions"],
    ]):
        parsed["score"] = _calculate_fallback_score(
            resume_text,
            job_description,
            parsed["skills"],
            parsed["missing_skills"],
        )

    if parsed["score"] == 0 and not any([
        parsed["skills"],
        parsed["missing_skills"],
        parsed["strengths"],
        parsed["weaknesses"],
        parsed["suggestions"],
    ]):
        return {
            "score": 0,
            "skills": [],
            "missing_skills": [],
            "strengths": ["AI response could not be parsed"],
            "weaknesses": ["Invalid AI output"],
            "suggestions": [
                "Check Groq API key",
                "Check model quota",
                "Try the analysis again"
            ]
        }

    return parsed