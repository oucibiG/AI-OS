# Cerebrum Implementation for AI-OS

## Prehľad Implementácie

Tento dokument popisuje kompletnú implementáciu Cerebrum SDK pre AI-OS projekt. Cerebrum je Agent SDK (Software Development Kit) pre AIOS (AI Agent Operating System), ktorý umožňuje vývoj a nasadzovanie AI agentov.

## Štruktúra Súborov

```
AI-OS/
├── cerebrum/
│   ├── __init__.py              # Hlavný Python SDK modul
│   ├── requirements.txt         # Závislosti Python balíka
│   ├── README.md                # Dokumentácia SDK
│   └── example/
│       ├── agents/
│       │   └── demo_agent/
│       │       ├── config.json  # Konfigurácia agenta
│       │       └── agent.py     # Implementácia agenta
│       └── tools/
│           └── demo/
│               ├── calculator/
│               │   ├── config.json
│               │   └── entry.py
│               └── weather/
│                   ├── config.json
│                   └── entry.py
├── cerebrum-interface.html      # Webové rozhranie
├── cerebrum/
│   └── README.md                # README pre AI-OS integráciu
└── js/
    └── cerebrum-integration.js  # Integrácia s AI-OS
```

## Komponenty

### 1. Python SDK (`cerebrum/__init__.py`)

Hlavný modul obsahuje:

- **AgentBase**: Abstraktná trieda pre vytváranie agentov
- **AgentConfig**: Konfigurácia agenta (názov, popis, nástroje, LLM)
- **LLM Providers**: OpenAI, Anthropic, Groq integrácia
- **ToolRegistry**: Správa a registrácia nástrojov
- **MemoryManager**: Krátkodobá a dlhodobá pamäť
- **StorageManager**: Ukladanie dát na disk
- **ComputerUseAgent**: Agent pre interakciu s počítačom
- **CerebrumClient**: Hlavný klient pre SDK

### 2. Webové Rozhranie (`cerebrum-interface.html`)

Kompletné webové rozhranie s:

- Dashboard prehľad
- Agent Chat rozhranie
- Správa nástrojov
- Pamäť agenta
- LLM konfigurácia
- Terminál
- Nastavenia

### 3. JavaScript Integrácia (`cerebrum-integration.js`)

Integrácia s existujúcim AI-OS rozhraním:

- Správa agentov
- Vykonávanie nástrojov
- Pamäťová správa
- Interakcia s agentmi

## Použitie

### Python API

```python
from cerebrum import AgentConfig, CerebrumClient

# Vytvorenie klienta
client = CerebrumClient()

# Konfigurácia agenta
config = AgentConfig(
    name="Môj Agent",
    description=["Popis agenta"],
    tools=["calculator", "weather"],
    author="ja",
    version="1.0.0"
)

# Vytvorenie agenta
agent = client.create_agent(config)

# Spustenie agenta
result = client.run_agent(agent, "Ahoj, ako sa máš?")
print(result)
```

### Webové Rozhranie

1. Otvorte `cerebrum-interface.html` v prehliadači
2. Používajte dashboard pre správu
3. Konverzujte s agentom cez chat rozhranie
4. Konfigurujte LLM modely

### Integrácia s AI-OS

```javascript
// Inicializácia integrácie
const cerebrum = new AIOSCerebrumIntegration();

// Získanie zoznamu agentov
const agents = cerebrum.getAllAgents();

// Spustenie agenta
const result = await cerebrum.runAgentTask('demo', 'Úloha pre agenta');

// Vykonanie nástroja
const toolResult = await cerebrum.executeTool('calculator', {
    operation: 'add',
    a: 5,
    b: 3
});
```

## Podporované LLM Modely

| Poskytovateľ | Modely |
|:-------------|:-------|
| OpenAI | GPT-4, GPT-4 Turbo, GPT-3.5 Turbo |
| Anthropic | Claude 3 Opus, Sonnet, Haiku |
| Groq | Mixtral 8x7b, Llama 2 70b |

## Príklad Agenta

```python
from cerebrum import AgentBase, AgentConfig

class DemoAgent(AgentBase):
    def __init__(self, config: AgentConfig):
        super().__init__(config)
        self.add_system_prompt("You are a helpful assistant.")
    
    async def think(self, user_input: str) -> str:
        # Spracovanie vstupu
        return "Odpoveď agenta"
```

## Príklad Nástroja

```python
from cerebrum import Tool

class CalculatorTool(Tool):
    @property
    def name(self) -> str:
        return "calculator"
    
    @property
    def description(self) -> str:
        return "Basic calculator operations"
    
    def get_tool_call_format(self) -> Dict:
        return {
            "name": self.name,
            "description": self.description,
            "parameters": {...}
        }
    
    def run(self, params: Dict[str, Any]) -> str:
        # Vykonanie operácie
        return "Výsledok"
```

## API Referencia

### AgentConfig

```python
@dataclass
class AgentConfig:
    name: str                       # Názov agenta
    description: List[str]         # Popis agenta
    tools: List[str]               # Zoznam nástrojov
    author: str                    # Autor
    version: str                   # Verzia
    llm_backend: str = "openai"    # LLM backend
    model_name: str = "gpt-4"      # Názov modelu
    max_iterations: int = 100      # Max iterácie
    timeout: int = 300             # Timeout (sekundy)
```

### Tool Class

```python
class Tool(ABC):
    @property
    @abstractmethod
    def name(self) -> str: pass
    
    @property
    @abstractmethod
    def description(self) -> str: pass
    
    @abstractmethod
    def get_tool_call_format(self) -> Dict: pass
    
    @abstractmethod
    def run(self, params: Dict[str, Any]) -> str: pass
```

## Inštalácia

```bash
# Klonovanie a inštalácia
git clone <repo>
cd AI-OS/cerebrum
pip install -e .

# Spustenie webového rozhrania
open cerebrum-interface.html
```

## Stav Implementácie

- [x] Python SDK základ
- [x] Agent systém
- [x] Tool Registry
- [x] Memory Manager
- [x] LLM Integrácia (OpenAI, Anthropic, Groq)
- [x] Webové rozhranie
- [x] AI-OS Integrácia
- [x] Príklady agentov
- [x] Príklady nástrojov

## Ďalší Vývoj

- [ ] MCP Server integrácia
- [ ] Viac LLM poskytovateľov
- [ ] Pokročilé tool volania
- [ ] AgentHub integrácia
- [ ] ToolHub integrácia

## Licencia

MIT License
