# Analysis schemas will go here.
import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


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

    content = response.choices[0].message.content.strip()

    # Debug print
    print("GROQ RESPONSE:", content)

    try:
        return json.loads(content)

    except json.JSONDecodeError:
        # Try to extract JSON if model added extra text
        start = content.find("{")
        end = content.rfind("}")

        if start != -1 and end != -1:
            json_text = content[start : end + 1]
            return json.loads(json_text)

        # Fallback response so frontend doesn't crash
        return {
            "score": 0,
            "skills": [],
            "missing_skills": [],
            "strengths": ["AI response was not valid JSON"],
            "weaknesses": [],
            "suggestions": ["Try running the analysis again"],
        }
