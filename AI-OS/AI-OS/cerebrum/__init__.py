#!/usr/bin/env python3
"""
Cerebrum - AIOS Agent SDK
Agent SDK for AI Agent Operating System (AIOS)

This module provides the core functionality for building and deploying
AI agents within the AIOS ecosystem.
"""

import os
import sys
import json
import time
import asyncio
import logging
from typing import Dict, List, Optional, Any, Callable
from dataclasses import dataclass, field
from abc import ABC, abstractmethod
from enum import Enum
from pathlib import Path
import hashlib

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class AgentState(Enum):
    """Possible states for an AI agent."""
    IDLE = "idle"
    RUNNING = "running"
    PAUSED = "paused"
    STOPPED = "stopped"
    ERROR = "error"
    THINKING = "thinking"


class ToolCallStatus(Enum):
    """Status of a tool call."""
    PENDING = "pending"
    EXECUTING = "executing"
    SUCCESS = "success"
    FAILED = "failed"


@dataclass
class AgentMessage:
    """Message exchanged between agent and system."""
    role: str  # 'user', 'assistant', 'system', 'tool'
    content: str
    tool_calls: Optional[List[Dict]] = None
    tool_call_id: Optional[str] = None
    timestamp: float = field(default_factory=time.time)
    metadata: Dict = field(default_factory=dict)


@dataclass
class ToolCall:
    """Represents a tool call made by the agent."""
    tool_name: str
    arguments: Dict[str, Any]
    call_id: str
    status: ToolCallStatus = ToolCallStatus.PENDING
    result: Optional[str] = None
    error: Optional[str] = None
    start_time: float = field(default_factory=time.time)
    end_time: Optional[float] = None


@dataclass
class AgentConfig:
    """Configuration for an AI agent."""
    name: str
    description: List[str]
    tools: List[str]
    author: str
    version: str
    license: str = "MIT"
    llm_backend: str = "openai"
    model_name: str = "gpt-4"
    system_prompt: Optional[str] = None
    max_iterations: int = 100
    timeout: int = 300
    memory_enabled: bool = True
    storage_enabled: bool = True


class LLMProvider(ABC):
    """Abstract base class for LLM providers."""
    
    @abstractmethod
    def generate(self, messages: List[Dict[str, str]], 
                 max_tokens: int = 4096,
                 temperature: float = 0.7,
                 **kwargs) -> str:
        """Generate a response from the LLM."""
        pass
    
    @abstractmethod
    def get_available_models(self) -> List[str]:
        """Get list of available models."""
        pass


class OpenAILLM(LLMProvider):
    """OpenAI LLM provider."""
    
    def __init__(self, api_key: Optional[str] = None, model: str = "gpt-4"):
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        self.model = model
        self.client = None
        self._init_client()
    
    def _init_client(self):
        try:
            from openai import OpenAI
            self.client = OpenAI(api_key=self.api_key)
            logger.info(f"OpenAI client initialized with model: {self.model}")
        except ImportError:
            logger.warning("OpenAI package not installed. Install with: pip install openai")
    
    def generate(self, messages: List[Dict[str, str]], 
                 max_tokens: int = 4096,
                 temperature: float = 0.7,
                 **kwargs) -> str:
        if not self.client:
            raise RuntimeError("OpenAI client not initialized")
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                max_tokens=max_tokens,
                temperature=temperature,
                **kwargs
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"OpenAI generation error: {e}")
            raise
    
    def get_available_models(self) -> List[str]:
        return ["gpt-4", "gpt-4-turbo", "gpt-3.5-turbo", "gpt-3.5-turbo-16k"]


