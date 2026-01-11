/**
 * AI-OS + Cerebrum Integration
 * 
 * This module provides integration between AI-OS interface and Cerebrum SDK.
 * It enables the use of Cerebrum agents and tools within the AI-OS ecosystem.
 */

class AIOSCerebrumIntegration {
    constructor() {
        this.agents = new Map();
        this.tools = new Map();
        this.memory = new Map();
        this.currentAgent = null;
        this.isInitialized = false;
        
        this.init();
    }
    
    async init() {
        console.log('🤖 Inicializujem AI-OS + Cerebrum integráciu...');
        
        // Load agents
        await this.loadDefaultAgents();
        
        // Load tools
        await this.loadDefaultTools();
        
        this.isInitialized = true;
        console.log('✅ AI-OS + Cerebrum integrácia pripravená');
    }
    
    async loadDefaultAgents() {
        // Demo Agent
        this.agents.set('demo', {
            id: 'demo',
            name: 'Demo Agent',
            description: 'Univerzálny demo agent pre testovanie',
            icon: '📝',
            capabilities: ['conversation', 'calculation', 'weather'],
            status: 'ready'
        });
        
        // Search Agent
        this.agents.set('search', {
            id: 'search',
            name: 'Vyhľadávací Agent',
            description: 'Agent pre vyhľadávanie informácií',
            icon: '🔍',
            capabilities: ['web-search', 'research', 'analysis'],
            status: 'ready'
        });
        
        // Writer Agent
        this.agents.set('writer', {
            id: 'writer',
            name: 'Autorský Agent',
            description: 'Agent pre generovanie obsahu',
            icon: '✍️',
            capabilities: ['writing', 'editing', 'translation'],
            status: 'ready'
        });
        
        console.log(`📦 Načítaných ${this.agents.size} agentov`);
    }
    
    async loadDefaultTools() {
        // Calculator Tool
        this.tools.set('calculator', {
            id: 'calculator',
            name: 'Kalkulačka',
            description: 'Základné matematické operácie',
            icon: '🧮',
            parameters: {
                operation: {
                    type: 'string',
                    enum: ['add', 'subtract', 'multiply', 'divide', 'power', 'sqrt']
                },
                a: { type: 'number' },
                b: { type: 'number' }
            }
        });
        
        // Weather Tool
        this.tools.set('weather', {
            id: 'weather',
            name: 'Počasie',
            description: 'Informácie o počasí',
            icon: '🌤️',
            parameters: {
                location: { type: 'string' },
                units: { type: 'string', enum: ['celsius', 'fahrenheit'] }
            }
        });
        
        // Search Tool
        this.tools.set('search', {
            id: 'search',
            name: 'Vyhľadávanie',
            description: 'Vyhľadávanie na internete',
            icon: '🔍',
            parameters: {
                query: { type: 'string' },
                limit: { type: 'number' }
            }
        });
        
        // Terminal Tool
        this.tools.set('terminal', {
            id: 'terminal',
            name: 'Terminál',
            description: 'Spúšťanie príkazov',
            icon: '💻',
            parameters: {
                command: { type: 'string' }
            }
        });
        
        console.log(`🔧 Načítaných ${this.tools.size} nástrojov`);
    }
    
    // Agent Management
    getAgent(agentId) {
        return this.agents.get(agentId);
    }
    
    getAllAgents() {
        return Array.from(this.agents.values());
    }
    
    async setCurrentAgent(agentId) {
        const agent = this.agents.get(agentId);
        if (agent) {
            this.currentAgent = agent;
            this.memory.set('currentAgent', agentId);
            console.log(`🤖 Aktuálny agent: ${agent.name}`);
            return agent;
        }
        return null;
    }
    
    // Tool Management
    getTool(toolId) {
        return this.tools.get(toolId);
    }
    
    getAllTools() {
        return Array.from(this.tools.values());
    }
    
    async executeTool(toolId, params) {
        const tool = this.tools.get(toolId);
        if (!tool) {
            throw new Error(`Nástroj ${toolId} nebol nájdený`);
        }
        
        console.log(`🔧 Spúšťam nástroj: ${tool.name}`, params);
        
        // Simulate tool execution
        await this.simulateToolExecution(tool, params);
        
        return {
            tool: tool.name,
            result: this.generateToolResult(toolId, params),
            timestamp: Date.now()
        };
    }
    
    async simulateToolExecution(tool, params) {
        // Add small delay to simulate real execution
        return new Promise(resolve => setTimeout(resolve, 500));
    }
    
    generateToolResult(toolId, params) {
        const results = {
            'calculator': () => {
                const { operation, a, b } = params;
                let result;
                switch(operation) {
                    case 'add': result = a + b; break;
                    case 'subtract': result = a - b; break;
                    case 'multiply': result = a * b; break;
                    case 'divide': result = b !== 0 ? a / b : 'Error'; break;
                    case 'power': result = Math.pow(a, b); break;
                    case 'sqrt': result = Math.sqrt(a); break;
                    default: result = 'Unknown operation';
                }
                return `Výsledok: ${result}`;
            },
            'weather': () => {
                return `Počasie v ${params.location || 'neurčenej lokácii'}: ☀️ 22°C, vlhkosť 65%`;
            },
            'search': () => {
                return `Výsledky vyhľadávania pre "${params.query}":\n1. Výsledok 1\n2. Výsledok 2\n3. Výsledok 3`;
            },
            'terminal': () => {
                return `Príkaz "${params.command}" bol vykonaný úspešne`;
            }
        };
        
        return (results[toolId] || (() => 'Neznámy nástroj'))();
    }
    
    // Memory Management
    saveMemory(key, data) {
        this.memory.set(key, {
            data,
            timestamp: Date.now()
        });
        console.log(`💾 Uložená pamäť: ${key}`);
    }
    
    loadMemory(key) {
        const mem = this.memory.get(key);
        return mem ? mem.data : null;
    }
    
    // Agent Interaction
    async chat(agentId, message) {
        const agent = this.getAgent(agentId);
        if (!agent) {
            throw new Error(`Agent ${agentId} nebol nájdený`);
        }
        
        console.log(`💬 Konverzácia s ${agent.name}:`, message);
        
        // Simulate agent response
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const responses = [
            `Rozumiem! "${message}" je zaujímavá téma.`,
            `Ďakujem za správu. Ako vám môžem pomôcť s "${message}"?`,
            `Výborne, "${message}" - môžeme pokračovať.`,
            `Zaujímavé! Povedzte mi viac o "${message}".`
        ];
        
        return {
            agent: agent.name,
            response: responses[Math.floor(Math.random() * responses.length)],
            timestamp: Date.now()
        };
    }
    
    // Utility Methods
    getStats() {
        return {
            agentsCount: this.agents.size,
            toolsCount: this.tools.size,
            currentAgent: this.currentAgent?.name || 'Žiadny',
            isInitialized: this.isInitialized
        };
    }
    
    async runAgentTask(agentId, task) {
        const agent = this.getAgent(agentId);
        if (!agent) {
            throw new Error(`Agent ${agentId} nebol nájdený}`);
        }
        
        console.log(`🚀 Spúšťam úlohu agenta ${agent.name}:`, task);
        
        // Simulate task execution
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        return {
            agent: agent.name,
            task,
            result: `Úloha "${task}" bola úspešne dokončená.`,
            timestamp: Date.now()
        };
    }
}

// Export for use
window.AIOSCerebrumIntegration = AIOSCerebrumIntegration;
