# Tauri Desktop App Setup Guide

## Prerequisites Installation

### 1. Install Rust (Required)

**For Windows:**
1. Download Rust installer: https://www.rust-lang.org/tools/install
2. Run `rustup-init.exe`
3. Follow the prompts (default options are fine)
4. Restart your terminal after installation

**Verify Installation:**
```bash
rustc --version
cargo --version
```

### 2. Install Visual Studio C++ Build Tools (Windows only)

Download and install from: https://visualstudio.microsoft.com/visual-cpp-build-tools/

Select:
- Desktop development with C++
- MSVC v142 or later
- Windows 10 SDK

## Project Structure

```
pims_ui/
├── src/                    # React application code
├── public/                 # Static assets
├── build/                  # React production build (created by npm run build)
├── src-tauri/              # Tauri Rust backend (NEW)
│   ├── src/
│   │   └── main.rs         # Tauri entry point
│   ├── icons/              # App icons for different platforms
│   ├── Cargo.toml          # Rust dependencies
│   └── tauri.conf.json     # Tauri configuration
└── package.json            # Updated with Tauri scripts
```

## Configuration

### Tauri Config (`src-tauri/tauri.conf.json`)

Key settings configured:
- **Product Name:** "UCC Optometry Clinic"
- **Window Size:** 1400x900 (min: 1024x600)
- **HTTP Allowlist:** Allows requests to Django backend (localhost:8000)
- **Notifications:** Enabled for appointment updates
- **Dialog:** File open/save dialogs enabled

### API Endpoints

The desktop app connects to your Django backend:
- Development: `http://localhost:8000`
- Production: Configure in environment variables

## Development Workflow

### 1. Start Django Backend
```bash
cd ../optometry_clinic
source venv/Scripts/activate  # or venv\Scripts\activate on Windows
python manage.py runserver
```

### 2. Start Tauri Development Mode
```bash
cd pims_ui
npm run tauri:dev
```

This will:
1. Start React dev server (localhost:3000)
2. Open desktop window showing the React app
3. Hot reload on code changes

### 3. Make Changes
- Edit React code in `src/` - changes hot reload
- Edit Tauri config in `src-tauri/tauri.conf.json` - restart dev mode
- Edit Rust code in `src-tauri/src/` - auto-recompiles

## Building for Production

### Build the Desktop App

```bash
npm run tauri:build
```

This creates:
- **Windows:** `.exe` installer in `src-tauri/target/release/bundle/msi/`
- **macOS:** `.dmg` installer in `src-tauri/target/release/bundle/dmg/`
- **Linux:** `.deb` or `.AppImage` in `src-tauri/target/release/bundle/`

### Build Process:
1. Runs `npm run build` (creates optimized React build)
2. Compiles Rust code
3. Bundles everything into native installer

## Available Scripts

```bash
# Web development (as before)
npm start                 # React dev server only

# Desktop development
npm run tauri:dev         # Run desktop app in dev mode

# Desktop production build
npm run tauri:build       # Create native installers

# Tauri CLI
npm run tauri             # Access Tauri CLI commands
npm run tauri info        # Check environment and dependencies
```

## Tauri API Usage in React

### Example: Desktop Notifications

```javascript
import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/api/notification';

async function notifyUser() {
  let permissionGranted = await isPermissionGranted();
  if (!permissionGranted) {
    const permission = await requestPermission();
    permissionGranted = permission === 'granted';
  }
  if (permissionGranted) {
    sendNotification({ title: 'Appointment Ready', body: 'Patient is waiting' });
  }
}
```

### Example: Check if Running in Tauri

```javascript
import { appWindow } from '@tauri-apps/api/window';

const isDesktop = window.__TAURI__ !== undefined;

if (isDesktop) {
  // Desktop-specific features
  console.log('Running as desktop app');
} else {
  // Web-specific features
  console.log('Running in browser');
}
```

### Example: File Dialogs

```javascript
import { open, save } from '@tauri-apps/api/dialog';

// Open file picker
const selected = await open({
  multiple: false,
  filters: [{
    name: 'Excel',
    extensions: ['xlsx', 'xls']
  }]
});

// Save file dialog
const filePath = await save({
  filters: [{
    name: 'PDF',
    extensions: ['pdf']
  }]
});
```

## Features Enabled

1. **HTTP Requests:** Can communicate with Django backend
2. **Notifications:** Desktop notifications for appointments
3. **File Dialogs:** Import/export patient data
4. **Shell Open:** Open external links in default browser

## Troubleshooting

### "Rust not found"
- Install Rust from https://rustup.rs/
- Restart terminal/IDE after installation

### "MSVC not found" (Windows)
- Install Visual Studio C++ Build Tools
- Ensure MSVC and Windows SDK are selected

### "Port 3000 already in use"
- Stop any running React dev server
- Or change port in `tauri.conf.json` devPath

### Build fails
```bash
# Clean and rebuild
cd src-tauri
cargo clean
cd ..
npm run tauri:build
```

## Distribution

### Windows
- Installer: `src-tauri/target/release/bundle/msi/UCC Optometry Clinic_0.1.0_x64_en-US.msi`
- Portable: `src-tauri/target/release/ucc-optometry-clinic.exe`

### Updating Icons
Replace icons in `src-tauri/icons/` with your clinic logo:
- Use https://tauri.app/v1/guides/features/icons to generate all sizes

## Next Steps

1. **Install Rust** (see Prerequisites above)
2. Run `npm run tauri info` to verify setup
3. Run `npm run tauri:dev` to test desktop app
4. Customize app icon in `src-tauri/icons/`
5. Add desktop-specific features using Tauri APIs

## Resources

- Tauri Docs: https://tauri.app/v1/guides/
- Tauri API: https://tauri.app/v1/api/js/
- Rust Book: https://doc.rust-lang.org/book/
