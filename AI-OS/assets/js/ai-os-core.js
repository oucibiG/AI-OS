/**
 * AI-OS Core System - Inter-Application Communication & Shared State
 * Centrálny systém pre komunikáciu medzi aplikáciami a zdieľaný stav
 */

class AIOSCore {
    constructor() {
        this.version = '2.0.0';
        this.applications = new Map();
        this.sharedState = new Map();
        this.eventBus = new EventTarget();
        this.services = new Map();
        this.isInitialized = false;
        
        // Core data structures
        this.userProfile = {
            name: 'AI-OS User',
            preferences: new Map(),
            usagePatterns: new Map(),
            permissions: new Set(['*']),
            aiLevel: 0,
            lastActive: Date.now()
        };
        
        this.systemState = {
            battery: 85,
            memory: 65,
            cpu: 42,
            network: 'online',
            security: 'active',
            performance: 78,
            temperature: 35,
            storage: 67
        };
        
        this.appIntegration = new Map();
        this.aiAgents = new Map();
        this.notifications = [];
        this.activities = [];
        
        this.init();
    }
    
    async init() {
        console.log('🤖 Initializing AI-OS Core System...');
        
        // Initialize core services
        await this.initializeServices();
        
        // Setup inter-app communication
        this.setupCommunication();
        
        // Initialize AI agents
        await this.initializeAIAgents();
        
        // Start system monitoring
        this.startSystemMonitoring();
        
        // Setup user learning
        this.setupUserLearning();
        
        this.isInitialized = true;
        this.emit('aiOSInitialized', { version: this.version });
        
        console.log('✅ AI-OS Core System initialized');
    }
    
    async initializeServices() {
        // Core services available to all apps
        this.services.set('notification', new NotificationService(this));
        this.services.set('storage', new StorageService(this));
        this.services.set('ai', new AIService(this));
        this.services.set('security', new SecurityService(this));
        this.services.set('performance', new PerformanceService(this));
        this.services.set('network', new NetworkService(this));
        this.services.set('file', new FileService(this));
        this.services.set('terminal', new TerminalService(this));
        this.services.set('voice', new VoiceService(this));
        this.services.set('learning', new LearningService(this));
        
        console.log(`🚀 Initialized ${this.services.size} core services`);
    }
    
    setupCommunication() {
        // Setup postMessage for cross-frame communication
        window.addEventListener('message', (event) => {
            if (event.origin !== window.location.origin) return;
            
            const { type, data, source } = event.data;
            
            switch (type) {
                case 'appRegistration':
                    this.registerApplication(source, data);
                    break;
                case 'serviceRequest':
                    this.handleServiceRequest(source, data);
                    break;
                case 'stateUpdate':
                    this.handleStateUpdate(source, data);
                    break;
                case 'eventEmit':
                    this.emit(data.event, data.data, source);
                    break;
            }
        });
        
        // Setup storage event listeners for cross-tab communication
        window.addEventListener('storage', (event) => {
            if (event.key.startsWith('aiOS_')) {
                this.handleStorageUpdate(event);
            }
        });
    }
    
    async initializeAIAgents() {
        // Core AI agents available to all applications
        this.aiAgents.set('assistant', {
            name: 'AI Assistant',
            capabilities: ['chat', 'commands', 'help', 'learning'],
            active: true
        });
        
        this.aiAgents.set('optimizer', {
            name: 'Performance Optimizer',
            capabilities: ['optimization', 'monitoring', 'prediction'],
            active: true
        });
        
        this.aiAgents.set('security', {
            name: 'Security Guardian',
            capabilities: ['monitoring', 'protection', 'analysis'],
            active: true
        });
        
        this.aiAgents.set('learning', {
            name: 'Learning Engine',
            capabilities: ['pattern_recognition', 'adaptation', 'prediction'],
            active: true
        });
        
        this.aiAgents.set('voice', {
            name: 'Voice Controller',
            capabilities: ['speech_recognition', 'commands', 'navigation'],
            active: true
        });
        
        console.log(`🧠 Initialized ${this.aiAgents.size} AI agents`);
    }
    
    startSystemMonitoring() {
        // Monitor system state every 5 seconds
        setInterval(() => {
            this.updateSystemState();
            this.analyzeUserBehavior();
            this.optimizePerformance();
        }, 5000);
        
        // Monitor user activity
        this.setupUserActivityMonitoring();
        
        // Monitor app usage
        this.setupAppUsageMonitoring();
    }
    
    updateSystemState() {
        // Simulate system metrics updates
        this.systemState.battery = Math.max(0, this.systemState.battery - (Math.random() * 0.1));
        this.systemState.memory = Math.min(100, this.systemState.memory + (Math.random() * 2 - 1));
        this.systemState.cpu = Math.min(100, this.systemState.cpu + (Math.random() * 5 - 2));
        this.systemState.temperature = Math.max(25, Math.min(80, this.systemState.temperature + (Math.random() * 2 - 1)));
        
        this.emit('systemStateUpdate', this.systemState);
    }
    
