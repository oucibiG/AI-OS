"""
Calculator Tool - Example tool for Cerebrum SDK

This tool provides basic mathematical operations for agents.
"""

from typing import Any, Dict
from cerebrum import Tool


class CalculatorTool(Tool):
    """Calculator tool for basic math operations."""
    
    @property
    def name(self) -> str:
        return "calculator"
    
    @property
    def description(self) -> str:
        return "Jednoduchá kalkulačka pre základné matematické operácie: sčítanie, odčítanie, násobenie, delenie, mocniny a odmocniny"
    
    def get_tool_call_format(self) -> Dict:
        return {
            "name": self.name,
            "description": self.description,
            "parameters": {
                "type": "object",
                "properties": {
                    "operation": {
                        "type": "string",
                        "enum": ["add", "subtract", "multiply", "divide", "power", "sqrt", "modulo"],
                        "description": "Typ matematickej operácie"
                    },
                    "a": {
                        "type": "number",
                        "description": "Prvé číslo"
                    },
                    "b": {
                        "type": "number",
                        "description": "Druhé číslo (nie je potrebné pre odmocninu)"
                    }
                },
                "required": ["operation", "a"]
            }
        }
    
    def run(self, params: Dict[str, Any]) -> str:
        """Execute calculator operation."""
        operation = params.get("operation", "add")
        a = float(params.get("a", 0))
        b = float(params.get("b", 0))
        
        try:
            if operation == "add":
                result = a + b
                return f"Výsledok sčítania: {a} + {b} = {result}"
            
            elif operation == "subtract":
                result = a - b
                return f"Výsledok odčítania: {a} - {b} = {result}"
            
            elif operation == "multiply":
                result = a * b
                return f"Výsledok násobenia: {a} × {b} = {result}"
            
            elif operation == "divide":
                if b == 0:
                    return "Chyba: Delenie nulou nie je možné!"
                result = a / b
                return f"Výsledok delenia: {a} ÷ {b} = {result}"
            
            elif operation == "power":
                result = a ** b
                return f"Výsledok umocnenia: {a}^{b} = {result}"
            
            elif operation == "sqrt":
                if a < 0:
                    return "Chyba: Odmocnina záporného čísla nie je reálna!"
                result = a ** 0.5
                return f"Odmocnina čísla {a} = {result}"
            
            elif operation == "modulo":
                result = a % b
                return f"Zvyšok po delení: {a} mod {b} = {result}"
            
            else:
                return f"Neznáma operácia: {operation}"
        
        except Exception as e:
            return f"Chyba pri výpočte: {str(e)}"


# Entry point for tool loading
def create_tool() -> CalculatorTool:
    """Factory function to create CalculatorTool instance."""
    return CalculatorTool()
