"""
Demo Agent - Example agent for Cerebrum SDK

This is a simple demo agent that demonstrates the basic structure
of a Cerebrum agent.
"""

from cerebrum import AgentBase, AgentConfig, AgentMessage


class DemoAgent(AgentBase):
    """Demo agent for testing and demonstration."""
    
    def __init__(self, config: AgentConfig):
        super().__init__(config)
        self.conversation_count = 0
        
        # Set custom system prompt
        self.add_system_prompt("""
You are Demo Agent, a friendly and helpful AI assistant.

Your capabilities:
- Engaging in conversations on various topics
- Providing helpful information
- Answering questions clearly and concisely
- Using tools when appropriate

Guidelines:
- Be friendly and conversational
- Provide accurate information
- Ask clarifying questions when needed
- Keep responses focused and relevant
        """)
    
    async def think(self, user_input: str) -> str:
        """Process user input and generate response."""
        self.conversation_count += 1
        
        # Build context-aware response
        context = self.memory.get_recent(5) if self.memory else []
        
        # Simple keyword-based responses
        user_input_lower = user_input.lower()
        
        if any(word in user_input_lower for word in ['ahoj', 'hello', 'hi', 'dobrý']):
            response = "👋 Ahoj! Som Demo Agent. Ako vám môžem pomôcť?"
        
        elif any(word in user_input_lower for word in ['čo je', 'kto je', 'definícia']):
            response = self._handle_definition_query(user_input)
        
        elif any(word in user_input_lower for word in ['pomoc', 'help']):
            response = """
📚 **Demo Agent - Pomoc**

Môžem vám pomôcť s:
- Všeobecnými otázkami
- Jednoduchými výpočtami
- Informáciami o počasí
- Konverzáciou na rôzne témy

Stačí sa opýtať! 😊
            """
        
        elif any(word in user_input_lower for word in ['počasie', 'weather']):
            response = """
🌤️ **Informácia o Počasí**

Aktuálne nemám priamy prístup k API počasia, ale môžem vám povedať, že:

- Všeobecné počasie závisí od vašej lokality
- Pre presné informácie použite nástroj na vyhľadávanie počasia
- Môžem vám pomôcť s interpretáciou meteorologických dát

Chcete vedieť viac o počasí vo vašom regióne?
            """
        
        elif any(word in user_input_lower for word in ['kalkulačka', 'vypočítaj', 'sčítaj', 'odčítaj']):
            response = self._handle_calculator_query(user_input)
        
        elif any(word in user_input_lower for word in ['ďakujem', 'thanks', 'thank']):
            response = "😊 Nie je za čo! Som tu na to, aby som vám pomohol. Máte ešte nejaké otázky?"
        
        else:
            responses = [
                f"Zaujímavá otázka o '{user_input[:50]}...'! Môžete mi o tom povedať viac?",
                f"Rozumiem, že sa zaujímate o '{user_input[:50]}...'. Čo presne by ste chceli vedieť?",
                f"'{user_input[:50]}...' je skvelá téma! Ako vám môžem s tým pomôcť?",
                f"Dúfam, že vám môžem pomôcť s '{user_input[:50]}...'. Potrebujete konkrétne informácie?"
            ]
            response = responses[self.conversation_count % len(responses)]
        
        return response
    
    def _handle_definition_query(self, query: str) -> str:
        """Handle definition-style queries."""
        return f"""
📖 **K téme: {query}**

Nájdené nasledujúce informácie:

Pre presnú definíciu a podrobnosti odporúčam:
1. Vyhľadať na internete
2. Pozrieť encyklopédie
3. Konzultovať s odborníkmi

Ak potrebujete konkrétne informácie, neváhajte sa opýtať!
        """
    
    def _handle_calculator_query(self, query: str) -> str:
        """Handle calculator-style queries."""
        import re
        
        # Simple arithmetic detection
        numbers = re.findall(r'\d+', query)
        operations = ['+', '-', '*', '/']
        
        if len(numbers) >= 2 and any(op in query for op in operations):
            try:
                n1, n2 = int(numbers[0]), int(numbers[1])
                if '+' in query:
                    result = n1 + n2
                    op_symbol = '+'
                elif '-' in query:
                    result = n1 - n2
                    op_symbol = '-'
                elif '*' in query or '×' in query:
                    result = n1 * n2
                    op_symbol = '×'
                elif '/' in query:
                    result = n1 / n2 if n2 != 0 else "nedefinované"
                    op_symbol = '÷'
                else:
                    return "Ospravedlňujem sa, ale nerozumiem operácii."
                
                return f"""
🧮 **Kalkulačka**

```
{n1} {op_symbol} {n2} = {result}
```

Výsledok: **{result}**

Potrebujete ďalší výpočet?
                """
            except:
                return "Ospravedlňujem sa, ale nemôžem vykonať tento výpočet."
        
        return """
🔢 **Kalkulačka**

Môžem vykonať základné výpočty:
- Sčítanie: "sčítaj 5 a 3"
- Odčítanie: "odčítaj 2 od 10"
- Násobenie: "vynásob 4 a 7"
- Delenie: "vydel 20 4"

Aké výpočty potrebujete?
        """
    
    def get_stats(self) -> dict:
        """Get agent statistics."""
        stats = super().get_stats()
        stats.update({
            'conversation_count': self.conversation_count
        })
        return stats


# Entry point for agent loading
def create_agent(config: AgentConfig) -> DemoAgent:
    """Factory function to create DemoAgent instance."""
    return DemoAgent(config)