    setupUserLearning() {
        this.userProfile.aiLevel = Math.min(100, this.userProfile.aiLevel + 0.1);
        
        // Learn from user interactions
        this.on('userAction', (data) => {
            this.learnFromUser(data);
        });
        
        // Predict user needs
        this.on('appLaunch', (data) => {
            this.predictUserNeeds(data);
        });
    }
    
    // Application Registration & Management
    registerApplication(appId, appData) {
        this.applications.set(appId, {
            ...appData,
            registeredAt: Date.now(),
            lastActive: Date.now(),
            state: 'active'
        });
        
        console.log(`📱 Registered application: ${appId}`);
        this.emit('appRegistered', { appId, appData });
    }
    
    unregisterApplication(appId) {
        this.applications.delete(appId);
        console.log(`📱 Unregistered application: ${appId}`);
        this.emit('appUnregistered', { appId });
    }
    
    // Inter-Application Communication
    sendMessage(toApp, message, fromApp = null) {
        const targetApp = this.applications.get(toApp);
        if (!targetApp) {
            console.warn(`⚠️ Application ${toApp} not found`);
            return false;
        }
        
        const fullMessage = {
            type: 'appMessage',
            from: fromApp,
            to: toApp,
            data: message,
            timestamp: Date.now()
        };
        
        this.emit('appMessage', fullMessage);
        return true;
    }
    
    broadcast(message, excludeApp = null) {
        this.applications.forEach((app, appId) => {
            if (appId !== excludeApp) {
                this.sendMessage(appId, message, 'aiOS-core');
            }
        });
    }
    
    // Shared State Management
    setSharedState(key, value, appId = null) {
        this.sharedState.set(key, {
            value,
            updatedBy: appId,
            timestamp: Date.now()
        });
        
        // Persist important state
        if (key.startsWith('persistent_')) {
            localStorage.setItem(`aiOS_${key}`, JSON.stringify(value));
        }
        
        this.emit('stateChange', { key, value, updatedBy: appId });
    }
    
    getSharedState(key, defaultValue = null) {
        const state = this.sharedState.get(key);
        return state ? state.value : defaultValue;
    }
    
    // Event System
    on(event, callback) {
        this.eventBus.addEventListener(event, callback);
    }
    
    off(event, callback) {
        this.eventBus.removeEventListener(event, callback);
    }
    
    emit(event, data = null, source = 'aiOS-core') {
        const eventData = {
            event,
            data,
            source,
            timestamp: Date.now()
        };
        
        this.eventBus.dispatchEvent(new CustomEvent(event, { detail: eventData }));
        
        // Log important events
        if (event.startsWith('system_') || event.startsWith('app_')) {
            this.logActivity(event, data, source);
        }
    }
    
    // Service Access
    getService(serviceName) {
        return this.services.get(serviceName);
    }
    
    requestService(serviceName, params = {}) {
        const service = this.getService(serviceName);
        if (service && typeof service.execute === 'function') {
            return service.execute(params);
        }
        return Promise.reject(new Error(`Service ${serviceName} not available`));
    }
    
    // AI Agent Access
    getAIAgent(agentName) {
        const agent = this.aiAgents.get(agentName);
        if (!agent || !agent.active) {
            return null;
        }
        return agent;
    }
    
    // User Activity & Learning
    learnFromUser(actionData) {
        // Update usage patterns
        const pattern = `${actionData.app}_${actionData.action}`;
        const current = this.userProfile.usagePatterns.get(pattern) || 0;
        this.userProfile.usagePatterns.set(pattern, current + 1);
        
        // Update AI level
        this.userProfile.aiLevel = Math.min(100, this.userProfile.aiLevel + 0.5);
        
        this.emit('userLearningUpdate', {
            pattern,
            level: this.userProfile.aiLevel,
            totalActions: this.userProfile.usagePatterns.size
        });
    }
    
