/**
 * AI-OS Utilities
 * Standardized JavaScript utilities for AI-OS applications
 * Version: 1.0.0
 * Author: MiniMax Agent
 */

class AIOSUtils {
    constructor() {
        this.notificationContainer = null;
        this.loadingElements = new Map();
        this.init();
    }

    init() {
        this.createNotificationContainer();
        this.setupGlobalEventListeners();
    }

    /**
     * === NOTIFICATION SYSTEM ===
     */
    createNotificationContainer() {
        if (!this.notificationContainer) {
            this.notificationContainer = document.createElement('div');
            this.notificationContainer.id = 'ai-notification-container';
            this.notificationContainer.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1080;
                pointer-events: none;
            `;
            document.body.appendChild(this.notificationContainer);
        }
    }

    showNotification(message, type = 'info', duration = 3000, options = {}) {
        const notification = document.createElement('div');
        notification.className = `ai-notification ${type} ai-animate-slide-in-right`;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'polite');
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px; padding: 16px;">
                <span style="font-size: 16px;">
                    ${this.getNotificationIcon(type)}
                </span>
                <span style="flex: 1;">${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="background: none; border: none; color: inherit; cursor: pointer; padding: 0;"
                        aria-label="Zatvoriť oznámenie">
                    ✕
                </button>
            </div>
        `;

        this.notificationContainer.appendChild(notification);

        // Auto-remove
        if (duration > 0) {
            setTimeout(() => {
                this.removeNotification(notification);
            }, duration);
        }

        return notification;
    }

    removeNotification(notification) {
        if (notification && notification.parentElement) {
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.parentElement.removeChild(notification);
                }
            }, 300);
        }
    }

    getNotificationIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️',
            ai: '🤖'
        };
        return icons[type] || icons.info;
    }

    /**
     * === LOADING SYSTEM ===
     */
    showLoading(container = null, text = 'Načítavam...') {
        const loadingId = this.generateId();
        const loadingElement = document.createElement('div');
        loadingElement.id = loadingId;
        loadingElement.className = 'ai-loading ai-animate-fade-in';
        loadingElement.setAttribute('role', 'status');
        loadingElement.setAttribute('aria-label', text);
        
        loadingElement.innerHTML = `
            <div class="ai-loading-spinner"></div>
            <div class="ai-loading-text">${text}</div>
        `;

        const targetContainer = container || document.body;
        targetContainer.appendChild(loadingElement);
        
        this.loadingElements.set(loadingId, {
            element: loadingElement,
            container: targetContainer
        });

        return loadingId;
    }

    hideLoading(loadingId) {
        const loading = this.loadingElements.get(loadingId);
        if (loading) {
            loading.element.style.opacity = '0';
            setTimeout(() => {
                if (loading.element.parentElement) {
                    loading.element.parentElement.removeChild(loading.element);
                }
                this.loadingElements.delete(loadingId);
            }, 300);
        }
    }

    hideAllLoading() {
        this.loadingElements.forEach((loading, id) => {
            this.hideLoading(id);
        });
    }

    /**
     * === MODAL SYSTEM ===
     */
    showModal(title, content, options = {}) {
        const {
            size = 'md',
            showFooter = true,
            footerButtons = [
                { text: 'OK', class: 'ai-btn-primary', onclick: null }
            ]
        } = options;

        const modalId = this.generateId();
        const modalBackdrop = document.createElement('div');
        modalBackdrop.id = `modal-backdrop-${modalId}`;
        modalBackdrop.className = 'ai-modal-backdrop';
        
        const modal = document.createElement('div');
        modal.id = `modal-${modalId}`;
        modal.className = 'ai-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', `modal-title-${modalId}`);

        // Size classes
        const sizeClasses = {
            sm: 'max-width: 400px',
            md: 'max-width: 600px',
            lg: 'max-width: 800px',
            xl: 'max-width: 1000px'
        };

        modal.style.cssText = sizeClasses[size] || sizeClasses.md;

        modal.innerHTML = `
            <div class="ai-modal-header">
                <h2 id="modal-title-${modalId}" class="ai-heading-md">${title}</h2>
                <button onclick="AIOS.utils.closeModal('${modalId}')" 
                        style="background: none; border: none; color: var(--ai-primary); cursor: pointer; font-size: 20px;"
                        aria-label="Zatvoriť">
                    ✕
                </button>
            </div>
            <div class="ai-modal-body">
                ${content}
            </div>
            ${showFooter ? this.createModalFooter(footerButtons, modalId) : ''}
        `;

        modalBackdrop.appendChild(modal);
        document.body.appendChild(modalBackdrop);

        // Show modal
        setTimeout(() => {
            modalBackdrop.classList.add('show');
            modal.classList.add('show');
        }, 10);

        // Close on backdrop click
        modalBackdrop.addEventListener('click', (e) => {
            if (e.target === modalBackdrop) {
                this.closeModal(modalId);
            }
        });

        // Escape key
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.closeModal(modalId);
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);

        return modalId;
    }

    closeModal(modalId) {
        const modalBackdrop = document.getElementById(`modal-backdrop-${modalId}`);
        const modal = document.getElementById(`modal-${modalId}`);
        
        if (modalBackdrop && modal) {
            modalBackdrop.classList.remove('show');
            modal.classList.remove('show');
            
            setTimeout(() => {
                if (modalBackdrop.parentElement) {
                    modalBackdrop.parentElement.removeChild(modalBackdrop);
                }
            }, 300);
        }
    }

    createModalFooter(buttons, modalId) {
        return `
            <div class="ai-modal-footer">
                ${buttons.map(btn => `
                    <button class="ai-btn ${btn.class || ''}" 
                            onclick="${btn.onclick || `AIOS.utils.closeModal('${modalId}')`}">
                        ${btn.text}
                    </button>
                `).join('')}
            </div>
        `;
    }

    /**
     * === FORM UTILITIES ===
     */
    validateForm(formElement) {
        const errors = [];
        const inputs = formElement.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            const value = input.value.trim();
            const required = input.hasAttribute('required');
            const type = input.type;
            
            if (required && !value) {
                errors.push(`${this.getLabelText(input)} je povinné`);
                input.classList.add('ai-input-error');
            } else if (type === 'email' && value && !this.isValidEmail(value)) {
                errors.push(`${this.getLabelText(input)} nie je platný email`);
                input.classList.add('ai-input-error');
            } else {
                input.classList.remove('ai-input-error');
            }
        });

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    getLabelText(input) {
        const label = input.closest('.ai-form-group')?.querySelector('.ai-label');
        return label?.textContent || input.name || 'Pole';
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    getFormData(formElement) {
        const formData = new FormData(formElement);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        return data;
    }

    /**
     * === ACCESSIBILITY UTILITIES ===
     */
    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'ai-sr-only';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    trapFocus(modalElement) {
        const focusableElements = modalElement.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        const handleKeyDown = (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        lastFocusable.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        firstFocusable.focus();
                        e.preventDefault();
                    }
                }
            }
        };

        modalElement.addEventListener('keydown', handleKeyDown);
        firstFocusable?.focus();

        return () => {
            modalElement.removeEventListener('keydown', handleKeyDown);
        };
    }

    /**
     * === ANIMATION UTILITIES ===
     */
    animate(element, keyframes, options = {}) {
        return element.animate(keyframes, {
            duration: 300,
            easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
            fill: 'forwards',
            ...options
        });
    }

    fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        const animation = element.animate([
            { opacity: 0 },
            { opacity: 1 }
        ], {
            duration: duration,
            easing: 'ease-out',
            fill: 'forwards'
        });

        return animation;
    }

    fadeOut(element, duration = 300) {
        const animation = element.animate([
            { opacity: 1 },
            { opacity: 0 }
        ], {
            duration: duration,
            easing: 'ease-out',
            fill: 'forwards'
        });

        animation.onfinish = () => {
            element.style.display = 'none';
        };

        return animation;
    }

    slideIn(element, direction = 'down', duration = 300) {
        const startTransforms = {
            up: 'translateY(-20px)',
            down: 'translateY(20px)',
            left: 'translateX(-20px)',
            right: 'translateX(20px)'
        };

        const transform = startTransforms[direction] || startTransforms.down;
        
        element.style.transform = transform;
        element.style.opacity = '0';
        element.style.display = 'block';

        const animation = element.animate([
            { transform: transform, opacity: 0 },
            { transform: 'translate(0, 0)', opacity: 1 }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
            fill: 'forwards'
        });

        return animation;
    }

    /**
     * === STORAGE UTILITIES ===
     */
    saveToStorage(key, data, storageType = 'localStorage') {
        try {
            const storage = window[storageType];
            storage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Chyba pri ukladaní do úložiska:', error);
            return false;
        }
    }

    loadFromStorage(key, storageType = 'localStorage') {
        try {
            const storage = window[storageType];
            const data = storage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Chyba pri načítavaní z úložiska:', error);
            return null;
        }
    }

    removeFromStorage(key, storageType = 'localStorage') {
        try {
            const storage = window[storageType];
            storage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Chyba pri mazaní z úložiska:', error);
            return false;
        }
    }

    /**
     * === API UTILITIES ===
     */
    async apiRequest(url, options = {}) {
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            timeout: 10000
        };

        const finalOptions = { ...defaultOptions, ...options };

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), finalOptions.timeout);

            const response = await fetch(url, {
                ...finalOptions,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            } else {
                return await response.text();
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Požiadavka vypršala');
            }
            throw error;
        }
    }

    /**
     * === UTILITY FUNCTIONS ===
     */
    generateId() {
        return Math.random().toString(36).substr(2, 9);
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

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    formatDate(date, locale = 'sk-SK') {
        return new Date(date).toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    copyToClipboard(text) {
        if (navigator.clipboard) {
            return navigator.clipboard.writeText(text);
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return Promise.resolve();
        }
    }

    /**
     * === GLOBAL EVENT LISTENERS ===
     */
    setupGlobalEventListeners() {
        // Handle online/offline status
        window.addEventListener('online', () => {
            this.showNotification('Pripojenie k internetu obnovené', 'success');
        });

        window.addEventListener('offline', () => {
            this.showNotification('Strata internetového pripojenia', 'warning');
        });

        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.announceToScreenReader('Aplikácia je teraz v pozadí');
            } else {
                this.announceToScreenReader('Aplikácia je teraz aktívna');
            }
        });
    }

    /**
     * === AI-OS SPECIFIC UTILITIES ===
     */
    integrateWithAIOSCore() {
        if (window.aiOSCore) {
            // Register with AI-OS Core
            const appInfo = this.getAppInfo();
            window.aiOSCore.registerApplication(appInfo.id, appInfo);

            // Listen for AI-OS Core events
            window.aiOSCore.on('appLaunch', (data) => {
                console.log('App launched via AI-OS Core:', data);
            });

            window.aiOSCore.on('systemStateUpdate', (state) => {
                console.log('System state updated:', state);
            });

            return true;
        }
        return false;
    }

    getAppInfo() {
        // Try to get app info from meta tags or data attributes
        const title = document.querySelector('title')?.textContent || 'AI-OS App';
        const description = document.querySelector('meta[name="description"]')?.content || 'AI-OS Application';
        const appId = document.querySelector('meta[name="app-id"]')?.content || this.generateId();

        return {
            id: appId,
            name: title,
            description: description,
            url: window.location.href,
            version: '1.0.0',
            category: 'application',
            capabilities: ['ui', 'interaction']
        };
    }

    // Standardized application lifecycle
    initApplication() {
        this.integrateWithAIOSCore();
        this.setupKeyboardNavigation();
        this.setupTouchOptimizations();
    }

    setupKeyboardNavigation() {
        // Skip links for accessibility
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Preskočiť na hlavný obsah';
        skipLink.className = 'ai-sr-only ai-focus-visible';
        skipLink.addEventListener('focus', function() {
            this.classList.remove('ai-sr-only');
        });
        skipLink.addEventListener('blur', function() {
            this.classList.add('ai-sr-only');
        });
        document.body.insertBefore(skipLink, document.body.firstChild);

        // Tab navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('using-keyboard');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('using-keyboard');
        });
    }

    setupTouchOptimizations() {
        // Prevent zoom on double tap
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (event) => {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);

        // Add touch feedback
        document.addEventListener('touchstart', (e) => {
            const target = e.target.closest('.ai-btn, .ai-card, .ai-tab');
            if (target) {
                target.style.transform = 'scale(0.98)';
            }
        });

        document.addEventListener('touchend', (e) => {
            const target = e.target.closest('.ai-btn, .ai-card, .ai-tab');
            if (target) {
                setTimeout(() => {
                    target.style.transform = '';
                }, 150);
            }
        });
    }
}

// Initialize AI-OS Utils globally
window.AIOS = window.AIOS || {};
window.AIOS.utils = new AIOSUtils();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.AIOS.utils.initApplication();
    });
} else {
    window.AIOS.utils.initApplication();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIOSUtils;
}