class AnthropicLLM(LLMProvider):
    """Anthropic Claude LLM provider."""
    
    def __init__(self, api_key: Optional[str] = None, model: str = "claude-3-opus-20240229"):
        self.api_key = api_key or os.getenv("ANTHROPIC_API_KEY")
        self.model = model
        self.client = None
        self._init_client()
    
    def _init_client(self):
        try:
            import anthropic
            self.client = anthropic.Anthropic(api_key=self.api_key)
            logger.info(f"Anthropic client initialized with model: {self.model}")
        except ImportError:
            logger.warning("Anthropic package not installed. Install with: pip install anthropic")
    
    def generate(self, messages: List[Dict[str, str]], 
                 max_tokens: int = 4096,
                 temperature: float = 0.7,
                 **kwargs) -> str:
        if not self.client:
            raise RuntimeError("Anthropic client not initialized")
        
        try:
            # Convert messages format for Anthropic
            system_prompt = None
            formatted_messages = []
            for msg in messages:
                if msg["role"] == "system":
                    system_prompt = msg["content"]
                else:
                    formatted_messages.append(msg)
            
            response = self.client.messages.create(
                model=self.model,
                max_tokens=max_tokens,
                temperature=temperature,
                system=system_prompt,
                messages=formatted_messages,
                **kwargs
            )
            return response.content[0].text
        except Exception as e:
            logger.error(f"Anthropic generation error: {e}")
            raise
    
    def get_available_models(self) -> List[str]:
        return ["claude-3-opus-20240229", "claude-3-sonnet-20240229", "claude-3-haiku-20240307"]


class GroqLLM(LLMProvider):
    """Groq LLM provider."""
    
    def __init__(self, api_key: Optional[str] = None, model: str = "mixtral-8x7b-32768"):
        self.api_key = api_key or os.getenv("GROQ_API_KEY")
        self.model = model
        self.client = None
        self._init_client()
    
    def _init_client(self):
        try:
            from groq import Groq
            self.client = Groq(api_key=self.api_key)
            logger.info(f"Groq client initialized with model: {self.model}")
        except ImportError:
            logger.warning("Groq package not installed. Install with: pip install groq")
    
    def generate(self, messages: List[Dict[str, str]], 
                 max_tokens: int = 4096,
                 temperature: float = 0.7,
                 **kwargs) -> str:
        if not self.client:
            raise RuntimeError("Groq client not initialized")
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                max_tokens=max_tokens,
                temperature=temperature,
                **kwargs
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"Groq generation error: {e}")
            raise
    
    def get_available_models(self) -> List[str]:
        return ["mixtral-8x7b-32768", "llama2-70b-4096", "gemma-7b-it"]


class LLMManager:
    """Manager for LLM providers."""
    
    def __init__(self):
        self.providers: Dict[str, LLMProvider] = {}
        self.current_provider: Optional[str] = None
        self._init_default_providers()
    
    def _init_default_providers(self):
        """Initialize available LLM providers."""
        try:
            self.providers["openai"] = OpenAILLM()
            self.current_provider = "openai"
        except Exception as e:
            logger.warning(f"Could not initialize OpenAI: {e}")
        
        try:
            self.providers["anthropic"] = AnthropicLLM()
        except Exception as e:
            logger.warning(f"Could not initialize Anthropic: {e}")
        
        try:
            self.providers["groq"] = GroqLLM()
        except Exception as e:
            logger.warning(f"Could not initialize Groq: {e}")
    
    def set_provider(self, provider_name: str, model: Optional[str] = None):
        """Set the current LLM provider."""
        if provider_name not in self.providers:
            raise ValueError(f"Provider {provider_name} not available")
        
        if model:
            self.providers[provider_name].model = model
        
        self.current_provider = provider_name
        logger.info(f"Switched to provider: {provider_name}")
    
    def generate(self, messages: List[Dict[str, str]], 
                 max_tokens: int = 4096,
                 temperature: float = 0.7,
                 **kwargs) -> str:
        """Generate response using current provider."""
        if not self.current_provider:
            raise RuntimeError("No LLM provider configured")
        
        return self.providers[self.current_provider].generate(
            messages, max_tokens, temperature, **kwargs
        )
    
    def list_providers(self) -> Dict[str, List[str]]:
        """List available providers and models."""
        return {
            name: provider.get_available_models() 
            for name, provider in self.providers.items()
        }