    predictUserNeeds(data) {
        // Simple prediction based on patterns
        const recentActions = Array.from(this.userProfile.usagePatterns.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
        
        const predictions = recentActions.map(([pattern, count]) => {
            const [app, action] = pattern.split('_');
            return {
                app,
                action,
                probability: count / Math.max(...Array.from(this.userProfile.usagePatterns.values())),
                recommendation: `User often uses ${app} for ${action}`
            };
        });
        
        this.emit('userPredictions', predictions);
    }
    
    // System Monitoring
    setupUserActivityMonitoring() {
        let idleTime = 0;
        const idleThreshold = 300000; // 5 minutes
        
        const resetIdleTime = () => {
            idleTime = 0;
            this.userProfile.lastActive = Date.now();
        };
        
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, resetIdleTime, true);
        });
        
        setInterval(() => {
            idleTime += 1000;
            if (idleTime > idleThreshold) {
                this.emit('userIdle', { idleTime });
            }
        }, 1000);
    }
    
    setupAppUsageMonitoring() {
        this.on('appLaunch', (event) => {
            const appId = event.detail.data.appId;
            const app = this.applications.get(appId);
            if (app) {
                app.usageCount = (app.usageCount || 0) + 1;
                app.lastUsed = Date.now();
            }
        });
    }
    
    analyzeUserBehavior() {
        // Analyze recent user patterns
        const recentActivities = this.activities
            .filter(a => Date.now() - a.timestamp < 300000) // Last 5 minutes
            .slice(-20);
        
        if (recentActivities.length > 5) {
            const patterns = this.detectPatterns(recentActivities);
            if (patterns.length > 0) {
                this.emit('behaviorAnalysis', patterns);
            }
        }
    }
    
    detectPatterns(activities) {
        const patterns = [];
        const appSequence = activities.map(a => a.app).join('->');
        
        // Look for common app sequences
        const sequences = {};
        const apps = activities.map(a => a.app);
        
        for (let i = 0; i < apps.length - 1; i++) {
            const seq = `${apps[i]}->${apps[i+1]}`;
            sequences[seq] = (sequences[seq] || 0) + 1;
        }
        
        Object.entries(sequences).forEach(([seq, count]) => {
            if (count > 2) {
                patterns.push({
                    type: 'app_sequence',
                    pattern: seq,
                    frequency: count,
                    confidence: count / activities.length
                });
            }
        });
        
        return patterns;
    }
    
    optimizePerformance() {
        // Auto-optimize based on system state
        if (this.systemState.memory > 80) {
            this.emit('optimizeMemory', { reason: 'high_usage' });
        }
        
        if (this.systemState.cpu > 70) {
            this.emit('optimizeCPU', { reason: 'high_load' });
        }
        
        if (this.systemState.battery < 20) {
            this.emit('enablePowerSave', { reason: 'low_battery' });
        }
    }
    
    // Utility Methods
    logActivity(type, data, source) {
        this.activities.push({
            type,
            data,
            source,
            timestamp: Date.now()
        });
        
        // Keep only recent activities
        if (this.activities.length > 1000) {
            this.activities = this.activities.slice(-500);
        }
    }
    
    handleStorageUpdate(event) {
        try {
            const key = event.key.replace('aiOS_', '');
            const value = JSON.parse(event.newValue);
            this.setSharedState(key, value, 'storage-sync');
        } catch (error) {
            console.warn('Failed to parse storage update:', error);
        }
    }
    
    // Public API for Applications
    getAPI() {
        return {
            version: this.version,
            isInitialized: this.isInitialized,
            sendMessage: (to, message) => this.sendMessage(to, message),
            broadcast: (message) => this.broadcast(message),
            setState: (key, value) => this.setSharedState(key, value),
            getState: (key) => this.getSharedState(key),
            on: (event, callback) => this.on(event, callback),
            emit: (event, data) => this.emit(event, data),
            getService: (service) => this.getService(service),
            getAgent: (agent) => this.getAIAgent(agent),
            getUserProfile: () => this.userProfile,
            getSystemState: () => this.systemState,
            getApplications: () => Array.from(this.applications.keys())
        };
    }
}

// Core Services
class NotificationService {
    constructor(core) {
        this.core = core;
        this.notifications = [];
    }
    
    show(title, message, type = 'info', duration = 3000) {
        const notification = {
            id: Date.now(),
            title,
            message,
            type,
            timestamp: Date.now()
        };
        
        this.notifications.push(notification);
        this.core.emit('notification', notification);
        
        if (duration > 0) {
            setTimeout(() => this.hide(notification.id), duration);
        }
        
        return notification.id;
    }
    
    hide(id) {
        this.notifications = this.notifications.filter(n => n.id !== id);
        this.core.emit('notificationHidden', { id });
    }
}

class StorageService {
    constructor(core) {
        this.core = core;
    }
    
    set(key, value) {
        localStorage.setItem(`aiOS_${key}`, JSON.stringify(value));
        this.core.setSharedState(`persistent_${key}`, value, 'storage');
    }
    
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(`aiOS_${key}`);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            return defaultValue;
        }
    }
    
    remove(key) {
        localStorage.removeItem(`aiOS_${key}`);
    }
}

class AIService {
    constructor(core) {
        this.core = core;
    }
    
