const { chromium } = require('playwright');
const path = require('path');

async function testMobileShell() {
    console.log('Starting AI-OS Mobile Shell tests...\n');
    
    const browser = await chromium.launch({ 
        headless: true,
        viewport: { width: 390, height: 844 } // iPhone 12 Pro dimensions
    });
    
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
        hasTouch: true
    });
    
    const page = await context.newPage();
    
    // Collect console messages
    const consoleMessages = [];
    const consoleErrors = [];
    
    page.on('console', msg => {
        const type = msg.type();
        const text = msg.text();
        consoleMessages.push({ type, text });
        if (type === 'error') {
            consoleErrors.push(text);
        }
    });
    
    page.on('pageerror', error => {
        consoleErrors.push(error.message);
    });
    
    try {
        // Navigate to mobile shell
        const filePath = path.join(__dirname, 'AI-OS', 'MOBILE', 'mobile-shell.html');
        await page.goto(`file://${filePath}`, { waitUntil: 'networkidle' });
        
        console.log('✓ Page loaded successfully');
        
        // Wait for app initialization
        await page.waitForTimeout(1500);
        
        // Check if loading overlay is hidden
        const loadingHidden = await page.$eval('#loadingOverlay', el => el.classList.contains('hidden'));
        console.log(loadingHidden ? '✓ Loading overlay hidden' : '✗ Loading overlay still visible');
        
        // Check if home screen is visible
        const homeScreenVisible = await page.$eval('#homeScreen', el => el.classList.contains('active'));
        console.log(homeScreenVisible ? '✓ Home screen visible' : '✗ Home screen not visible');
        
        // Check if app grid is rendered
        const appIcons = await page.$$('.app-icon');
        console.log(`✓ App icons rendered: ${appIcons.length}`);
        
        // Check if navigation bar exists
        const navBar = await page.$('.nav-bar');
        console.log(navBar ? '✓ Navigation bar present' : '✗ Navigation bar missing');
        
        // Check if status bar exists
        const statusBar = await page.$('.status-bar');
        console.log(statusBar ? '✓ Status bar present' : '✗ Status bar missing');
        
        // Test clicking on an app
        await page.click('.app-icon');
        await page.waitForTimeout(500);
        
        const homeScreenHidden = await page.$eval('#homeScreen', el => !el.classList.contains('active'));
        console.log(homeScreenHidden ? '✓ Home screen hides when app opens' : '✗ Home screen still visible');
        
        // Test back button
        await page.click('#navBack');
        await page.waitForTimeout(500);
        
        const homeScreenActive = await page.$eval('#homeScreen', el => el.classList.contains('active'));
        console.log(homeScreenActive ? '✓ Back button returns to home' : '✗ Back button failed');
        
        // Test app switcher
        await page.click('#navApps');
        await page.waitForTimeout(300);
        
        const switcherOpen = await page.$eval('#appSwitcher', el => el.classList.contains('open'));
        console.log(switcherOpen ? '✓ App switcher opens' : '✗ App switcher failed');
        
        // Close switcher
        await page.click('.switcher-close-btn');
        await page.waitForTimeout(300);
        
        const switcherClosed = await page.$eval('#appSwitcher', el => !el.classList.contains('open'));
        console.log(switcherClosed ? '✓ App switcher closes' : '✗ App switcher close failed');
        
        // Check console for errors
        console.log('\n--- Console Summary ---');
        console.log(`Total messages: ${consoleMessages.length}`);
        console.log(`Errors: ${consoleErrors.length}`);
        
        if (consoleErrors.length > 0) {
            console.log('\nErrors found:');
            consoleErrors.forEach((err, i) => console.log(`  ${i + 1}. ${err}`));
        } else {
            console.log('✓ No console errors detected');
        }
        
        console.log('\n--- Test Complete ---');
        
    } catch (error) {
        console.error('Test failed:', error.message);
    } finally {
        await browser.close();
    }
}

testMobileShell();