class Tool(ABC):
    """Abstract base class for tools."""
    
    @property
    @abstractmethod
    def name(self) -> str:
        """Tool name."""
        pass
    
    @property
    @abstractmethod
    def description(self) -> str:
        """Tool description."""
        pass
    
    @abstractmethod
    def get_tool_call_format(self) -> Dict:
        """Get the tool call format for LLM."""
        pass
    
    @abstractmethod
    def run(self, params: Dict[str, Any]) -> str:
        """Execute the tool with given parameters."""
        pass


class ToolRegistry:
    """Registry for available tools."""
    
    def __init__(self):
        self.tools: Dict[str, Tool] = {}
        self.tool_calls: List[ToolCall] = []
    
    def register(self, tool: Tool):
        """Register a new tool."""
        self.tools[tool.name] = tool
        logger.info(f"Tool registered: {tool.name}")
    
    def unregister(self, tool_name: str):
        """Unregister a tool."""
        if tool_name in self.tools:
            del self.tools[tool_name]
            logger.info(f"Tool unregistered: {tool_name}")
    
    def get(self, tool_name: str) -> Optional[Tool]:
        """Get a tool by name."""
        return self.tools.get(tool_name)
    
    def list_tools(self) -> List[str]:
        """List all registered tools."""
        return list(self.tools.keys())
    
    def execute_tool(self, tool_name: str, params: Dict[str, Any]) -> str:
        """Execute a tool and record the call."""
        tool = self.get(tool_name)
        if not tool:
            raise ValueError(f"Tool not found: {tool_name}")
        
        call_id = hashlib.md5(f"{tool_name}{time.time()}".encode()).hexdigest()
        tool_call = ToolCall(
            tool_name=tool_name,
            arguments=params,
            call_id=call_id,
            status=ToolCallStatus.EXECUTING
        )
        self.tool_calls.append(tool_call)
        
        try:
            result = tool.run(params)
            tool_call.status = ToolCallStatus.SUCCESS
            tool_call.result = result
            tool_call.end_time = time.time()
            return result
        except Exception as e:
            tool_call.status = ToolCallStatus.FAILED
            tool_call.error = str(e)
            tool_call.end_time = time.time()
            raise


class MemoryManager:
    """Manager for agent memory."""
    
    def __init__(self, max_entries: int = 1000):
        self.short_term: List[AgentMessage] = []
        self.long_term: List[AgentMessage] = []
        self.max_entries = max_entries
        self.embeddings: Dict[str, List[float]] = {}
    
    def add(self, message: AgentMessage, memory_type: str = "short"):
        """Add a message to memory."""
        if memory_type == "short":
            self.short_term.append(message)
            if len(self.short_term) > self.max_entries:
                # Move oldest to long-term
                if self.short_term:
                    self.long_term.append(self.short_term.pop(0))
        else:
            self.long_term.append(message)
            if len(self.long_term) > self.max_entries:
                self.long_term.pop(0)
    
    def get_recent(self, n: int = 10) -> List[AgentMessage]:
        """Get recent messages."""
        return self.short_term[-n:]
    
    def get_all(self) -> List[AgentMessage]:
        """Get all messages."""
        return self.long_term + self.short_term
    
    def clear(self, memory_type: str = "short"):
        """Clear memory."""
        if memory_type == "short":
            self.short_term = []
        else:
            self.long_term = []
    
    def search(self, query: str, n: int = 5) -> List[AgentMessage]:
        """Search memory (simple text matching)."""
        results = []
        for msg in reversed(self.get_all()):
            if query.lower() in msg.content.lower():
                results.append(msg)
                if len(results) >= n:
                    break
        return results
    
    def save_to_disk(self, filepath: str):
        """Save memory to disk."""
        data = {
            "short_term": [{"role": m.role, "content": m.content, "timestamp": m.timestamp} 
                          for m in self.short_term],
            "long_term": [{"role": m.role, "content": m.content, "timestamp": m.timestamp} 
                         for m in self.long_term]
        }
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=2)
        logger.info(f"Memory saved to {filepath}")
    
    def load_from_disk(self, filepath: str):
        """Load memory from disk."""
        with open(filepath, 'r') as f:
            data = json.load(f)
        
        self.short_term = [AgentMessage(**m) for m in data.get("short_term", [])]
        self.long_term = [AgentMessage(**m) for m in data.get("long_term", [])]
        logger.info(f"Memory loaded from {filepath}")


