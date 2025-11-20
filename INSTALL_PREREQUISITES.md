# Install Tauri Prerequisites

## Step 1: Install Rust (5 minutes)

### Download and Install
1. Open PowerShell or CMD (as Administrator recommended)
2. Download Rust installer:
   ```
   https://static.rust-lang.org/rustup/dist/x86_64-pc-windows-msvc/rustup-init.exe
   ```
3. Run the downloaded `rustup-init.exe`
4. When prompted, press **1** then **Enter** (Proceed with installation - default)
5. Wait for installation to complete (downloads ~400MB)
6. **IMPORTANT:** Close and reopen your terminal

### Verify Installation
```bash
rustc --version
cargo --version
rustup --version
```

Expected output:
```
rustc 1.xx.x
cargo 1.xx.x
rustup 1.xx.x
```

---

## Step 2: Install Visual Studio C++ Build Tools (10-15 minutes)

### Download
https://aka.ms/vs/17/release/vs_BuildTools.exe

### Installation Steps
1. Run `vs_BuildTools.exe`
2. In the installer, select **"Desktop development with C++"**
3. On the right panel, ensure these are checked:
   - ✅ MSVC v143 - VS 2022 C++ x64/x86 build tools (Latest)
   - ✅ Windows 11 SDK (10.0.22621.0 or latest)
   - ✅ C++ CMake tools for Windows
4. Click **Install** (downloads ~6-8GB)
5. Wait for installation (can take 15-30 minutes)
6. **Restart your computer** after installation

---

## Step 3: Verify Everything

After restarting, open a **new terminal** and run:

```bash
cd /c/Users/info/Desktop/UCC/Projects/PIMS/pims_ui
npm run tauri info
```

### Expected Output (all ✔):
```
[✔] Environment
    - OS: Windows 10.0.26100 X64
    ✔ WebView2: 142.0.3595.80
    ✔ MSVC: Visual Studio Build Tools 2022
    ✔ rustc: 1.xx.x
    ✔ Cargo: 1.xx.x
    ✔ rustup: 1.xx.x
    ✔ Rust toolchain: stable-x86_64-pc-windows-msvc
```

---

## Quick Install Commands (Alternative)

### Using Winget (Windows Package Manager)
If you have winget installed:

```powershell
# Install Rust
winget install --id Rustlang.Rustup

# Install Visual Studio Build Tools (requires GUI selection)
winget install --id Microsoft.VisualStudio.2022.BuildTools
```

### Using Chocolatey (if installed)
```powershell
# Run as Administrator
choco install rust-msvc
choco install visualstudio2022buildtools --package-parameters "--add Microsoft.VisualStudio.Workload.VCTools --includeRecommended"
```

---

## Troubleshooting

### "rustc not found" after installation
- Close **all** terminals and IDE windows
- Open a fresh terminal
- Run `rustc --version`

### "MSVC not found" after installation
- Ensure you selected "Desktop development with C++"
- Restart computer
- Re-run installer if needed

### Download too slow
- Rust installer: ~400MB (use VPN if slow)
- VS Build Tools: ~6-8GB (pause/resume supported)

---

## What's Next?

Once both are installed:

```bash
# Start Django backend (Terminal 1)
cd /c/Users/info/Desktop/UCC/Projects/PIMS/optometry_clinic
source venv/Scripts/activate
python manage.py runserver

# Start Desktop App (Terminal 2)
cd /c/Users/info/Desktop/UCC/Projects/PIMS/pims_ui
npm run tauri:dev
```

This will:
1. Build Rust backend (first time: 5-10 minutes)
2. Start React dev server
3. Open desktop window with your app

---

## Installation Time Estimates

- **Rust:** 5-10 minutes
- **VS Build Tools:** 15-30 minutes
- **First Tauri Build:** 5-10 minutes (subsequent builds: 10-30 seconds)

**Total Setup Time:** ~30-50 minutes

---

## Skip Installation (Alternative)

If you don't want to install these now, you can continue developing the web version:

```bash
npm start  # Regular React web app
```

The desktop build can be done later on a different machine or CI/CD pipeline.
