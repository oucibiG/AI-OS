// Skript pre pridanie home tlačidiel do AI-OS aplikácií
const fs = require('fs');
const path = require('path');

const appsDir = '/workspace/AI-OS/Apps';
const mobileDir = '/workspace/AI-OS/MOBILE';

// Aplikácie ktoré už majú home tlačidlá
const alreadyProcessed = [
    'ai-system-monitor.html',
    'ai-terminal-shell.html', 
    'ai-universal-interface.html',
    'ai-network-monitor.html',
    'ai-android-emulator.html'
];

// Univerzálne CSS štýly pre floating home button
const floatingHomeCSS = `
        /* Floating Home Button */
        .floating-home-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            background: rgba(0, 255, 0, 0.3);
            border: 2px solid #00ff88;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            cursor: pointer;
            z-index: 1000;
            transition: all 0.3s ease;
            animation: homePulse 2s infinite;
        }

        .floating-home-btn:hover {
            background: rgba(0, 255, 0, 0.5);
            transform: scale(1.1);
            box-shadow: 0 0 20px rgba(0, 255, 0, 0.7);
            animation: none;
        }

        @keyframes homePulse {
            0%, 100% { box-shadow: 0 0 5px rgba(0, 255, 0, 0.3); }
            50% { box-shadow: 0 0 15px rgba(0, 255, 0, 0.6); }
        }`;

// Univerzálna goHome funkcia
const goHomeFunction = `
        function goHome() {
            // Create smooth transition effect
            const container = document.querySelector('.app-container, .main-container, body > div, body');
            if (container) {
                container.style.opacity = '0';
                container.style.transform = 'scale(0.9)';
            }
            
            setTimeout(() => {
                // Navigate back to main AI-OS
                if (window.opener) {
                    window.close();
                } else {
                    const basePath = window.location.pathname.includes('/Apps/') ? '../' : '../../';
                    window.location.href = basePath + 'ADVANCED-AI-OS.html';
                }
            }, 300);
        }`;

function processFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        // Pridaj floating home button do body
        if (!content.includes('floating-home-btn')) {
            const bodyMatch = content.match(/<body[^>]*>/);
            if (bodyMatch) {
                const buttonHTML = `\n    <!-- Floating Home Button -->
    <div class="floating-home-btn" onclick="goHome()" title="Domov">🏠</div>`;
                content = content.replace(bodyMatch[0], bodyMatch[0] + buttonHTML);
                modified = true;
            }
        }

        // Pridaj CSS štýly
        if (!content.includes('floating-home-btn {') && !content.includes('@keyframes homePulse')) {
            const styleMatch = content.match(/<\/style>/);
            if (styleMatch) {
                content = content.replace(styleMatch[0], floatingHomeCSS + '\n    </style>');
                modified = true;
            }
        }

        // Pridaj goHome funkciu
        if (!content.includes('function goHome()')) {
            const scriptMatch = content.match(/<\/script>/);
            if (scriptMatch) {
                content = content.replace(scriptMatch[0], goHomeFunction + '\n    </script>');
                modified = true;
            }
        }

        if (modified) {
            fs.writeFileSync(filePath, content);
            console.log(`✅ Aktualizovaný: ${path.basename(filePath)}`);
        } else {
            console.log(`⏭️  Preskočený: ${path.basename(filePath)} (už má home tlačidlo)`);
        }

    } catch (error) {
        console.error(`❌ Chyba pri spracovaní ${path.basename(filePath)}:`, error.message);
    }
}

// Spracuj všetky HTML súbory
const allFiles = [
    ...fs.readdirSync(appsDir).filter(f => f.endsWith('.html')).map(f => path.join(appsDir, f)),
    ...fs.readdirSync(mobileDir).filter(f => f.endsWith('.html')).map(f => path.join(mobileDir, f))
];

console.log('🏠 Pridávam home tlačidlá do AI-OS aplikácií...');
console.log('===========================================');

allFiles.forEach(filePath => {
    const fileName = path.basename(filePath);
    if (!alreadyProcessed.includes(fileName) && !fileName.includes('ADVANCED-AI-OS')) {
        processFile(filePath);
    }
});

console.log('===========================================');
console.log('🎉 Dokončené! Všetky aplikácie majú teraz home tlačidlá.');