class StorageManager:
    """Manager for agent storage."""
    
    def __init__(self, base_path: str = "./storage"):
        self.base_path = Path(base_path)
        self.base_path.mkdir(parents=True, exist_ok=True)
    
    def save(self, key: str, data: Any, format: str = "json"):
        """Save data to storage."""
        filepath = self.base_path / f"{key}.{format}"
        
        if format == "json":
            with open(filepath, 'w') as f:
                json.dump(data, f, indent=2)
        elif format == "txt":
            with open(filepath, 'w') as f:
                f.write(str(data))
        else:
            raise ValueError(f"Unsupported format: {format}")
        
        logger.info(f"Saved {key} to {filepath}")
        return str(filepath)
    
    def load(self, key: str, format: str = "json") -> Any:
        """Load data from storage."""
        filepath = self.base_path / f"{key}.{format}"
        
        if not filepath.exists():
            raise FileNotFoundError(f"File not found: {filepath}")
        
        if format == "json":
            with open(filepath, 'r') as f:
                return json.load(f)
        elif format == "txt":
            with open(filepath, 'r') as f:
                return f.read()
        else:
            raise ValueError(f"Unsupported format: {format}")
    
    def delete(self, key: str):
        """Delete data from storage."""
        filepath = self.base_path / f"{key}.json"
        if filepath.exists():
            filepath.unlink()
            logger.info(f"Deleted {key}")
    
    def list_keys(self) -> List[str]:
        """List all stored keys."""
        return [f.stem for f in self.base_path.glob("*.json")]


