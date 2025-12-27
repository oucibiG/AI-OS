# 📱 AI-OS Mobile Mod Loader

## 🎯 Prehľad

Mobile Mod Loader je pokročilý systém optimalizácie pre AI-OS, špecificky navrhnutý pre iPhone 11 Pro a podobné mobilné zariadenia. Poskytuje inteligentnú detekciu zariadení, automatické optimalizácie a pokročilé mobilné ovládanie.

## ✨ Kľúčové funkcie

### 🔍 **Inteligentná detekcia zariadení**
- Automatická detekcia iPhone 11 Pro (375×812px)
- Podpora všetkých iOS a Android zariadení
- Rozpoznanie tabletov vs. telefónov
- Detekcia orientácie obrazovky

### 📱 **iPhone 11 Pro optimalizácie**
- Správne zaobchádzanie s Safe Area (44px top, 34px bottom)
- Správne zobrazenie status baru
- Home indicator podpora
- Pixel-perfect rozlíšenie (3x Retina)

### 🎛️ **Mobilné ovládanie**
- Vysúvateľný panel mobilných nastavení
- Prepínanie režimov (Auto/Mobile/Desktop)
- Nastavenie škálovania rozhrania (70%-130%)
- Safe Area toggle
- Status bar toggle

### 🚀 **Výkon optimalizácie**
- Touch-action optimalizácie
- Zabránenie nechcenému zoomu
- Optimalizované scrollovanie
- Zabránenie selection/highlight
- Viewport height fix pre mobilné prehliadače

## 📋 Inštalácia a používanie

### 1. **Zahrnutie do HTML**

```html
<!-- V <head> sekcii pred ostatnými skriptami -->
<script src="mobile-mod-loader.js"></script>
```

### 2. **Automatická inicializácia**

Mobile Mod Loader sa automaticky inicializuje pri načítaní stránky:

```javascript
// Globalne dostupná inštancia
window.mobileLoader = new MobileModLoader();
```

### 3. **Viewport meta tagy**

Pre správne fungovanie pridajte tieto meta tagy:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="AI-OS">
<meta name="format-detection" content="telephone=no">
```

## 🎮 Ovládanie

### 📱 **Mobilný panel nastavení**

Na mobilných zariadeniach sa automaticky zobrazí vysúvateľný panel s nastaveniami:

1. **Otvorenie panelu**: Kliknite na ikonu 📱 na pravom okraji obrazovky
2. **Prepínanie režimov**: Auto Detect / Mobile Mode / Desktop Mode
3. **Škálovanie**: Posuvník pre úpravu veľkosti rozhrania
4. **Safe Area**: Zapnutie/vypnutie iOS safe area
5. **Status Bar**: Zapnutie/vypnutie status baru
6. **Reset**: Obnovenie všetkých nastavení

### ⌨️ **API metódy**

```javascript
// Získanie informácií o zariadení
const deviceInfo = mobileLoader.getDeviceInfo();
console.log(deviceInfo);
// {
//   isMobile: true,
//   isIPhone11Pro: true,
//   screenWidth: 375,
//   screenHeight: 812,
//   devicePixelRatio: 3,
//   // ... ďalšie info
// }

// Zmena režimu
mobileLoader.changeMode('mobile'); // alebo 'desktop' alebo 'auto'

// Zmena škálovania
mobileLoader.changeScale(1.2); // 70% - 130%

// Toggle Safe Area
mobileLoader.toggleSafeArea(true);

// Toggle Status Bar
mobileLoader.toggleStatusBar(true);

// Refresh layout
mobileLoader.refreshLayout();

// Reset nastavení
mobileLoader.resetSettings();

// Kontrola aktuálneho režimu
const isMobileMode = mobileLoader.isCurrentModeMobile();
const currentMode = mobileLoader.getCurrentMode();
```

## 🔧 Konfigurácia

### CSS Custom Properties

Mobile Mod Loader používa CSS custom properties:

```css
:root {
    --safe-area-top: 44px;      /* iOS status bar */
    --safe-area-bottom: 34px;   /* iOS home indicator */
    --mobile-scale: 1;          /* Interface scale */
    --vh: 16px;                 /* Viewport height unit */
}
```

### Local Storage

Nastavenia sa ukladajú do Local Storage:

```javascript
// Uložené nastavenia
localStorage.getItem('ai-os-display-mode');     // 'auto' | 'mobile' | 'desktop'
localStorage.getItem('ai-os-mobile-scale');     // '0.7' - '1.3'
localStorage.getItem('ai-os-safe-area');        // 'true' | 'false'
localStorage.getItem('ai-os-status-bar');       // 'true' | 'false'
```

## 📱 Podporované zariadenia

### ✅ **iPhone 11 Pro** (Optimalizované)
- Rozlíšenie: 375×812 CSS pixelov
- Pixel ratio: 3x
- Safe Area podpora
- Home indicator podpora

### ✅ **Ostatné iOS zariadenia**
- iPhone SE, 12, 13, 14, 15 series
- iPad (všetky modely)
- iPod Touch

### ✅ **Android zariadenia**
- Všetky telefóny s Android
- Android tablety
- Chrome Mobile

### ✅ **Desktop zariadenia**
- Windows, macOS, Linux
- Chrome, Firefox, Safari, Edge

## 🎨 Styling a témy

Mobile Mod Loader automaticky pridáva CSS triedy:

```html
<body class="ai-os-mobile mobile-device iphone-11-pro">
    <!-- Obsah aplikácie -->
</body>
```

### CSS triedy

- `ai-os-mobile` - Prítomnosť mobile mod loader
- `mobile-device` - Mobilné zariadenie
- `iphone-11-pro` - iPhone 11 Pro (špecifické optimalizácie)
- `mobile-mode` - Aktivovaný mobile režim
- `desktop-mode` - Aktivovaný desktop režim
- `auto-mode` - Automatická detekcia

## 🚨 Troubleshooting

### Problém: Mobile panel sa nezobrazuje
**Riešenie**: Uistite sa, že je `mobile-mod-loader.js` načítaný pred DOMContentLoaded eventom.

### Problém: Safe Area nefunguje na iPhone
**Riešenie**: Skontrolujte, či máte viewport-fit=cover v meta tagu a CSS custom properties sú definované.

### Problém: Rozhranie je príliš malé/veľké
**Riešenie**: Použite mobile panel na nastavenie škálovania alebo manuálne upravte `--mobile-scale`.

### Problém: Gestá nefungujú správne
**Riešenie**: Uistite sa, že CSS obsahuje `touch-action: manipulation` pre mobilné elementy.

## 🔄 Aktualizácie a podpora

Mobile Mod Loader je súčasťou AI-OS a bude priebežne aktualizovaný pre podporu nových zariadení a optimalizácií.

### Changelog
- **v1.0.0** -初始ná verzia s iPhone 11 Pro podporou
- **v1.1.0** - Pridané tablet detection a tablet optimalizácie
- **v1.2.0** - Vylepšené Android podpora

## 📞 Podpora

Pre otázky a problémy s Mobile Mod Loader kontaktujte vývojársky tím AI-OS alebo vytvorte issue v repozitári.

---

**📱 AI-OS Mobile Mod Loader - Optimalizované pre mobilný zážitok!**