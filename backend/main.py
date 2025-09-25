import os
from fastapi import FastAPI, HTTPException, Query
from dotenv import load_dotenv
import openai
from backend.models import TravelAdvice

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI(title="Travel Safety Advisor API")

@app.get("/advice", response_model=TravelAdvice)
async def get_advice(
    city: str = Query(..., description="City name for travel advisory"),
    country: str = Query(..., description="Country name for travel advisory"),
    start_date: str = Query(..., description="Trip start date (dd-mm-yyyy)"),
    end_date: str = Query(..., description="Trip end date (dd-mm-yyyy)")
):
    """
    Generate a structured travel advisory for a given city, country, and date range.
    Returns JSON with sections: safety, health, culture, emergency, optional weather & local laws.
    """

    prompt = f"""
You are an expert travel safety advisor.

Generate a travel advisory for {city}, {country} from {start_date} to {end_date}.

Return ONLY JSON in this exact format:

{{
  "title": "Travel Advisory for {city}, {country} ({start_date} to {end_date})",
  "safety_and_security": {{
    "common_safety_concerns": [{{"risk": "...", "precaution": "..."}}],
    "neighborhoods_to_be_cautious_in": ["..."],
    "transportation_safety": ["..."]
  }},
  "health_and_wellness": {{
    "prevalent_risks": ["..."],
    "vaccinations_and_health_items": ["..."]
  }},
  "cultural_etiquette": {{
    "norms": ["..."],
    "phrases": [{{"english": "...", "local": "...", "pronunciation": "..."}}]
  }},
  "emergency_contacts": {{
    "police": "...",
    "ambulance": "...",
    "fire": "..."
  }},
  "weather_forecast": {{
    "summary": "...",
    "temperature_celsius": "...",
    "chance_of_rain": "..."
  }},
  "local_laws": {{
    "rules": ["..."]
  }}
}}

If weather or local laws are unknown, return them as null.
Do NOT return any text outside this JSON.
"""

    try:
        response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a JSON generator. Only return valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3
        )

        raw_json = response.choices[0].message.content
        return TravelAdvice.model_validate_json(raw_json)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI response error: {e}")
