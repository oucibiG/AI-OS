// Test script to verify AI-OS Flutter project structure
import 'dart:io';

void main() {
  print('Testing AI-OS Flutter Project Structure...\n');
  
  final requiredFiles = [
    'pubspec.yaml',
    'analysis_options.yaml',
    'README.md',
    'web/index.html',
  ];
  
  final requiredDirs = [
    'lib',
    'lib/models',
    'lib/services',
    'lib/components',
    'lib/screens',
    'web',
    'web/assets',
    'web/assets/apps',
  ];
  
  bool allFilesExist = true;
  
  // Check required files
  print('Checking required files:');
  for (final file in requiredFiles) {
    final exists = File(file).existsSync();
    print('  ${exists ? '✓' : '✗'} $file');
    if (!exists) allFilesExist = false;
  }
  
  // Check required directories
  print('\nChecking required directories:');
  for (final dir in requiredDirs) {
    final exists = Directory(dir).existsSync();
    print('  ${exists ? '✓' : '✗'} $dir/');
    if (!exists) allFilesExist = false;
  }
  
  // Check lib files
  print('\nChecking lib source files:');
  final libFiles = [
    'lib/main.dart',
    'lib/models/app_model.dart',
    'lib/services/window_manager.dart',
    'lib/services/system_state.dart',
    'lib/components/taskbar.dart',
    'lib/components/window_frame.dart',
    'lib/components/desktop_icon.dart',
    'lib/components/web_view_container.dart',
    'lib/screens/desktop_screen.dart',
  ];
  
  for (final file in libFiles) {
    final exists = File(file).existsSync();
    print('  ${exists ? '✓' : '✗'} $file');
    if (!exists) allFilesExist = false;
  }
  
  // Check web assets
  print('\nChecking web assets:');
  final assetDirs = [
    'web/assets/apps',
    'web/assets/js',
    'web/assets/css',
    'web/assets/icons',
  ];
  
  for (final dir in assetDirs) {
    final exists = Directory(dir).existsSync();
    final itemCount = exists ? Directory(dir).listSync().length : 0;
    print('  ${exists ? '✓' : '✗'} $dir/ ($itemCount items)');
  }
  
  print('\n${'=' * 50}');
  if (allFilesExist) {
    print('✓ All required files and directories exist!');
    print('\nTo run the project:');
    print('  1. cd AI-OS-Flutter');
    print('  2. flutter pub get');
    print('  3. flutter run -d chrome');
  } else {
    print('✗ Some files or directories are missing!');
  }
}
