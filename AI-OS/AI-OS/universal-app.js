// 🚀 AI-OS Universal App JavaScript v2.0.1
// Konzistentný systém funkcionalít pre všetky AI-OS aplikácie
// Autor: MiniMax Agent
// Dátum: 2025-12-19

class AIOSApp {
    constructor() {
        this.isInitialized = false;
        this.sidebarCollapsed = false;
        this.currentTheme = 'dark';
        this.navigationHistory = [];
        
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        this.setupEventListeners();
        this.initializeUI();
        this.setupKeyboardShortcuts();
        this.setupResponsiveBehavior();
        this.initializeAnimations();
        
        this.isInitialized = true;
        console.log('🤖 AI-OS App initialized successfully');
    }

    // ============================================
    // UNIVERSAL NAVIGATION SYSTEM
    // ============================================
    navigateBack() {
        if (this.navigationHistory.length > 0) {
            const previousUrl = this.navigationHistory.pop();
            window.location.href = previousUrl;
        } else {
            this.goHome();
        }
    }

    goHome() {
        // Check if this is a popup window
        if (window.opener) {
            window.close();
        } else {
            // Navigate to main launcher or index
            const currentPath = window.location.pathname;
            if (currentPath.includes('/Apps/') || currentPath.includes('/MOBILE/')) {
                window.location.href = '../index.html';
            } else {
                window.location.href = 'index.html';
            }
        }
    }

    navigateToApp(appPath) {
        // Save current URL to history
        this.navigationHistory.push(window.location.href);
        
        // Show app launch animation
        this.showAppLaunch(appPath);
    }

