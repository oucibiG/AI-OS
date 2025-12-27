const { chromium } = require('playwright');
const path = require('path');

async function testMobileShellButtons() {
    console.log('=== AI-OS Mobile Shell - Komplexné testovanie tlačidiel ===\n');
    
    const browser = await chromium.launch({ 
        headless: true,
        viewport: { width: 390, height: 844 }
    });
    
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
        hasTouch: true
    });
    
    const page = await context.newPage();
    
    const consoleErrors = [];
    const testResults = [];
    
    page.on('console', msg => {
        if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
        }
    });
    
    page.on('pageerror', error => {
        consoleErrors.push(error.message);
    });
    
    function logTest(name, passed, details = '') {
        const status = passed ? '✓' : '✗';
        console.log(`${status} ${name}${details ? ': ' + details : ''}`);
        testResults.push({ name, passed, details });
    }
    
    try {
        // Load the page
        const filePath = path.join(__dirname, 'AI-OS', 'MOBILE', 'mobile-shell.html');
        await page.goto(`file://${filePath}`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(1500);
        
        logTest('Stránka načítaná', true);
        
        // === TEST 1: Navigačná lišta ===
        console.log('\n--- Navigačná lišta ---');
        
        // Check if nav bar exists
        const navBar = await page.$('.nav-bar');
        logTest('Navigačná lišta existuje', !!navBar);
        
        // Check all nav buttons
        const navBack = await page.$('#navBack');
        const navHome = await page.$('#navHome');
        const navApps = await page.$('#navApps');
        logTest('Tlačidlo Späť existuje', !!navBack);
        logTest('Tlačidlo Domov existuje', !!navHome);
        logTest('Tlačidlo Aplikácie existuje', !!navApps);
        
        // Test button clickability
        const backClickable = await navBack.isEnabled();
        const homeClickable = await navHome.isEnabled();
        const appsClickable = await navApps.isEnabled();
        logTest('Tlačidlo Späť je klikateľné', backClickable);
        logTest('Tlačidlo Domov je klikateľné', homeClickable);
        logTest('Tlačidlo Aplikácie je klikateľné', appsClickable);
        
        // === TEST 2: Aplikačné ikony ===
        console.log('\n--- Aplikačné ikony ---');
        
        const appIcons = await page.$$('.app-icon');
        logTest('Počet aplikačných ikon: ' + appIcons.length, appIcons.length === 4, String(appIcons.length) + ' ikoniek');
        
        // Test each app icon
        for (let i = 0; i < appIcons.length; i++) {
            const icon = appIcons[i];
            const isClickable = await icon.isEnabled();
            logTest('Aplikačná ikona ' + (i + 1) + ' je klikateľná', isClickable);
        }
        
        // === TEST 3: Rýchle akcie ===
        console.log('\n--- Rýchle akcie ---');
        
        const quickActions = await page.$$('.quick-action-btn');
        logTest('Počet tlačidiel rýchlych akcií: ' + quickActions.length, quickActions.length === 4, String(quickActions.length) + ' tlačidiel');
        
        // Test quick action buttons
        for (let i = 0; i < quickActions.length; i++) {
            const btn = quickActions[i];
            const isClickable = await btn.isEnabled();
            logTest('Tlačidlo rýchlej akcie ' + (i + 1) + ' je klikateľné', isClickable);
        }
        
        // === TEST 4: Prepínač aplikácií ===
        console.log('\n--- Prepínač aplikácií ---');
        
        // Open app switcher
        await page.click('#navApps');
        await page.waitForTimeout(500);
        
        const switcherOpen = await page.$eval('#appSwitcher', el => el.classList.contains('open'));
        logTest('Prepínač aplikácií sa otvorí', switcherOpen);
        
        const switcherApps = await page.$$('.switcher-app');
        logTest('Počet aplikácií v prepínači: ' + switcherApps.length, switcherApps.length === 5, String(switcherApps.length) + ' aplikácií');
        
        // Test switcher app buttons
        for (let i = 0; i < switcherApps.length; i++) {
            const app = switcherApps[i];
            const isClickable = await app.isEnabled();
            logTest('Aplikácia v prepínači ' + (i + 1) + ' je klikateľná', isClickable);
        }
        
        // Test close button
        const closeBtn = await page.$('.switcher-close-btn');
        const closeClickable = await closeBtn.isEnabled();
        logTest('Tlačidlo zatvorenia je klikateľné', closeClickable);
        
        // Close switcher
        await page.click('.switcher-close-btn');
        await page.waitForTimeout(300);
        const switcherClosed = await page.$eval('#appSwitcher', el => !el.classList.contains('open'));
        logTest('Prepínač aplikácií sa zatvorí', switcherClosed);
        
        // === TEST 5: Otvorenie aplikácií ===
        console.log('\n--- Otvorenie aplikácií ---');
        
        // Open first app
        await page.click('#navHome');
        await page.waitForTimeout(300);
        await page.click('#appGrid .app-icon:nth-child(1)');
        await page.waitForTimeout(500);
        
        let appActive = await page.$eval('#app-container-voice-interface', el => el.classList.contains('active'));
        let homeInactive = await page.$eval('#homeScreen', el => !el.classList.contains('active'));
        logTest('Otvorenie aplikácie: Hlasový asistent', appActive && homeInactive);
        
        // Test back button returns home
        await page.click('#navBack');
        await page.waitForTimeout(500);
        let homeActiveAfterBack = await page.$eval('#homeScreen', el => el.classList.contains('active'));
        logTest('Návrat domov po Hlasový asistent', homeActiveAfterBack);
        
        // Open second app
        await page.click('#navHome');
        await page.waitForTimeout(300);
        await page.click('#appGrid .app-icon:nth-child(2)');
        await page.waitForTimeout(500);
        
        appActive = await page.$eval('#app-container-ai-learning-center', el => el.classList.contains('active'));
        homeInactive = await page.$eval('#homeScreen', el => !el.classList.contains('active'));
        logTest('Otvorenie aplikácie: Vzdelávanie', appActive && homeInactive);
        
        // Test back button returns home
        await page.click('#navBack');
        await page.waitForTimeout(500);
        homeActiveAfterBack = await page.$eval('#homeScreen', el => el.classList.contains('active'));
        logTest('Návrat domov po Vzdelávanie', homeActiveAfterBack);
        
        // Open third app
        await page.click('#navHome');
        await page.waitForTimeout(300);
        await page.click('#appGrid .app-icon:nth-child(3)');
        await page.waitForTimeout(500);
        
        appActive = await page.$eval('#app-container-ai-performance-optimizer', el => el.classList.contains('active'));
        homeInactive = await page.$eval('#homeScreen', el => !el.classList.contains('active'));
        logTest('Otvorenie aplikácie: Optimalizácia', appActive && homeInactive);
        
        // Test back button returns home
        await page.click('#navBack');
        await page.waitForTimeout(500);
        homeActiveAfterBack = await page.$eval('#homeScreen', el => el.classList.contains('active'));
        logTest('Návrat domov po Optimalizácia', homeActiveAfterBack);
        
        // Open fourth app
        await page.click('#navHome');
        await page.waitForTimeout(300);
        await page.click('#appGrid .app-icon:nth-child(4)');
        await page.waitForTimeout(500);
        
        appActive = await page.$eval('#app-container-ai-plugin-marketplace', el => el.classList.contains('active'));
        homeInactive = await page.$eval('#homeScreen', el => !el.classList.contains('active'));
        logTest('Otvorenie aplikácie: Marketplace', appActive && homeInactive);
        
        // Test back button returns home
        await page.click('#navBack');
        await page.waitForTimeout(500);
        homeActiveAfterBack = await page.$eval('#homeScreen', el => el.classList.contains('active'));
        logTest('Návrat domov po Marketplace', homeActiveAfterBack);
        
        // === TEST 6: Tlačidlá v aplikáciách ===
        console.log('\n--- Tlačidlá v aplikáciách ---');
        
        // Open a specific app
        await page.click('#navHome');
        await page.waitForTimeout(300);
        await page.click('#appGrid .app-icon:nth-child(1)');
        await page.waitForTimeout(500);
        
        // Find buttons in the active app
        const appButtons = await page.$$('#app-container-voice-interface .ai-btn');
        logTest('Tlačidlá v Hlasovom asistentovi: ' + appButtons.length, appButtons.length > 0, String(appButtons.length) + ' tlačidiel');
        
        // === TEST 7: Klávesová navigácia ===
        console.log('\n--- Klávesová navigácia ---');
        
        // Go home first
        await page.click('#navHome');
        await page.waitForTimeout(300);
        
        // Test number key navigation (1 opens first app)
        await page.keyboard.press('1');
        await page.waitForTimeout(500);
        
        const appOpenedViaNumber = await page.$eval('#app-container-voice-interface', el => el.classList.contains('active'));
        logTest('Aplikácia sa otvorí cez číselný kláves (1)', appOpenedViaNumber);
        
        // Press Escape to go back
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
        const homeAfterEscape = await page.$eval('#homeScreen', el => el.classList.contains('active'));
        logTest('Escape vráti domov', homeAfterEscape);
        
        // Test Home key
        await page.click('#navHome');
        await page.waitForTimeout(300);
        await page.click('#appGrid .app-icon:nth-child(2)');
        await page.waitForTimeout(500);
        await page.keyboard.press('Home');
        await page.waitForTimeout(500);
        const homeAfterHomeKey = await page.$eval('#homeScreen', el => el.classList.contains('active'));
        logTest('Home kláves vráti domov', homeAfterHomeKey);
        
        // === TEST 8: Stavový riadok ===
        console.log('\n--- Stavový riadok ---');
        
        const statusBar = await page.$('.status-bar');
        logTest('Stavový riadok existuje', !!statusBar);
        
        const statusTime = await page.$('#statusTime');
        const timeText = await statusTime.textContent();
        const timeValid = /^\d{2}:\d{2}$/.test(timeText);
        logTest('Čas je vo správnom formáte', timeValid, timeText);
        
        // === TEST 9: Gesture Area ===
        console.log('\n--- Gesture Area ---');
        
        const gestureArea = await page.$('.gesture-area');
        logTest('Gesture Area existuje', !!gestureArea);
        
        const gestureAreaVisible = await gestureArea.isVisible();
        logTest('Gesture Area je viditeľná', gestureAreaVisible);
        
        // === TEST 10: Accessibility ===
        console.log('\n--- Prístupnosť ---');
        
        const navBarRole = await page.$eval('.nav-bar', el => el.getAttribute('role'));
        logTest('Navigačná lišta má ARIA role', navBarRole === 'navigation');
        
        const navBtnsHaveAria = await page.$eval('#navBack', el => el.hasAttribute('aria-label'));
        logTest('Tlačidlá majú ARIA labels', navBtnsHaveAria);
        
        // === SÚHRN ===
        console.log('\n=== SÚHRN TESTOV ===');
        const passedCount = testResults.filter(r => r.passed).length;
        const totalCount = testResults.length;
        console.log('Úspešné: ' + passedCount + '/' + totalCount);
        
        if (passedCount < totalCount) {
            console.log('\nZlyhané testy:');
            testResults.filter(r => !r.passed).forEach(r => {
                console.log('  ✗ ' + r.name + ': ' + r.details);
            });
        }
        
        console.log('\n--- Chyby v konzole ---');
        console.log('Počet chýb: ' + consoleErrors.length);
        if (consoleErrors.length > 0) {
            consoleErrors.forEach((err, i) => {
                console.log('  ' + (i + 1) + '. ' + err);
            });
        } else {
            console.log('Žiadne chyby v konzole');
        }
        
        console.log('\n=== TESTOVANIE UKONČENÉ ===');
        
    } catch (error) {
        console.error('Testovanie zlyhalo:', error.message);
    } finally {
        await browser.close();
    }
}

testMobileShellButtons();