class AgentBase(ABC):
    """Base class for AI agents."""
    
    def __init__(self, config: AgentConfig):
        self.config = config
        self.state = AgentState.IDLE
        self.llm = LLMManager()
        self.tools = ToolRegistry()
        self.memory = MemoryManager() if config.memory_enabled else None
        self.storage = StorageManager() if config.storage_enabled else None
        self.conversation_history: List[AgentMessage] = []
        self.tool_calls: List[ToolCall] = []
        self.iteration_count = 0
        self.start_time: Optional[float] = None
        
        # Callbacks
        self.on_thinking: Optional[Callable] = None
        self.on_tool_call: Optional[Callable] = None
        self.on_state_change: Optional[Callable] = None
    
    def set_thinking_callback(self, callback: Callable):
        """Set callback for thinking state."""
        self.on_thinking = callback
    
    def set_tool_callback(self, callback: Callable):
        """Set callback for tool calls."""
        self.on_tool_call = callback
    
    def set_state_callback(self, callback: Callable):
        """Set callback for state changes."""
        self.on_state_change = callback
    
    def _update_state(self, new_state: AgentState):
        """Update agent state with callback."""
        old_state = self.state
        self.state = new_state
        if self.on_state_change:
            self.on_state_change(old_state, new_state)
    
    def register_tool(self, tool: Tool):
        """Register a tool with the agent."""
        self.tools.register(tool)
    
    def add_system_prompt(self, prompt: str):
        """Add or update system prompt."""
        self.config.system_prompt = prompt
    
    def build_messages(self) -> List[Dict[str, str]]:
        """Build message list for LLM."""
        messages = []
        
        # Add system prompt
        system_content = self.config.system_prompt or self._default_system_prompt()
        if system_content:
            messages.append({"role": "system", "content": system_content})
        
        # Add available tools info
        if self.tools.list_tools():
            tools_description = self._build_tools_description()
            messages.append({
                "role": "system", 
                "content": f"\n\nAvailable tools:\n{tools_description}"
            })
        
        # Add conversation history
        for msg in self.conversation_history:
            msg_dict = {"role": msg.role, "content": msg.content}
            if msg.tool_calls:
                msg_dict["tool_calls"] = msg.tool_calls
            messages.append(msg_dict)
        
        return messages
    
    def _default_system_prompt(self) -> str:
        """Get default system prompt."""
        return f"""You are {self.config.name}, an AI agent.

{chr(10).join(self.config.description)}

You are helpful, creative, and always strive to complete tasks effectively.
When you need to use tools, make sure to call them with the correct format."""
    
    def _build_tools_description(self) -> str:
        """Build description of available tools."""
        descriptions = []
        for tool_name in self.tools.list_tools():
            tool = self.tools.get(tool_name)
            if tool:
                format_info = tool.get_tool_call_format()
                descriptions.append(f"- {tool_name}: {tool.description}")
        return "\n".join(descriptions)
    
    def _parse_tool_calls(self, response: str) -> List[Dict]:
        """Parse tool calls from LLM response."""
        # Simple parsing - in production, use proper parsing
        tool_calls = []
        
        # Look for tool call patterns
        import re
        pattern = r'<tool_call>(.*?)</tool_call>'
        matches = re.findall(pattern, response, re.DOTALL)
        
        for match in matches:
            try:
                import json
                tool_data = json.loads(match)
                tool_calls.append(tool_data)
            except:
                pass
        
        return tool_calls
    
    async def think(self, user_input: str) -> str:
        """Main thinking loop for the agent."""
        self._update_state(AgentState.THINKING)
        
        # Add user message
        user_msg = AgentMessage(role="user", content=user_input)
        self.conversation_history.append(user_msg)
        self.iteration_count += 1
        
        # Build messages for LLM
        messages = self.build_messages()
        
        # Get response from LLM
        response = self.llm.generate(
            messages=messages,
            max_tokens=4096,
            temperature=0.7
        )
        
        # Parse and execute tool calls
        tool_calls = self._parse_tool_calls(response)
        
        if tool_calls:
            for tool_call in tool_calls:
                await self.execute_tool_call(tool_call)
                self.iteration_count += 1
                
                if self.iteration_count >= self.config.max_iterations:
                    break
        
        # Add assistant response
        assistant_msg = AgentMessage(
            role="assistant", 
            content=response,
            tool_calls=tool_calls if tool_calls else None
        )
        self.conversation_history.append(assistant_msg)
        
        # Save to memory
        if self.memory:
            self.memory.add(user_msg)
            self.memory.add(assistant_msg)
        
        return response
    
    async def execute_tool_call(self, tool_call: Dict):
        """Execute a tool call."""
        tool_name = tool_call.get("name")
        arguments = tool_call.get("arguments", {})
        
        if self.on_tool_call:
            self.on_tool_call(tool_name, arguments)
        
        try:
            result = self.tools.execute_tool(tool_name, arguments)
            
            # Add tool result to conversation
            tool_msg = AgentMessage(
                role="tool",
                content=result,
                tool_call_id=tool_call.get("id")
            )
            self.conversation_history.append(tool_msg)
            
            if self.memory:
                self.memory.add(tool_msg)
            
            return result
        except Exception as e:
            error_msg = f"Tool execution failed: {str(e)}"
            logger.error(error_msg)
            return error_msg
    
    async def run(self, task: str) -> str:
        """Run the agent on a task."""
        self._update_state(AgentState.RUNNING)
        self.start_time = time.time()
        
        try:
            result = await self.think(task)
            self._update_state(AgentState.IDLE)
            return result
        except Exception as e:
            logger.error(f"Agent error: {e}")
            self._update_state(AgentState.ERROR)
            raise
    
    def stop(self):
        """Stop the agent."""
        self._update_state(AgentState.STOPPED)
    
    def reset(self):
        """Reset agent state."""
        self.conversation_history = []
        self.tool_calls = []
        self.iteration_count = 0
        self.state = AgentState.IDLE
        if self.memory:
            self.memory.clear()
    
    def get_stats(self) -> Dict:
        """Get agent statistics."""
        return {
            "state": self.state.value,
            "iterations": self.iteration_count,
            "messages": len(self.conversation_history),
            "tools_used": len(self.tool_calls),
            "uptime": time.time() - self.start_time if self.start_time else 0
        }