    showAppLaunch(appPath) {
        // Create splash screen
        const splash = document.createElement('div');
        splash.className = 'ai-splash';
        splash.innerHTML = `
            <div class="ai-splash-logo">🤖</div>
            <div class="ai-splash-title">AI-OS</div>
            <div class="ai-splash-subtitle">Loading application...</div>
            <div class="ai-splash-progress">
                <div class="ai-progress-bar">
                    <div class="ai-progress-fill" style="width: 0%"></div>
                </div>
            </div>
        `;
        
        document.body.appendChild(splash);
        
        // Animate progress
        const progressFill = splash.querySelector('.ai-progress-fill');
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.random() * 15 + 5;
            if (progress > 100) progress = 100;
            
            progressFill.style.width = progress + '%';
            
            if (progress >= 100) {
                clearInterval(progressInterval);
                
                // Add launch animation to splash
                splash.classList.add('ai-app-launch');
                
                setTimeout(() => {
                    splash.classList.add('hidden');
                    setTimeout(() => {
                        document.body.removeChild(splash);
                        window.location.href = appPath;
                    }, 500);
                }, 300);
            }
        }, 100);
    }

    // ============================================
    // UNIVERSAL SIDEBAR SYSTEM
    // ============================================
    toggleSidebar() {
        const sidebar = document.querySelector('.ai-sidebar');
        const overlay = document.querySelector('.ai-sidebar-overlay');
        
        if (!sidebar) return;

        this.sidebarCollapsed = !this.sidebarCollapsed;
        
        if (this.isMobile()) {
            // Mobile behavior - slide in/out
            sidebar.classList.toggle('open');
            if (overlay) {
                overlay.classList.toggle('open');
            }
        } else {
            // Desktop behavior - collapse/expand
            sidebar.classList.toggle('collapsed');
        }
        
        // Save preference
        localStorage.setItem('ai-sidebar-collapsed', this.sidebarCollapsed);
    }

    closeSidebar() {
        const sidebar = document.querySelector('.ai-sidebar');
        const overlay = document.querySelector('.ai-sidebar-overlay');
        
        if (sidebar) {
            sidebar.classList.remove('open');
            if (this.isMobile()) {
                sidebar.classList.remove('collapsed');
            }
        }
        
        if (overlay) {
            overlay.classList.remove('open');
        }
    }

    // ============================================
    // UNIVERSAL THEME SYSTEM
    // ============================================
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('ai-theme', this.currentTheme);
    }

    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('ai-theme', theme);
    }

    // ============================================
    // UNIVERSAL UI INITIALIZATION
    // ============================================
    initializeUI() {
        this.loadUserPreferences();
        this.setupHeaderControls();
        this.setupNavigation();
        this.setupFormElements();
        this.setupCards();
        this.setupModals();
    }

    loadUserPreferences() {
        // Load sidebar state
        const sidebarCollapsed = localStorage.getItem('ai-sidebar-collapsed');
        if (sidebarCollapsed === 'true') {
            this.sidebarCollapsed = true;
            const sidebar = document.querySelector('.ai-sidebar');
            if (sidebar && !this.isMobile()) {
                sidebar.classList.add('collapsed');
            }
        }

        // Load theme
        const savedTheme = localStorage.getItem('ai-theme');
        if (savedTheme) {
            this.setTheme(savedTheme);
        }
    }

    setupHeaderControls() {
        // Add sidebar toggle button
        const header = document.querySelector('.ai-app-header .ai-app-controls');
        if (header && !header.querySelector('.ai-sidebar-toggle')) {
            const sidebarBtn = document.createElement('button');
            sidebarBtn.className = 'ai-btn ai-btn-icon ai-sidebar-toggle';
            sidebarBtn.innerHTML = '☰';
            sidebarBtn.onclick = () => this.toggleSidebar();
            sidebarBtn.title = 'Toggle Sidebar';
            header.appendChild(sidebarBtn);
        }

        // Add theme toggle
        if (header && !header.querySelector('.ai-theme-toggle')) {
            const themeBtn = document.createElement('button');
            themeBtn.className = 'ai-btn ai-btn-icon ai-theme-toggle';
            themeBtn.innerHTML = this.currentTheme === 'dark' ? '🌙' : '☀️';
            themeBtn.onclick = () => {
                this.toggleTheme();
                themeBtn.innerHTML = this.currentTheme === 'dark' ? '🌙' : '☀️';
            };
            themeBtn.title = 'Toggle Theme';
            header.appendChild(themeBtn);
        }

        // Add home button
        if (header && !header.querySelector('.ai-home-btn')) {
            const homeBtn = document.createElement('button');
            homeBtn.className = 'ai-btn ai-btn-icon ai-home-btn';
            homeBtn.innerHTML = '🏠';
            homeBtn.onclick = () => this.goHome();
            homeBtn.title = 'Go Home';
            header.appendChild(homeBtn);
        }
    }

    setupNavigation() {
        // Create navigation bar if it doesn't exist
        let navBar = document.querySelector('.ai-nav-bar');
        if (!navBar) {
            navBar = this.createNavigationBar();
            const mainContent = document.querySelector('.ai-main-content');
            if (mainContent) {
                mainContent.appendChild(navBar);
            }
        }
    }

    createNavigationBar() {
        const navBar = document.createElement('div');
        navBar.className = 'ai-nav-bar';
        
        navBar.innerHTML = `
            <div class="ai-nav-left">
                <button class="ai-nav-back" onclick="aiApp.navigateBack()">
                    ← Späť
                </button>
            </div>
            <div class="ai-nav-right">
                <button class="ai-nav-home" onclick="aiApp.goHome()">
                    🏠 Hlavná
                </button>
            </div>
        `;
        
        return navBar;
    }

    // ============================================
    // UNIVERSAL EVENT LISTENERS
    // ============================================
    setupEventListeners() {
        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
        
        // Global click handlers
        document.addEventListener('click', (e) => this.handleGlobalClicks(e));
        
        // Window resize handler
        window.addEventListener('resize', () => this.handleResize());
        
        // Prevent default behaviors for better UX
        document.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // Handle form submissions
        document.addEventListener('submit', (e) => this.handleFormSubmission(e));
        
        // Setup touch gestures for mobile
        this.setupTouchGestures();
    }

    setupKeyboardShortcuts() {
        // ESC - Go back
        // Ctrl+H - Go home
        // Ctrl+W - Close sidebar
        // Ctrl+T - Toggle theme
        // Ctrl+/ - Show help
    }

    handleKeyboardShortcuts(e) {
        // Don't handle shortcuts when typing in inputs
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }

        switch(e.key) {
            case 'Escape':
                e.preventDefault();
                this.navigateBack();
                break;
            case 'h':
            case 'H':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.goHome();
                }
                break;
            case 'w':
            case 'W':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.closeSidebar();
                }
                break;
            case 't':
            case 'T':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.toggleTheme();
                }
                break;
            case '/':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.showHelp();
                }
                break;
        }
    }

    handleGlobalClicks(e) {
        // Close mobile sidebar when clicking overlay
        if (e.target.classList.contains('ai-sidebar-overlay')) {
            this.closeSidebar();
        }
        
        // Handle ripple effects
        this.createRippleEffect(e);
    }

    handleResize() {
        // Close mobile sidebar on resize to desktop
        if (!this.isMobile()) {
            this.closeSidebar();
        }
    }

    handleFormSubmission(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        console.log('Form submitted:', Object.fromEntries(formData));
    }

    // ============================================
    // UNIVERSAL ANIMATIONS
    // ============================================
    initializeAnimations() {
        // Add fade-in animation to cards
        const cards = document.querySelectorAll('.ai-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    createRippleEffect(e) {
        const button = e.target.closest('.ai-btn, .ai-card, .ai-sidebar-item');
        if (!button) return;

        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(0, 122, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;

        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // ============================================
    // UNIVERSAL FORM ELEMENTS
    // ============================================
    setupFormElements() {
        // Auto-expand textareas
        const textareas = document.querySelectorAll('textarea');
        textareas.forEach(textarea => {
            textarea.addEventListener('input', this.autoResizeTextarea);
        });

        // Add search functionality
        const searchInputs = document.querySelectorAll('.ai-search-input');
        searchInputs.forEach(input => {
            input.addEventListener('input', this.debounce(this.handleSearch, 300));
        });
    }

    autoResizeTextarea(e) {
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight + 'px';
    }

    handleSearch(e) {
        const query = e.target.value.toLowerCase();
        const searchableElements = document.querySelectorAll('[data-searchable]');
        
        searchableElements.forEach(element => {
            const text = element.textContent.toLowerCase();
            const isVisible = text.includes(query);
            element.style.display = isVisible ? '' : 'none';
        });
    }

    // ============================================
    // UNIVERSAL CARD SYSTEM
    // ============================================
    setupCards() {
        const cards = document.querySelectorAll('.ai-card');
        cards.forEach(card => {
            // Add click to navigate functionality
            const navigateUrl = card.getAttribute('data-navigate');
            if (navigateUrl) {
                card.style.cursor = 'pointer';
                card.addEventListener('click', () => this.navigateToApp(navigateUrl));
            }
        });
    }

    // ============================================
    // UNIVERSAL MODAL SYSTEM
    // ============================================
    setupModals() {
        // Create modal container
        if (!document.querySelector('#ai-modal-container')) {
            const modalContainer = document.createElement('div');
            modalContainer.id = 'ai-modal-container';
            modalContainer.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: none;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                backdrop-filter: blur(10px);
            `;
            document.body.appendChild(modalContainer);
        }
    }

    showModal(content, options = {}) {
        const container = document.querySelector('#ai-modal-container');
        if (!container) return;

        const modal = document.createElement('div');
        modal.className = 'ai-modal';
        modal.style.cssText = `
            background: var(--bg-secondary);
            border: 1px solid var(--border-primary);
            border-radius: var(--radius-lg);
            padding: var(--space-xl);
            max-width: 90vw;
            max-height: 90vh;
            overflow: auto;
            box-shadow: var(--shadow-lg);
            animation: fadeIn 0.3s ease;
        `;

        modal.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-lg);">
                <h3 style="color: var(--text-primary); margin: 0;">${options.title || 'AI-OS Modal'}</h3>
                <button class="ai-btn ai-btn-icon" onclick="aiApp.hideModal()">✕</button>
            </div>
            <div class="ai-modal-content">${content}</div>
        `;

        container.innerHTML = '';
        container.appendChild(modal);
        container.style.display = 'flex';

        // Close on background click
        container.onclick = (e) => {
            if (e.target === container) {
                this.hideModal();
            }
        };
    }

    hideModal() {
        const container = document.querySelector('#ai-modal-container');
        if (container) {
            container.style.display = 'none';
            container.innerHTML = '';
        }
    }

    // ============================================
    // NOTIFICATION SYSTEM
    // ============================================
    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `ai-notification ${type} ai-notification-slide`;
        
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 18px;">${icons[type] || icons.info}</span>
                <span style="flex: 1;">${message}</span>
                <button class="ai-btn ai-btn-icon" onclick="this.parentElement.parentElement.remove()" style="margin-left: 12px;">✕</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'fadeOut 0.3s ease-out';
                setTimeout(() => notification.remove(), 300);
            }
        }, duration);
        
        return notification;
    }

    showSuccess(message, duration = 3000) {
        return this.showNotification(message, 'success', duration);
    }

    showError(message, duration = 5000) {
        return this.showNotification(message, 'error', duration);
    }

    showWarning(message, duration = 4000) {
        return this.showNotification(message, 'warning', duration);
    }

    showInfo(message, duration = 3000) {
        return this.showNotification(message, 'info', duration);
    }

    // ============================================
    // CONTEXT MENU SYSTEM
    // ============================================
    showContextMenu(x, y, items) {
        this.hideContextMenu();
        
        const menu = document.createElement('div');
        menu.className = 'ai-context-menu';
        menu.style.left = x + 'px';
        menu.style.top = y + 'px';
        
        items.forEach(item => {
            if (item.separator) {
                const separator = document.createElement('div');
                separator.className = 'ai-context-separator';
                menu.appendChild(separator);
            } else {
                const menuItem = document.createElement('div');
                menuItem.className = 'ai-context-item';
                menuItem.innerHTML = `
                    <span>${item.icon || ''}</span>
                    <span>${item.label}</span>
                `;
                menuItem.onclick = () => {
                    if (item.action) item.action();
                    this.hideContextMenu();
                };
                menu.appendChild(menuItem);
            }
        });
        
        document.body.appendChild(menu);
        
        // Position adjustment
        const rect = menu.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
            menu.style.left = (x - rect.width) + 'px';
        }
        if (rect.bottom > window.innerHeight) {
            menu.style.top = (y - rect.height) + 'px';
        }
        
        // Auto hide on outside click
        setTimeout(() => {
            document.addEventListener('click', this.hideContextMenu.bind(this), { once: true });
        }, 100);
        
        this.currentContextMenu = menu;
    }

    hideContextMenu() {
        if (this.currentContextMenu) {
            this.currentContextMenu.remove();
            this.currentContextMenu = null;
        }
    }

    // ============================================
    // LOADING SYSTEM
    // ============================================
    showLoading(element, message = 'Loading...') {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        if (!element) return;
        
        element.classList.add('ai-loading');
        element.setAttribute('data-loading-message', message);
        
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'ai-loading-overlay';
        loadingOverlay.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <div class="ai-spinner"></div>
                <div style="margin-top: 1rem; color: var(--text-secondary);">${message}</div>
            </div>
        `;
        
        element.style.position = 'relative';
        element.appendChild(loadingOverlay);
        
        return loadingOverlay;
    }

    hideLoading(element) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        if (!element) return;
        
        element.classList.remove('ai-loading');
        const overlay = element.querySelector('.ai-loading-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    // ============================================
    // SMART ANIMATIONS
    // ============================================
    animateElement(element, animationClass, duration = 500) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        if (!element) return Promise.resolve();
        
        element.classList.add(animationClass);
        
        return new Promise(resolve => {
            setTimeout(() => {
                element.classList.remove(animationClass);
                resolve();
            }, duration);
        });
    }

    staggerAnimation(elements, animationClass, delay = 100) {
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add(animationClass);
            }, index * delay);
        });
    }

    // ============================================
    // UNIVERSAL UTILITY FUNCTIONS
    // ============================================
    isMobile() {
        return window.innerWidth <= 768;
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    formatDate(date = new Date()) {
        return date.toLocaleDateString('sk-SK', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    formatTime(date = new Date()) {
        return date.toLocaleTimeString('sk-SK', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // ============================================
    // UNIVERSAL TOUCH GESTURES
    // ============================================
    setupTouchGestures() {
        if (!this.isMobile()) return;

        let startX = 0;
        let startY = 0;

        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;

            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;

            const diffX = startX - endX;
            const diffY = startY - endY;

            // Swipe left to go back
            if (Math.abs(diffX) > Math.abs(diffY) && diffX > 50) {
                this.navigateBack();
            }

            startX = 0;
            startY = 0;
        });
    }

    // ============================================
    // UNIVERSAL HELP SYSTEM
    // ============================================
    showHelp() {
        const helpContent = `
            <div class="ai-help-content">
                <h4>⌨️ Klávesové skratky</h4>
                <ul>
                    <li><kbd>ESC</kbd> - Späť</li>
                    <li><kbd>Ctrl+H</kbd> - Domov</li>
                    <li><kbd>Ctrl+W</kbd> - Zatvoriť bočný panel</li>
                    <li><kbd>Ctrl+T</kbd> - Prepnúť tému</li>
                    <li><kbd>Ctrl+/</kbd> - Pomoc</li>
                </ul>
                
                <h4>📱 Dotykové gestá</h4>
                <ul>
                    <li>Swipe vľavo - Späť</li>
                    <li>Tap - Výber</li>
                    <li>Long press - Kontextové menu</li>
                </ul>
                
                <h4>🎯 Funkcie</h4>
                <ul>
                    <li>Responzívny dizajn pre všetky zariadenia</li>
                    <li>Univerzálne navigačné tlačidlá</li>
                    <li>Automatické uloženie preferencií</li>
                    <li>Animácie a prechodové efekty</li>
                </ul>
            </div>
        `;

        this.showModal(helpContent, { title: 'Pomoc - AI-OS' });
    }
}

// Add ripple animation CSS
const rippleCSS = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = rippleCSS;
document.head.appendChild(styleSheet);

// Initialize the universal app system
let aiApp;

document.addEventListener('DOMContentLoaded', () => {
    aiApp = new AIOSApp();
});

// Global functions for HTML onclick handlers
window.aiApp = {
    navigateBack: () => aiApp.navigateBack(),
    goHome: () => aiApp.goHome(),
    toggleSidebar: () => aiApp.toggleSidebar(),
    navigateToApp: (path) => aiApp.navigateToApp(path),
    showModal: (content, options) => aiApp.showModal(content, options),
    hideModal: () => aiApp.hideModal(),
    toggleTheme: () => aiApp.toggleTheme()
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIOSApp;
}