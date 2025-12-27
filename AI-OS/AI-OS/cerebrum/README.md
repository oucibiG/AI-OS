# Cerebrum - AIOS Agent SDK

Cerebrum je Agent SDK (Software Development Kit) pre AIOS (AI Agent Operating System). AIOS je navrhnutý na integráciu veľkých jazykových modelov (LLM) do operačného systému na uľahčenie vývoja a nasadzovania AI agentov.

## Funkcie

- **Vývoj a nasadzovanie agentov**: Umožňuje používateľom a vývojárom budovať a spúšťať agentové aplikácie
- **Integrácia s počítačom**: LiteCUA agent pre interakciu s počítačom ako MCP Server
- **Komplexná podpora životného cyklu**: Vývoj, nasadenie, distribúcia a objavovanie agentov
- **Podpora LLM jadier**: Integrácia s rôznymi poskytovateľmi LLM

## Podporovaní Poskytovatelia LLM

| Poskytovateľ | Názov Modelu | Open Source | Reťazec Modelu |
|:-------------|:-------------|:-----------:|:---------------|
| Anthropic | Všetky Modely | ❌ | model-name |
| OpenAI | Všetky Modely | ✅ | model-name |
| Deepseek | Všetky Modely | ✅ | model-name |
| Google | Všetky Modely | ❌ | model-name |
| Groq | Všetky Modely | ✅ | model-name |
| HuggingFace | Všetky Modely | ✅ | model-name |
| ollama | Všetky Modely | ✅ | model-name |
| vLLM | Všetky Modely | ✅ | model-name |
| Novita | Všetky Modely | ✅ | model-name |

## Inštalácia

### 1. Klonovanie repozitára

```bash
git clone https://github.com/agiresearch/Cerebrum.git
cd Cerebrum
```

### 2. Vytvorenie virtuálneho prostredia

```bash
# Použitím conda
conda create -n cerebrum-env python=3.10
conda activate cerebrum-env

# Alebo použitím venv
python -m venv cerebrum-env
source cerebrum-env/bin/activate  # Linux/MacOS
cerebrum-env\Scripts\activate     # Windows
```

### 3. Inštalácia balíka

```bash
# Použitím uv (odporúčané)
pip install uv
uv pip install -e .

# Alebo použitím pip
pip install -e .
```

### 4. Overenie inštalácie

```bash
python -c "import cerebrum; print('Cerebrum úspešne nainštalovaný!')"
```

## Rýchly Štart

### Použitie Python API

```python
import cerebrum
from cerebrum import AgentConfig, CerebrumClient

# Vytvorenie klienta
client = CerebrumClient()

# Vytvorenie agenta
config = AgentConfig(
    name="Môj Agent",
    description=["Pomocný AI asistent"],
    tools=["vyhladavanie"],
    author="ja",
    version="1.0.0"
)

agent = client.create_agent(config)

# Spustenie agenta
result = client.run_agent(agent, "Ahoj, ako sa máš?")
print(result)
```

### Použitie Web Interface

Otvorte súbor `cerebrum-interface.html` vo webovom prehliadači:

```bash
# Lokálne
open AI-OS/cerebrum-interface.html

# Alebo pomocou HTTP servera
python -m http.server 8000
# Potom otvorte http://localhost:8000/AI-OS/cerebrum-interface.html
```

## Architektúra

```
Cerebrum/
├── __init__.py          # Hlavný modul SDK
├── cerebrum-interface.html  # Webové rozhranie
├── requirements.txt     # Závislosti
└── README.md           # Tento súbor
```

### Hlavné Komponenty

1. **Agent Core**: Jadro agenta s podporou pre LLM, nástroje a pamäť
2. **Tool Registry**: Správa a registrácia nástrojov
3. **Memory Manager**: Krátkodobá a dlhodobá pamäť
4. **LLM Integration**: Podpora pre OpenAI, Anthropic, Groq a ďalšie

## API Referencia

### AgentConfig

Konfigurácia pre AI agenta:

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
    max_iterations: int = 100      # Maximálny počet iterácií
    timeout: int = 300             # Timeout v sekundách
```

### LLM Providers

```python
# OpenAI
from cerebrum import OpenAILLM
llm = OpenAILLM(api_key="sk-...", model="gpt-4")

# Anthropic
from cerebrum import AnthropicLLM
llm = AnthropicLLM(api_key="sk-ant-...", model="claude-3-opus-20240229")

# Groq
from cerebrum import GroqLLM
llm = GroqLLM(api_key="gsk-...", model="mixtral-8x7b-32768")
```

### Tool Registry

```python
from cerebrum import ToolRegistry, Tool

class MôjNástroj(Tool):
    @property
    def name(self) -> str:
        return "môj_nástroj"
    
    @property
    def description(self) -> str:
        return "Popis môjho nástroja"
    
    def get_tool_call_format(self) -> Dict:
        return {
            "name": self.name,
            "description": self.description,
            "parameters": {
                "type": "object",
                "properties": {
                    "param1": {"type": "string", "description": "Parameter 1"}
                },
                "required": ["param1"]
            }
        }
    
    def run(self, params: Dict[str, Any]) -> str:
        # Logika nástroja
        return "Výsledok"

registry = ToolRegistry()
registry.register(MôjNástroj())
```

### Memory Manager

```python
from cerebrum import MemoryManager

memory = MemoryManager(max_entries=1000)

# Pridanie správy
memory.add(AgentMessage(role="user", content="Ahoj"))

# Získanie posledných správ
recent = memory.get_recent(10)

# Uloženie na disk
memory.save_to_disk("memory.json")

# Načítanie z disku
memory.load_from_disk("memory.json")
```

## CLI Príkazy

```bash
# Spustenie agenta lokálne
cerebrum run-agent --mode local --agent_path cesta/k/agentovi --task "úloha"

# Spustenie agenta zo vzdialeného úložiska
cerebrum run-agent --mode remote --agent_author autor --agent_name agent --agent_version 0.0.1 --task "úloha"

# Zoznam lokálnych agentov
cerebrum list-agents --local

# Zoznam lokálnych nástrojov
cerebrum list-tools --local
```

## Integrácia s AI-OS

Cerebrum je kompatibilný s AI-OS projektom. Pre integráciu:

1. Skopírujte `cerebrum/` do vášho AI-OS projektu
2. Použite `cerebrum-interface.html` ako šablónu pre agentové rozhranie
3. Importujte a používajte Python modul vo vašich skriptoch

## Licencia

MIT License

## Prispievatelia

Ďakujeme všetkým prispievateľom za ich prácu na Cerebrum!