    async chat(message, context = {}) {
        // Simple AI response simulation
        const responses = [
            'Rozumiem vašej požiadavke.',
            'Môžem vám s tým pomôcť.',
            'Analyzujem vaše údaje.',
            'Navrhujem optimalizáciu systému.',
            'Sledujem vaše vzorce používania.'
        ];
        
        const response = responses[Math.floor(Math.random() * responses.length)];
        
        this.core.emit('aiResponse', {
            input: message,
            output: response,
            context,
            timestamp: Date.now()
        });
        
        return response;
    }
    
    analyze(data) {
        return {
            insights: ['Trend používania aplikácií', 'Optimalizácia výkonu'],
            recommendations: ['Zapnúť AI optimalizáciu', 'Využiť hlasové ovládanie'],
            confidence: 0.85
        };
    }
}

class SecurityService {
    constructor(core) {
        this.core = core;
    }
    
    scan() {
        this.core.emit('securityScan', {
            status: 'scanning',
            timestamp: Date.now()
        });
        
        setTimeout(() => {
            this.core.emit('securityScan', {
                status: 'completed',
                threats: 0,
                timestamp: Date.now()
            });
        }, 2000);
    }
    
    monitor() {
        return {
            firewall: 'active',
            antivirus: 'active',
            intrusion: 'clean',
            lastScan: Date.now()
        };
    }
}

class PerformanceService {
    constructor(core) {
        this.core = core;
    }
    
    optimize() {
        this.core.emit('performanceOptimization', {
            status: 'optimizing',
            timestamp: Date.now()
        });
        
        setTimeout(() => {
            this.core.emit('performanceOptimization', {
                status: 'completed',
                improvement: Math.random() * 20 + 10,
                timestamp: Date.now()
            });
        }, 1500);
    }
    
    getMetrics() {
        return this.core.systemState;
    }
}

class NetworkService {
    constructor(core) {
        this.core = core;
    }
    
    scan() {
        this.core.emit('networkScan', {
            status: 'scanning',
            timestamp: Date.now()
        });
        
        setTimeout(() => {
            this.core.emit('networkScan', {
                status: 'completed',
                devices: Math.floor(Math.random() * 10) + 5,
                timestamp: Date.now()
            });
        }, 3000);
    }
    
    getStatus() {
        return {
            online: true,
            speed: '100 Mbps',
            latency: 15,
            signal: 95
        };
    }
}

class FileService {
    constructor(core) {
        this.core = core;
    }
    
    list(path = '/') {
        return [
            { name: 'Documents', type: 'folder', size: 0 },
            { name: 'Pictures', type: 'folder', size: 0 },
            { name: 'AI-OS', type: 'folder', size: 0 },
            { name: 'System', type: 'folder', size: 0 }
        ];
    }
    
    upload(file) {
        this.core.emit('fileUploaded', {
            file: file.name,
            size: file.size,
            timestamp: Date.now()
        });
    }
}

class TerminalService {
    constructor(core) {
        this.core = core;
    }
    
    execute(command) {
        this.core.emit('terminalCommand', {
            command,
            timestamp: Date.now()
        });
        
        // Simulate command execution
        const responses = {
            'ls': 'AI-OS/  Documents/  Pictures/  System/',
            'ps': 'AI-OS Core  Voice Service  Security Monitor',
            'top': 'CPU: 45%  Memory: 67%  Load: 0.8',
            'whoami': 'ai-os-user',
            'pwd': '/home/ai-os-user'
        };
        
        const response = responses[command] || `Command executed: ${command}`;
        
        this.core.emit('terminalOutput', {
            command,
            output: response,
            timestamp: Date.now()
        });
        
        return response;
    }
}

class VoiceService {
    constructor(core) {
        this.core = core;
    }
    
    listen() {
        this.core.emit('voiceListening', {
            status: 'listening',
            timestamp: Date.now()
        });
    }
    
    stop() {
        this.core.emit('voiceStopped', {
            status: 'stopped',
            timestamp: Date.now()
        });
    }
    
    speak(text) {
        this.core.emit('voiceSpeaking', {
            text,
            timestamp: Date.now()
        });
    }
}

class LearningService {
    constructor(core) {
        this.core = core;
    }
    
    learnFromData(data) {
        this.core.userProfile.aiLevel = Math.min(100, this.core.userProfile.aiLevel + 1);
        
        this.core.emit('learningProgress', {
            level: this.core.userProfile.aiLevel,
            data,
            timestamp: Date.now()
        });
    }
    
    getRecommendations() {
        return [
            'Enable voice control for better efficiency',
            'Use AI learning center to customize interface',
            'Install performance optimizer for faster response',
            'Enable security monitoring for protection'
        ];
    }
}

// Initialize global AI-OS Core
if (typeof window !== 'undefined') {
    window.aiOSCore = new AIOSCore();
}