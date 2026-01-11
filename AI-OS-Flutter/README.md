# AI-OS Flutter Edition

A web-based Operating System simulation built with Flutter. This project wraps the existing AI-OS web applications in a Flutter shell, providing a native-feeling desktop/mobile experience with window management, taskbar, and responsive layouts.

## Features

- 🖥️ **Desktop Environment** - Window management with draggable, resizable windows
- 📱 **Mobile Support** - Responsive layout with full-screen app mode
- 🧩 **App Integration** - Embeds existing HTML/JS applications
- 🎨 **Modern UI** - Glassmorphism design with blur effects
- ⚡ **Fast Performance** - Smooth 60fps animations

## Project Structure

```
AI-OS-Flutter/
├── lib/
│   ├── main.dart                      # Entry point
│   ├── models/
│   │   └── app_model.dart             # App definitions and categories
│   ├── services/
│   │   ├── window_manager.dart        # Window management state
│   │   └── system_state.dart          # System-wide state (theme, volume, etc.)
│   ├── components/
│   │   ├── taskbar.dart               # Bottom taskbar with window buttons
│   │   ├── window_frame.dart          # Draggable window container
│   │   ├── desktop_icon.dart          # Desktop shortcut icons
│   │   └── web_view_container.dart    # HTML content embedding
│   └── screens/
│       └── desktop_screen.dart        # Main desktop/mobile layout
├── web/
│   ├── index.html                     # HTML entry point
│   └── assets/
│       ├── apps/                      # All AI-OS applications
│       ├── core/                      # Core JS files
│       ├── css/                       # Stylesheets
│       ├── js/                        # JavaScript utilities
│       └── icons/                     # SVG icons
├── pubspec.yaml                       # Flutter dependencies
└── analysis_options.yaml              # Linting rules
```

## Prerequisites

- Flutter 3.0.0 or higher
- Chrome browser (for web testing)
- Git

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd AI-OS-Flutter
   ```

2. **Get dependencies**
   ```bash
   flutter pub get
   ```

3. **Run the application**
   ```bash
   flutter run -d chrome
   ```

4. **Build for production**
   ```bash
   flutter build web --release
   ```

## Configuration

### Adding New Applications

To add a new application, edit `lib/models/app_model.dart`:

```dart
AppDefinition(
  id: 'my-app',
  name: 'My Application',
  icon: '📦',
  path: 'apps/path/to/my-app.html',
  category: AppCategory.productivity,
  defaultWidth: 800,
  defaultHeight: 600,
)
```

### Platform Views Configuration

For full HTML embedding, ensure your `web/index.html` includes the platform view registry:

```javascript
// Register platform views
ui.platformViewRegistry.registerViewFactory(
  'app-container',
  (int viewId) {
    final iframe = document.createElement('iframe');
    iframe.src = 'assets/apps/your-app/index.html';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    return iframe;
  }
);
```

## Supported Applications

### System Apps
- File Manager
- System Settings
- Task Manager
- System Monitor
- Desktop Manager

### Development Apps
- Terminal Shell
- Terminal Pro (Enhanced)

### Mobile Apps
- Android SDK Integration
- Android Emulator
- App Store
- Voice Interface

### Productivity Apps
- Network Monitor
- Ecosystem Dashboard

## Customization

### Theme Colors

Edit `lib/services/system_state.dart`:

```dart
Color getAccentColor() {
  return const Color(0xFF00d4ff); // Change accent color
}
```

### Taskbar Height

Edit `lib/components/taskbar.dart`:

```dart
Container(
  height: 56, // Adjust taskbar height
  ...
)
```

## Troubleshooting

### Issue: Apps don't load
- Ensure assets are properly copied: `flutter pub get`
- Check browser console for CORS errors

### Issue: Window dragging is laggy
- Ensure `pointer_interceptor` package is properly configured
- Check that iframes don't capture pointer events

### Issue: Mobile layout not working
- Check browser window width (< 768px for mobile layout)
- Ensure responsive breakpoints are set correctly

## Technologies Used

- **Flutter** - UI framework
- **Provider** - State management
- **pointer_interceptor** - Widget overlay support
- **SharedPreferences** - Settings persistence
- **window_manager** - Native window controls

## License

This project is based on the AI-OS web project. See the original project for licensing information.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

For issues and feature requests, please use the GitHub issue tracker.
