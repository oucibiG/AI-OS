/**
 * AI-OS App Integration Helper
 * Pomocná funkcia pre integráciu aplikácií s AI-OS Core systémom
 */

class AIOSAppIntegration {
    constructor(appId, appName, capabilities = []) {
        this.appId = appId;
        this.appName = appName;
        this.capabilities = capabilities;
        this.isRegistered = false;
        this.api = null;
        this.eventHandlers = new Map();
        
        this.init();
    }
    
    init() {
        // Wait for AI-OS Core to be available
        if (window.aiOSCore) {
            this.setupIntegration();
        } else {
            // Wait for AI-OS Core to initialize
            const checkCore = setInterval(() => {
                if (window.aiOSCore) {
                    clearInterval(checkCore);
                    this.setupIntegration();
                }
            }, 100);
            
            // Timeout after 10 seconds
            setTimeout(() => {
                clearInterval(checkCore);
                console.warn('⚠️ AI-OS Core not available, running in standalone mode');
            }, 10000);
        }
    }
    
    setupIntegration() {
        this.api = window.aiOSCore.getAPI();
        
        // Register with AI-OS Core
        this.registerWithCore();
        
        // Setup communication handlers
        this.setupCommunication();
        
        // Setup event listeners
        this.setupEventListeners();
        
        console.log(`✅ ${this.appName} integrated with AI-OS Core`);
    }
    
    registerWithCore() {
        if (this.api && !this.isRegistered) {
            window.aiOSCore.registerApplication(this.appId, {
                name: this.appName,
                capabilities: this.capabilities,
                version: '2.0.0',
                url: window.location.href
            });
            
            this.isRegistered = true;
            
            // Notify parent window
            if (window.opener) {
                window.opener.postMessage({
                    type: 'appRegistration',
                    data: {
                        appId: this.appId,
                        name: this.appName,
                        capabilities: this.capabilities
                    }
                }, window.location.origin);
            }
        }
    }
    
    setupCommunication() {
        // Listen for messages from AI-OS Core
        window.addEventListener('message', (event) => {
            if (event.origin !== window.location.origin) return;
            
            const { type, data, source } = event.data;
            
            switch (type) {
                case 'aiOSRegistration':
                    this.handleCoreRegistration(data);
                    break;
                case 'appMessage':
                    this.handleAppMessage(data);
                    break;
                case 'stateChange':
                    this.handleStateChange(data);
                    break;
                case 'systemStateUpdate':
                    this.handleSystemStateUpdate(data);
                    break;
                case 'notification':
                    this.handleNotification(data);
                    break;
            }
        });
        
        // Listen for AI-OS Core events
        if (this.api) {
            this.api.on('appMessage', (event) => this.handleCoreEvent(event));
            this.api.on('systemStateUpdate', (event) => this.handleSystemEvent(event));
            this.api.on('userAction', (event) => this.handleUserAction(event));
        }
    }
    
    setupEventListeners() {
        // Listen for page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (this.api) {
                this.api.emit('appVisibility', {
                    appId: this.appId,
                    visible: !document.hidden,
                    timestamp: Date.now()
                });
            }
        });
        
        // Listen for page unload
        window.addEventListener('beforeunload', () => {
            if (this.api && this.isRegistered) {
                this.api.emit('appClosing', {
                    appId: this.appId,
                    timestamp: Date.now()
                });
            }
        });
    }
    
    // Event Handlers
    handleCoreRegistration(data) {
        console.log(`📋 Core registration received:`, data);
        // App-specific initialization logic
    }
    
    handleAppMessage(data) {
        console.log(`📨 Message received:`, data);
        this.emit('appMessage', data);
    }
    
    handleStateChange(data) {
        console.log(`🔄 State changed:`, data);
        this.emit('stateChange', data);
    }
    
    handleSystemStateUpdate(data) {
        this.emit('systemStateUpdate', data);
    }
    
    handleNotification(data) {
        this.emit('notification', data);
    }
    
    handleCoreEvent(event) {
        this.emit('coreEvent', event);
    }
    
    handleSystemEvent(event) {
        this.emit('systemEvent', event);
    }
    
    handleUserAction(event) {
        this.emit('userAction', event);
    }
    
    // Public API for Apps
    on(event, callback) {
        if (!this.eventHandlers.has(event)) {
            this.eventHandlers.set(event, []);
        }
        this.eventHandlers.get(event).push(callback);
    }
    
    off(event, callback) {
        const handlers = this.eventHandlers.get(event);
        if (handlers) {
            const index = handlers.indexOf(callback);
            if (index > -1) {
                handlers.splice(index, 1);
            }
        }
    }
    
    emit(event, data) {
        const handlers = this.eventHandlers.get(event);
        if (handlers) {
            handlers.forEach(handler => {
                try {
                    handler(data);
                } catch (error) {
                    console.error(`Error in event handler for ${event}:`, error);
                }
            });
        }
    }
    
    // Communication Methods
    sendMessage(to, message) {
        if (this.api) {
            return this.api.sendMessage(to, message, this.appId);
        }
        return false;
    }
    
    broadcast(message) {
        if (this.api) {
            return this.api.broadcast(message);
        }
        return false;
    }
    
    // State Management
    setState(key, value) {
        if (this.api) {
            this.api.setState(`${this.appId}_${key}`, value);
        }
    }
    
    getState(key, defaultValue = null) {
        if (this.api) {
            return this.api.getState(`${this.appId}_${key}`, defaultValue);
        }
        return defaultValue;
    }
    
    // Service Access
    getService(serviceName) {
        if (this.api) {
            return this.api.getService(serviceName);
        }
        return null;
    }
    
    // Utility Methods
    getUserProfile() {
        return this.api ? this.api.getUserProfile() : null;
    }
    
    getSystemState() {
        return this.api ? this.api.getSystemState() : null;
    }
    
    showNotification(title, message, type = 'info', duration = 3000) {
        const service = this.getService('notification');
        if (service) {
            return service.show(title, message, type, duration);
        }
        console.log(`🔔 Notification: ${title} - ${message}`);
    }
    
    // App Lifecycle
    pause() {
        if (this.api) {
            this.api.emit('appPaused', {
                appId: this.appId,
                timestamp: Date.now()
            });
        }
    }
    
    resume() {
        if (this.api) {
            this.api.emit('appResumed', {
                appId: this.appId,
                timestamp: Date.now()
            });
        }
    }
    
    close() {
        if (this.api && this.isRegistered) {
            window.aiOSCore.unregisterApplication(this.appId);
            this.isRegistered = false;
        }
    }
}

// Export for use in applications
if (typeof window !== 'undefined') {
    window.AIOSAppIntegration = AIOSAppIntegration;
}