class ComputerUseAgent:
    """Computer-use agent (LiteCUA) for computer interaction."""
    
    def __init__(self):
        self.state = "idle"
        self.actions: List[Dict] = []
        self.screen_cache: Optional[str] = None
        
    async def analyze_screen(self, screenshot: str) -> str:
        """Analyze current screen state."""
        # In production, this would use vision model
        self.screen_cache = screenshot
        return f"Screen analyzed: {len(screenshot)} bytes"
    
    async def click(self, x: int, y: int) -> str:
        """Click at coordinates."""
        self.actions.append({"action": "click", "x": x, "y": y})
        return f"Clicked at ({x}, {y})"
    
    async def type_text(self, text: str) -> str:
        """Type text."""
        self.actions.append({"action": "type", "text": text})
        return f"Typed: {text[:50]}..."
    
    async def press_key(self, key: str) -> str:
        """Press a key."""
        self.actions.append({"action": "press", "key": key})
        return f"Pressed: {key}"
    
    async def scroll(self, direction: str, amount: int = 100) -> str:
        """Scroll up or down."""
        self.actions.append({"action": "scroll", "direction": direction, "amount": amount})
        return f"Scrolled {direction} by {amount}px"
    
    async def navigate_to(self, url: str) -> str:
        """Navigate to URL."""
        self.actions.append({"action": "navigate", "url": url})
        return f"Navigated to {url}"
    
    async def get_page_content(self) -> str:
        """Get current page content."""
        return f"Page content from {len(self.actions)} actions"


class CerebrumClient:
    """Main client for Cerebrum SDK."""
    
    def __init__(self):
        self.llm = LLMManager()
        self.tools = ToolRegistry()
        self.memory = MemoryManager()
        self.storage = StorageManager()
    
    def create_agent(self, config: AgentConfig) -> AgentBase:
        """Create a new agent instance."""
        return AgentBase(config)
    
    def list_available_llms(self) -> Dict[str, List[str]]:
        """List available LLM providers."""
        return self.llm.list_providers()
    
    def load_tool(self, tool_path: str, local: bool = True) -> Tool:
        """Load a tool from path."""
        # Dynamic import based on path
        import importlib.util
        
        module_name = tool_path.split('/')[-1]
        spec = importlib.util.spec_from_file_location(
            module_name, 
            f"{tool_path}/entry.py"
        )
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        
        # Get tool class from config
        with open(f"{tool_path}/config.json", 'r') as f:
            config = json.load(f)
        
        tool_class = getattr(module, config["build"]["module"])
        return tool_class()
    
    def run_agent(self, agent: AgentBase, task: str) -> str:
        """Run an agent synchronously."""
        import asyncio
        
        async def _run():
            return await agent.run(task)
        
        return asyncio.run(_run())


# AutoTool class for easy tool loading
class AutoTool:
    """Auto-loading tool wrapper."""
    
    @staticmethod
    def from_preloaded(tool_path: str, local: bool = True) -> Tool:
        """Load a prebuilt tool."""
        client = CerebrumClient()
        return client.load_tool(tool_path, local)


