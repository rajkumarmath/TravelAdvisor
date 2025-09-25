from pydantic import BaseModel
from typing import List, Optional

class SafetyConcern(BaseModel):
    risk: str
    precaution: str

class Phrase(BaseModel):
    english: str
    local: str
    pronunciation: str

class SafetyAndSecurity(BaseModel):
    common_safety_concerns: List[SafetyConcern]
    neighborhoods_to_be_cautious_in: List[str]
    transportation_safety: List[str]

class HealthAndWellness(BaseModel):
    prevalent_risks: List[str]
    vaccinations_and_health_items: List[str]

class CulturalEtiquette(BaseModel):
    norms: List[str]
    phrases: List[Phrase]

class EmergencyContacts(BaseModel):
    police: str
    ambulance: str
    fire: str

# New optional sections
class WeatherForecast(BaseModel):
    summary: str
    temperature_celsius: str
    chance_of_rain: str

class LocalLaws(BaseModel):
    rules: List[str]

class TravelAdvice(BaseModel):
    title: str
    safety_and_security: SafetyAndSecurity
    health_and_wellness: HealthAndWellness
    cultural_etiquette: CulturalEtiquette
    emergency_contacts: EmergencyContacts
    # optional scalable sections
    weather_forecast: Optional[WeatherForecast] = None
    local_laws: Optional[LocalLaws] = None
