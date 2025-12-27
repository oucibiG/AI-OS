/**
 * AI-OS Mobile Mod Loader
 * Detekuje mobilné zariadenia a optimalizuje rozhranie
 * Optimalizované pre iPhone 11 Pro a podobné zariadenia
 */

class MobileModLoader {
    constructor() {
        this.deviceInfo = this.detectDevice();
        this.isMobile = this.deviceInfo.isMobile;
        this.isIPhone11Pro = this.deviceInfo.isIPhone11Pro;
        this.currentMode = this.getPreferredMode();
        
        this.init();
    }

    detectDevice() {
        const userAgent = navigator.userAgent.toLowerCase();
        const screen = window.screen;
        
        // iPhone 11 Pro detection
        const isIPhone11Pro = /iphone/.test(userAgent) && 
                              screen.width === 375 && 
                              screen.height === 812;
        
        // General iPhone detection
        const isIPhone = /iphone/.test(userAgent);
        
        // General mobile detection
        const isMobile = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent) ||
                        (screen.width <= 768 && screen.height <= 1024);
        
        // Tablet detection
        const isTablet = /ipad|android(?!.*mobile)|tablet/i.test(userAgent) ||
                        (screen.width > 768 && screen.width <= 1024 && screen.height > 768);
        
        return {
            isMobile,
            isTablet,
            isIPhone,
            isIPhone11Pro,
            isIOS: /iphone|ipad|ipod/i.test(userAgent),
            isAndroid: /android/i.test(userAgent),
            screenWidth: screen.width,
            screenHeight: screen.height,
            devicePixelRatio: window.devicePixelRatio || 1,
            orientation: screen.orientation ? screen.orientation.angle : 
                        (window.innerWidth > window.innerHeight ? 90 : 0)
        };
    }

    getPreferredMode() {
        const saved = localStorage.getItem('ai-os-display-mode');
        if (saved) return saved;
        
        return this.isMobile ? 'mobile' : 'auto';
    }

    init() {
        console.log('📱 AI-OS Mobile Mod Loader initialized');
        console.log('Device Info:', this.deviceInfo);
        
        // Add mobile CSS class to body
        document.body.classList.add('ai-os-mobile');
        
        if (this.isMobile) {
            document.body.classList.add('mobile-device');
        }
        
        if (this.isIPhone11Pro) {
            document.body.classList.add('iphone-11-pro');
        }
        
        // Load mobile optimizations
        this.loadMobileOptimizations();
        
        // Create mobile control panel
        this.createMobileControls();
        
        // Setup responsive behavior
        this.setupResponsiveBehavior();
        
        // Apply mode immediately
        this.applyMode();
        
        // Listen for orientation changes
        this.setupOrientationListener();
    }

    loadMobileOptimizations() {
        // Create and inject mobile-specific CSS
        const mobileCSS = `
            /* iPhone 11 Pro Specific Optimizations */
            .iphone-11-pro {
                --safe-area-top: 44px;
                --safe-area-bottom: 34px;
                --status-bar-height: 44px;
                --home-indicator-height: 34px;
            }
            
            .iphone-11-pro .phone-header {
                height: calc(var(--status-bar-height) + 60px);
                padding-top: var(--status-bar-height);
            }
            
            .iphone-11-pro .phone-dock {
                height: calc(var(--home-indicator-height) + 80px);
                padding-bottom: var(--home-indicator-height);
            }
            
            .iphone-11-pro .fullscreen-app-header {
                height: calc(var(--status-bar-height) + 60px);
                padding-top: var(--status-bar-height);
            }
            
            /* Mobile device optimizations */
            .mobile-device {
                touch-action: manipulation;
                -webkit-tap-highlight-color: transparent;
                -webkit-touch-callout: none;
                -webkit-user-select: none;
                user-select: none;
            }
            
            .mobile-device .app-icon-card,
            .mobile-device .phone-app-icon,
            .mobile-device .dock-app {
                touch-action: manipulation;
            }
            
            /* Prevent zoom on double tap */
            .mobile-device * {
                touch-action: manipulation;
            }
            
            /* Mobile scroll optimizations */
            .mobile-device {
                -webkit-overflow-scrolling: touch;
                overscroll-behavior: none;
            }
            
            /* Hide scrollbars on mobile */
            .mobile-device ::-webkit-scrollbar {
                display: none;
            }
            
            /* Mobile font optimizations */
            .mobile-device body {
                -webkit-text-size-adjust: 100%;
                text-size-adjust: 100%;
            }
            
            /* Mobile viewport fix */
            .mobile-device {
                height: 100vh;
                height: calc(var(--vh, 1vh) * 100);
                overflow: hidden;
            }
            
            /* Mobile mode specific styles */
            .ai-os-mobile.mobile-mode .universal-interface {
                padding-top: 0;
            }
            
            .ai-os-mobile.mobile-mode .mode-selector {
                top: 10px;
                transform: translateX(-50%) scale(0.9);
            }
            
            /* Desktop mode on mobile */
            .ai-os-mobile.desktop-mode .pc-mode {
                display: block !important;
            }
            
            .ai-os-mobile.desktop-mode .phone-mode {
                display: none !important;
            }
            
            /* Mobile specific app grid */
            .mobile-device .app-icons-grid {
                grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
                gap: 15px;
                padding: 20px 10px;
            }
            
            .mobile-device .app-icon-card {
                padding: 15px;
                border-radius: 12px;
            }
            
            .mobile-device .app-icon-image {
                width: 50px;
                height: 50px;
                font-size: 20px;
            }
            
            /* Mobile dock optimizations */
            .mobile-device .phone-dock {
                background: rgba(0, 0, 0, 0.95);
                backdrop-filter: blur(20px);
                border-top: 1px solid rgba(0, 255, 0, 0.3);
            }
            
            .mobile-device .dock-app {
                width: 45px;
                height: 45px;
            }
            
            .mobile-device .dock-app-icon {
                font-size: 18px;
            }
            
            /* Mobile fullscreen app optimizations */
            .mobile-device .fullscreen-app {
                padding-top: var(--safe-area-top, 0px);
                padding-bottom: var(--safe-area-bottom, 0px);
            }
            
            /* Mobile status bar integration */
            .mobile-device .phone-header {
                background: rgba(0, 0, 0, 0.95);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
            }
            
            /* Mobile gesture improvements */
            .mobile-device .fullscreen-app-content {
                overscroll-behavior: contain;
            }
            
            /* Mobile loading optimizations */
            .mobile-device .loading-spinner {
                width: 30px;
                height: 30px;
                border-width: 2px;
            }
            
            /* Mobile button optimizations */
            .mobile-device .kali-button {
                min-height: 44px;
                padding: 12px 20px;
                font-size: 16px;
            }
            
            .mobile-device .nav-button {
                width: 44px;
                height: 44px;
                font-size: 18px;
            }
            
            /* Mobile input optimizations */
            .mobile-device .kali-input {
                min-height: 44px;
                font-size: 16px;
                padding: 12px;
            }
            
            /* Mobile widget optimizations */
            .mobile-device .monitor-widget,
            .mobile-device .nm-widget,
            .mobile-device .fm-widget {
                padding: 15px;
                margin-bottom: 15px;
            }
            
            /* Mobile table optimizations */
            .mobile-device .kali-table {
                font-size: 14px;
 .mobile-device .kali-table th,
            }
            
                       .mobile-device .kali-table td {
                padding: 8px 4px;
            }
            
            /* Mobile status bar */
            .mobile-device .monitor-status,
            .mobile-device .nm-status {
                gap: 10px;
            }
            
            .mobile-device .monitor-status-item,
            .mobile-device .nm-status-item {
                font-size: 11px;
            }
            
            /* Mobile alert optimizations */
            .mobile-device .security-alerts {
                width: calc(100vw - 40px);
                right: 20px;
                top: 70px;
            }
            
            .mobile-device .alert-item {
                padding: 12px;
                margin-bottom: 8px;
            }
            
            /* Mobile swipe improvements */
            .mobile-device .swipe-indicator {
                font-size: 36px;
            }
            
            /* Mobile menu optimizations */
            .mobile-device .app-menu-overlay > div {
                margin: 20px;
                min-width: auto;
                width: calc(100vw - 40px);
            }
            
            /* Mobile all apps overlay */
            .mobile-device .all-apps-overlay {
                padding: 15px;
            }
            
            .mobile-device .all-apps-overlay h2 {
                font-size: 20px;
                margin-bottom: 20px;
            }
            
            .mobile-device .all-apps-overlay > div:last-child {
                grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
                gap: 15px;
            }
            
            .mobile-device .all-apps-overlay > div:last-child > div {
                padding: 10px;
            }
            
            .mobile-device .all-apps-overlay > div:last-child > div > div:first-child {
                width: 40px;
                height: 40px;
                font-size: 18px;
            }
            
            .mobile-device .all-apps-overlay > div:last-child > div > div:last-size: 10-child {
                fontpx;
            }
        `;
        
        const style = document.createElement('style');
        style.id = 'mobile-mod-optimizations';
        style.textContent = mobileCSS;
        document.head.appendChild(style);
    }

    createMobileControls() {
        if (!this.isMobile) return;
        
        const controls = document.createElement('div');
        controls.id = 'mobile-controls';
        controls.innerHTML = `
            <div class="mobile-controls-panel">
                <div class="mobile-controls-header">
                    <span>📱 Mobile Controls</span>
                    <button class="mobile-control-close" onclick="mobileLoader.toggleControls()">×</button>
                </div>
                <div class="mobile-controls-content">
                    <div class="control-group">
                        <label>Display Mode:</label>
                        <select id="mobile-mode-selector" onchange="mobileLoader.changeMode(this.value)">
                            <option value="auto">Auto Detect</option>
                            <option value="mobile">Mobile Mode</option>
                            <option value="desktop">Desktop Mode</option>
                        </select>
                    </div>
                    <div class="control-group">
                        <label>Interface Scale:</label>
                        <input type="range" id="mobile-scale" min="0.7" max="1.3" step="0.1" 
                               value="1" oninput="mobileLoader.changeScale(this.value)">
                        <span id="scale-value">100%</span>
                    </div>
                    <div class="control-group">
                        <label>Safe Area:</label>
                        <label class="toggle-switch">
                            <input type="checkbox" id="safe-area-toggle" checked 
                                   onchange="mobileLoader.toggleSafeArea(this.checked)">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                    <div class="control-group">
                        <label>Status Bar:</label>
                        <label class="toggle-switch">
                            <input type="checkbox" id="status-bar-toggle" checked 
                                   onchange="mobileLoader.toggleStatusBar(this.checked)">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                    <div class="control-group">
                        <button class="mobile-btn" onclick="mobileLoader.refreshLayout()">
                            🔄 Refresh Layout
                        </button>
                    </div>
                    <div class="control-group">
                        <button class="mobile-btn" onclick="mobileLoader.resetSettings()">
                            ⚙️ Reset Settings
                        </button>
                    </div>
                </div>
                <div class="mobile-controls-footer">
                    <small>iPhone 11 Pro Optimized</small>
                </div>
            </div>
        `;
        
        // Add mobile controls CSS
        const controlsCSS = `
            #mobile-controls {
                position: fixed;
                top: 0;
                right: -300px;
                width: 280px;
                height: 100vh;
                background: rgba(0, 0, 0, 0.95);
                backdrop-filter: blur(20px);
                border-left: 1px solid rgba(0, 255, 0, 0.3);
                z-index: 30000;
                transition: right 0.3s ease;
                font-family: 'Courier New', monospace;
                color: #00ff00;
            }
            
            #mobile-controls.open {
                right: 0;
            }
            
            .mobile-controls-panel {
                height: 100%;
                display: flex;
                flex-direction: column;
                padding: 20px;
            }
            
            .mobile-controls-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                padding-bottom: 15px;
                border-bottom: 1px solid rgba(0, 255, 0, 0.3);
            }
            
            .mobile-controls-header span {
                font-weight: bold;
                color: #00ff00;
                text-shadow: 0 0 5px #00ff00;
            }
            
            .mobile-control-close {
                background: none;
                border: none;
                color: #00ff00;
                font-size: 20px;
                cursor: pointer;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .mobile-control-close:hover {
                background: rgba(0, 255, 0, 0.2);
            }
            
            .mobile-controls-content {
                flex: 1;
                overflow-y: auto;
            }
            
            .control-group {
                margin-bottom: 20px;
            }
            
            .control-group label {
                display: block;
                margin-bottom: 8px;
                color: #00ff00;
                font-size: 14px;
            }
            
            .control-group select,
            .control-group input[type="range"] {
                width: 100%;
                background: rgba(0, 0, 0, 0.8);
                border: 1px solid rgba(0, 255, 0, 0.3);
                border-radius: 4px;
                color: #00ff00;
                padding: 8px;
                font-family: 'Courier New', monospace;
            }
            
            .control-group select:focus,
            .control-group input[type="range"]:focus {
                outline: none;
                border-color: #00ff00;
                box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
            }
            
            #scale-value {
                color: #00ff00;
                font-size: 12px;
                margin-left: 10px;
            }
            
            .toggle-switch {
                position: relative;
                display: inline-block;
                width: 50px;
                height: 24px;
            }
            
            .toggle-switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }
            
            .toggle-slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                border: 1px solid rgba(0, 255, 0, 0.3);
                border-radius: 24px;
                transition: 0.3s;
            }
            
            .toggle-slider:before {
                position: absolute;
                content: "";
                height: 18px;
                width: 18px;
                left: 3px;
                bottom: 3px;
                background: #00ff00;
                border-radius: 50%;
                transition: 0.3s;
                box-shadow: 0 0 5px rgba(0, 255, 0, 0.5);
            }
            
            .toggle-switch input:checked + .toggle-slider {
                background: rgba(0, 255, 0, 0.3);
            }
            
            .toggle-switch input:checked + .toggle-slider:before {
                transform: translateX(26px);
            }
            
            .mobile-btn {
                width: 100%;
                padding: 12px;
                background: rgba(0, 255, 0, 0.1);
                border: 1px solid rgba(0, 255, 0, 0.3);
                border-radius: 6px;
                color: #00ff00;
                font-family: 'Courier New', monospace;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 14px;
            }
            
            .mobile-btn:hover {
                background: rgba(0, 255, 0, 0.2);
                box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
            }
            
            .mobile-controls-footer {
                margin-top: 20px;
                padding-top: 15px;
                border-top: 1px solid rgba(0, 255, 0, 0.3);
                text-align: center;
            }
            
            .mobile-controls-footer small {
                color: #666;
                font-size: 11px;
            }
            
            /* Mobile controls toggle button */
            #mobile-controls-toggle {
                position: fixed;
                top: 50%;
                right: 0;
                width: 40px;
                height: 60px;
                background: rgba(0, 0, 0, 0.9);
                border: 1px solid rgba(0, 255, 0, 0.3);
                border-right: none;
                border-radius: 20px 0 0 20px;
                color: #00ff00;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
                z-index: 25000;
                transition: all 0.3s ease;
            }
            
            #mobile-controls-toggle:hover {
                background: rgba(0, 255, 0, 0.2);
            }
            
            #mobile-controls-toggle::after {
                content: '📱';
                animation: pulse 2s infinite;
            }
            
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
        `;
        
        const controlsStyle = document.createElement('style');
        controlsStyle.id = 'mobile-controls-styles';
        controlsStyle.textContent = controlsCSS;
        document.head.appendChild(controlsStyle);
        
        document.body.appendChild(controls);
        
        // Add toggle button
        const toggleButton = document.createElement('div');
        toggleButton.id = 'mobile-controls-toggle';
        toggleButton.onclick = () => this.toggleControls();
        document.body.appendChild(toggleButton);
        
        // Set initial mode selector value
        setTimeout(() => {
            const selector = document.getElementById('mobile-mode-selector');
            if (selector) selector.value = this.currentMode;
        }, 100);
    }

    toggleControls() {
        const controls = document.getElementById('mobile-controls');
        controls.classList.toggle('open');
    }

    changeMode(mode) {
        this.currentMode = mode;
        localStorage.setItem('ai-os-display-mode', mode);
        this.applyMode();
        
        // Show notification
        this.showNotification(`Mode changed to: ${mode}`);
    }

    changeScale(scale) {
        const scaleValue = document.getElementById('scale-value');
        if (scaleValue) {
            scaleValue.textContent = Math.round(scale * 100) + '%';
        }
        
        document.documentElement.style.setProperty('--mobile-scale', scale);
        document.body.style.transform = `scale(${scale})`;
        document.body.style.transformOrigin = 'top center';
        
        localStorage.setItem('ai-os-mobile-scale', scale);
    }

    toggleSafeArea(enabled) {
        const root = document.documentElement;
        if (enabled) {
            root.style.setProperty('--safe-area-top', '44px');
            root.style.setProperty('--safe-area-bottom', '34px');
        } else {
            root.style.setProperty('--safe-area-top', '0px');
            root.style.setProperty('--safe-area-bottom', '0px');
        }
        
        localStorage.setItem('ai-os-safe-area', enabled);
    }

    toggleStatusBar(enabled) {
        const header = document.querySelector('.phone-header, .monitor-header, .dm-header');
        if (header) {
            header.style.display = enabled ? 'flex' : 'none';
        }
        
        localStorage.setItem('ai-os-status-bar', enabled);
    }

    refreshLayout() {
        // Trigger layout refresh
        window.dispatchEvent(new Event('resize'));
        this.showNotification('Layout refreshed');
    }

    resetSettings() {
        localStorage.removeItem('ai-os-display-mode');
        localStorage.removeItem('ai-os-mobile-scale');
        localStorage.removeItem('ai-os-safe-area');
        localStorage.removeItem('ai-os-status-bar');
        
        // Reset to defaults
        this.changeMode('auto');
        this.changeScale(1);
        this.toggleSafeArea(true);
        this.toggleStatusBar(true);
        
        this.showNotification('Settings reset to defaults');
    }

    applyMode() {
        const body = document.body;
        
        // Remove existing mode classes
        body.classList.remove('mobile-mode', 'desktop-mode', 'auto-mode');
        
        // Apply mode
        switch (this.currentMode) {
            case 'mobile':
                body.classList.add('mobile-mode');
                if (window.universalInterface) {
                    window.universalInterface.switchMode('phone');
                }
                break;
            case 'desktop':
                body.classList.add('desktop-mode');
                if (window.universalInterface) {
                    window.universalInterface.switchMode('pc');
                }
                break;
            default: // auto
                body.classList.add('auto-mode');
                if (this.isMobile) {
                    body.classList.add('mobile-mode');
                    if (window.universalInterface) {
                        window.universalInterface.switchMode('phone');
                    }
                } else {
                    body.classList.add('desktop-mode');
                    if (window.universalInterface) {
                        window.universalInterface.switchMode('pc');
                    }
                }
        }
    }

    setupResponsiveBehavior() {
        // Handle viewport changes
        window.addEventListener('resize', () => {
            this.deviceInfo = this.detectDevice();
            if (this.currentMode === 'auto') {
                this.applyMode();
            }
        });
        
        // Load saved settings
        this.loadSavedSettings();
    }

    loadSavedSettings() {
        const scale = localStorage.getItem('ai-os-mobile-scale');
        if (scale) {
            this.changeScale(parseFloat(scale));
            const scaleSlider = document.getElementById('mobile-scale');
            if (scaleSlider) scaleSlider.value = scale;
        }
        
        const safeArea = localStorage.getItem('ai-os-safe-area');
        if (safeArea !== null) {
            this.toggleSafeArea(safeArea === 'true');
            const safeAreaToggle = document.getElementById('safe-area-toggle');
            if (safeAreaToggle) safeAreaToggle.checked = safeArea === 'true';
        }
        
        const statusBar = localStorage.getItem('ai-os-status-bar');
        if (statusBar !== null) {
            this.toggleStatusBar(statusBar === 'true');
            const statusBarToggle = document.getElementById('status-bar-toggle');
            if (statusBarToggle) statusBarToggle.checked = statusBar === 'true';
        }
    }

    setupOrientationListener() {
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.deviceInfo = this.detectDevice();
                this.refreshLayout();
            }, 100);
        });
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.9);
            color: #00ff00;
            padding: 12px 24px;
            border-radius: 25px;
            font-size: 14px;
            font-weight: 600;
            z-index: 40000;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(0, 255, 0, 0.3);
            box-shadow: 0 4px 20px rgba(0, 255, 0, 0.3);
            animation: mobileNotificationSlide 0.3s ease-out;
            font-family: 'Courier New', monospace;
        `;
        
        notification.textContent = message;
        
        // Add animation
        const animation = document.createElement('style');
        animation.textContent = `
            @keyframes mobileNotificationSlide {
                from {
                    transform: translateX(-50%) translateY(-100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(-50%) translateY(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(animation);
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'mobileNotificationSlide 0.3s ease-in reverse';
            setTimeout(() => {
                notification.remove();
                animation.remove();
            }, 300);
        }, 3000);
    }

    // Public API methods
    getDeviceInfo() {
        return this.deviceInfo;
    }
    
    isCurrentModeMobile() {
        return this.currentMode === 'mobile' || 
               (this.currentMode === 'auto' && this.isMobile);
    }
    
    getCurrentMode() {
        return this.currentMode;
    }
}

// Initialize mobile loader
let mobileLoader;

document.addEventListener('DOMContentLoaded', () => {
    mobileLoader = new MobileModLoader();
    
    // Make it globally available
    window.mobileLoader = mobileLoader;
    
    console.log('🚀 AI-OS Mobile Mod Loader ready');
    console.log('Device:', mobileLoader.getDeviceInfo());
    console.log('Mode:', mobileLoader.getCurrentMode());
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MobileModLoader;
}