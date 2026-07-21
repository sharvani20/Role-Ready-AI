import unittest

from app.services.ai_service import parse_analysis_response


class ParseAnalysisResponseTests(unittest.TestCase):
    def test_parses_numeric_score_from_string_value(self):
        payload = '{"score": "82", "skills": ["Python"], "missing_skills": [], "strengths": [], "weaknesses": [], "suggestions": []}'

        result = parse_analysis_response(payload)

        self.assertEqual(result["score"], 82)
        self.assertEqual(result["skills"], ["Python"])

    def test_extracts_score_from_mixed_text_response(self):
        payload = 'Here is the result: {"score": "74/100", "skills": ["FastAPI"], "missing_skills": ["Docker"], "strengths": ["Clean code"], "weaknesses": ["Testing"], "suggestions": ["Add tests"]}'

        result = parse_analysis_response(payload)

        self.assertEqual(result["score"], 74)
        self.assertEqual(result["skills"], ["FastAPI"])
        self.assertEqual(result["missing_skills"], ["Docker"])


if __name__ == "__main__":
    unittest.main()
