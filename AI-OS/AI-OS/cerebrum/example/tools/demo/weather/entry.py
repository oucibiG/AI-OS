"""
Weather Tool - Example tool for Cerebrum SDK

This tool provides weather information for locations.
Note: This is a demo implementation. For production use,
integrate with a real weather API like OpenWeatherMap.
"""

from typing import Any, Dict
from cerebrum import Tool
import random
from datetime import datetime


class WeatherTool(Tool):
    """Weather tool for getting weather information."""
    
    def __init__(self):
        self.conditions = [
            {"text": "Slnečno", "icon": "☀️", "temp_range": (25, 35)},
            {"text": "Polojasno", "icon": "⛅", "temp_range": (20, 28)},
            {"text": "Oblačno", "icon": "☁️", "temp_range": (15, 22)},
            {"text": "Daždivo", "icon": "🌧️", "temp_range": (10, 18)},
            {"text": "Búrky", "icon": "⛈️", "temp_range": (18, 25)},
            {"text": "Sneh", "icon": "❄️", "temp_range": (-5, 5)},
        ]
    
    @property
    def name(self) -> str:
        return "weather"
    
    @property
    def description(self) -> str:
        return "Získanie aktuálnych informácií o počasí vrátane teploty, podmienok a vlhkosti pre zadanú lokáciu"
    
    def get_tool_call_format(self) -> Dict:
        return {
            "name": self.name,
            "description": self.description,
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "Názov lokality (mesto, krajina)"
                    },
                    "units": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"],
                        "description": "Jednotky teploty (predvolené: celsius)"
                    }
                },
                "required": ["location"]
            }
        }
    
    def run(self, params: Dict[str, Any]) -> str:
        """Get weather information for location."""
        location = params.get("location", "Neurčená lokácia")
        units = params.get("units", "celsius")
        
        # Simulate API call with demo data
        condition = random.choice(self.conditions)
        
        # Base temperature from range
        base_temp = random.uniform(*condition["temp_range"])
        
        # Add some variation
        temp = base_temp + random.uniform(-3, 3)
        
        # Convert if needed
        if units == "fahrenheit":
            temp_c = temp
            temp = temp_c * 9/5 + 32
            unit_symbol = "°F"
            humidity = random.randint(40, 80)
        else:
            unit_symbol = "°C"
            humidity = random.randint(40, 80)
        
        wind_speed = random.randint(5, 30)
        
        # Format output
        return f"""
🌤️ **Počasie v {location}**

📍 Lokalita: {location}
🌡️  Teplota: {temp:.1f}{unit_symbol}
🌥️  Podmienky: {condition["icon"]} {condition["text"]}
💧 Vlhkosť: {humidity}%
💨 Vietor: {wind_speed} km/h
🕐 Aktualizované: {datetime.now().strftime('%H:%M')}

*Demo implementácia - pre presné údaje použite skutočné API*
        """.strip()
    
    def get_forecast(self, location: str, days: int = 5) -> str:
        """Get weather forecast for multiple days."""
        forecast_lines = [f"📊 **Predpoveď počasia pre {location}**\n"]
        
        for i in range(days):
            condition = random.choice(self.conditions)
            temp = random.uniform(*condition["temp_range"])
            
            from datetime import timedelta
            date = datetime.now() + timedelta(days=i)
            day_name = date.strftime("%A")
            
            forecast_lines.append(
                f"{day_name}: {condition['icon']} {temp:.0f}{condition['text']} - {temp+random.uniform(5,10):.0f}°C"
            )
        
        return "\n".join(forecast_lines)


# Entry point for tool loading
def create_tool() -> WeatherTool:
    """Factory function to create WeatherTool instance."""
    return WeatherTool()