# CLI commands
def run_agent_command(mode: str, agent_path: str, task: str, 
                      agent_author: str = None, agent_name: str = None,
                      agent_version: str = None, agenthub_url: str = None):
    """CLI command to run an agent."""
    client = CerebrumClient()
    
    if mode == "local":
        # Load agent from local path
        config_path = Path(agent_path) / "config.json"
        with open(config_path, 'r') as f:
            config_data = json.load(f)
        
        config = AgentConfig(
            name=config_data["name"],
            description=config_data["description"],
            tools=config_data.get("tools", []),
            author=config_data["meta"]["author"],
            version=config_data["meta"]["version"],
            license=config_data["meta"].get("license", "MIT")
        )
        
        agent = client.create_agent(config)
        
        # Load tools from config
        for tool_ref in config.tools:
            tool = client.load_tool(f"cerebrum/tool/core/{tool_ref}", local=True)
            agent.register_tool(tool)
        
        result = client.run_agent(agent, task)
        print(result)
        
    else:
        # Load from agenthub
        print(f"Loading agent from: {agenthub_url}")
        # In production, this would download from agenthub


def list_local_agents(agent_path: str = "cerebrum/example/agents"):
    """List available local agents."""
    agents = []
    agent_dir = Path(agent_path)
    
    if agent_dir.exists():
        for author_dir in agent_dir.iterdir():
            if author_dir.is_dir():
                for agent_dir_inner in author_dir.iterdir():
                    if agent_dir_inner.is_dir():
                        agents.append(f"{author_dir.name}/{agent_dir_inner.name}")
    
    return agents


def list_local_tools(tool_path: str = "cerebrum/tool/core"):
    """List available local tools."""
    tools = []
    tool_dir = Path(tool_path)
    
    if tool_dir.exists():
        for author_dir in tool_dir.iterdir():
            if author_dir.is_dir():
                for tool_dir_inner in author_dir.iterdir():
                    if tool_dir_inner.is_dir():
                        tools.append(f"{author_dir.name}/{tool_dir_inner.name}")
    
    return tools


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Cerebrum - AIOS Agent SDK")
    subparsers = parser.add_subparsers(dest="command", help="Available commands")
    
    # Run agent command
    run_parser = subparsers.add_parser("run-agent", help="Run an agent")
    run_parser.add_argument("--mode", choices=["local", "remote"], required=True)
    run_parser.add_argument("--agent_path", help="Path to agent directory")
    run_parser.add_argument("--agent_author", help="Agent author (for remote)")
    run_parser.add_argument("--agent_name", help="Agent name (for remote)")
    run_parser.add_argument("--agent_version", help="Agent version (for remote)")
    run_parser.add_argument("--task", required=True, help="Task to execute")
    run_parser.add_argument("--agenthub_url", default="https://app.aios.foundation")
    
    # List agents
    list_parser = subparsers.add_parser("list-agents", help="List available agents")
    list_parser.add_argument("--local", action="store_true", help="List local agents")
    list_parser.add_argument("--remote", action="store_true", help="List remote agents")
    
    # List tools
    list_tools_parser = subparsers.add_parser("list-tools", help="List available tools")
    list_tools_parser.add_argument("--local", action="store_true", help="List local tools")
    list_tools_parser.add_argument("--remote", action="store_true", help="List remote tools")
    
    args = parser.parse_args()
    
    if args.command == "run-agent":
        run_agent_command(
            args.mode,
            args.agent_path,
            args.task,
            args.agent_author,
            args.agent_name,
            args.agent_version,
            args.agenthub_url
        )
    elif args.command == "list-agents":
        if args.local:
            for agent in list_local_agents():
                print(agent)
        else:
            print("Use --local or --remote flag")
    elif args.command == "list-tools":
        if args.local:
            for tool in list_local_tools():
                print(tool)
        else:
            print("Use --local or --remote flag")
    else:
        parser.print_help()
