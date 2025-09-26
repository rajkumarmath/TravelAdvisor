import os
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import openai
from pydantic import BaseModel
from typing import Optional, Dict, Any
import json
from datetime import datetime

# Load environment variables
load_dotenv()
openai.api_key = os.environ.get("OPENAI_API_KEY")

# Create FastAPI app
app = FastAPI(
    title="Travel Safety Advisor API",
    description="AI-powered travel safety recommendations with user feedback system",
    version="2.0.0"
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class TravelAdvice(BaseModel):
    title: str
    safety_and_security: Dict[str, Any]
    health_and_wellness: Dict[str, Any]
    cultural_etiquette: Dict[str, Any]
    emergency_contacts: Dict[str, Any]
    weather_forecast: Optional[Dict[str, Any]] = None
    local_laws: Optional[Dict[str, Any]] = None

class FeedbackRequest(BaseModel):
    city: str
    country: str
    state: Optional[str] = None
    feedback_type: str
    message: str
    rating: Optional[int] = None

class FeedbackResponse(BaseModel):
    status: str
    message: str
    feedback_id: str
    timestamp: str

# In-memory storage for feedback
feedback_storage = []

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Travel Safety Advisor API is live!",
        "version": "2.0.0",
        "endpoints": {
            "advice": "/advice?city=Paris&country=France&start_date=2024-01-01&end_date=2024-01-10",
            "feedback": "/feedback (POST)",
            "health": "/health"
        }
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "Travel Safety Advisor API"
    }

# Travel advice endpoint
@app.get("/advice", response_model=TravelAdvice)
async def get_advice(
    city: str = Query(..., description="City name for travel advisory"),
    country: str = Query(..., description="Country name for travel advisory"),
    start_date: str = Query(..., description="Trip start date (YYYY-MM-DD)"),
    end_date: str = Query(..., description="Trip end date (YYYY-MM-DD)")
):
    """
    Generate AI-powered comprehensive travel advisory for any destination worldwide.
    """
    
    prompt = f"""
You are an expert travel safety advisor with deep knowledge of {city}, {country}.

Generate a comprehensive, accurate, and practical travel advisory for {city}, {country} 
for the period {start_date} to {end_date}.

Provide SPECIFIC, ACTIONABLE advice tailored to this exact location and time period.

Return ONLY valid JSON in this exact structure:

{{
  "title": "Travel Advisory for {city}, {country}",
  "safety_and_security": {{
    "overall_risk_level": "Low/Medium/High",
    "common_safety_concerns": [
      {{"risk": "specific risk description", "precaution": "specific precaution"}}
    ],
    "neighborhood_safety": {{
      "safe_areas": ["..."],
      "areas_to_avoid": ["..."]
    }},
    "transportation_safety": {{
      "public_transport": "...",
      "taxi_services": "..."
    }},
    "personal_safety_tips": ["..."],
    "scam_alerts": ["..."]
  }},
  "health_and_wellness": {{
    "vaccination_requirements": ["..."],
    "common_health_risks": ["..."],
    "medical_facilities_quality": "...",
    "food_safety_advice": ["..."]
  }},
  "cultural_etiquette": {{
    "cultural_norms": ["..."],
    "dress_code": ["..."],
    "greeting_customs": ["..."],
    "tipping_practices": "...",
    "basic_local_phrases": [
      {{"english": "Hello", "local": "...", "pronunciation": "..."}}
    ]
  }},
  "emergency_contacts": {{
    "police": "...",
    "ambulance": "...",
    "fire_emergency": "...",
    "tourist_helpline": "..."
  }},
  "weather_forecast": {{
    "seasonal_conditions": "...",
    "average_temperature": "...",
    "packing_recommendations": ["..."]
  }},
  "local_laws": {{
    "important_regulations": ["..."],
    "cultural_sensitivities": ["..."]
  }}
}}

Important guidelines:
- Be specific to {city}, {country}
- Provide practical, actionable advice
- Include current, relevant information
- If certain information is unavailable, use null
- Maintain consistent JSON structure
"""

    try:
        response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system", 
                    "content": "You are a specialized travel safety AI. Return ONLY valid JSON. Be accurate and practical."
                },
                {
                    "role": "user", 
                    "content": prompt
                }
            ],
            temperature=0.2,
            max_tokens=2000
        )

        raw_json = response.choices[0].message.content
        
        # Clean the response
        if raw_json.startswith('```json'):
            raw_json = raw_json.replace('```json', '').replace('```', '').strip()
        
        # Parse and validate JSON
        advice_data = json.loads(raw_json)
        
        return TravelAdvice(**advice_data)

    except json.JSONDecodeError as e:
        raise HTTPException(
            status_code=500, 
            detail=f"AI returned invalid JSON format: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error generating travel advice: {str(e)}"
        )

# Feedback collection endpoint
@app.post("/feedback", response_model=FeedbackResponse)
async def submit_feedback(feedback: FeedbackRequest):
    """
    Collect user feedback about travel advice accuracy and quality.
    """
    try:
        # Generate unique feedback ID
        feedback_id = f"fb_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        # Create feedback record
        feedback_record = {
            "id": feedback_id,
            "city": feedback.city,
            "country": feedback.country,
            "state": feedback.state,
            "feedback_type": feedback.feedback_type,
            "message": feedback.message,
            "rating": feedback.rating,
            "timestamp": datetime.now().isoformat()
        }
        
        # Store feedback
        feedback_storage.append(feedback_record)
        
        # Log feedback
        print(f"📝 Feedback received - ID: {feedback_id}, City: {feedback.city}, Country: {feedback.country}")
        
        return FeedbackResponse(
            status="success",
            message="Thank you for your valuable feedback! We'll use it to improve our service.",
            feedback_id=feedback_id,
            timestamp=feedback_record["timestamp"]
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error processing feedback: {str(e)}"
        )

# Get feedback statistics
@app.get("/feedback/stats")
async def get_feedback_stats():
    """
    Get feedback statistics
    """
    try:
        if not feedback_storage:
            return {"message": "No feedback received yet", "total": 0}
        
        stats = {
            "total_feedback": len(feedback_storage),
            "feedback_by_type": {},
            "recent_feedback": feedback_storage[-5:]
        }
        
        for feedback in feedback_storage:
            fb_type = feedback["feedback_type"]
            stats["feedback_by_type"][fb_type] = stats["feedback_by_type"].get(fb_type, 0) + 1
        
        return stats
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error generating stats: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
