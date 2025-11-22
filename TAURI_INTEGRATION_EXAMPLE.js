// Example: Enhanced App.js to detect Tauri and add desktop features

import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';

// Tauri imports (only work in desktop mode)
let tauriNotification;
let tauriWindow;

if (window.__TAURI__) {
  import('@tauri-apps/api/notification').then(module => {
    tauriNotification = module;
  });
  import('@tauri-apps/api/window').then(module => {
    tauriWindow = module;
  });
}

function App() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Detect if running in Tauri
    setIsDesktop(window.__TAURI__ !== undefined);
    
    if (window.__TAURI__) {
      console.log('🖥️ Running as Desktop App');
       
      // Optional: Set window title dynamically
      if (tauriWindow?.appWindow) {
        tauriWindow.appWindow.setTitle('UCC Optometry Clinic - Dashboard');
      }
    } else {
      console.log('🌐 Running in Browser');
    }
  }, []);

  // Desktop notification helper
  const sendDesktopNotification = async (title, body) => {
    if (isDesktop && tauriNotification) {
      try {
        let permissionGranted = await tauriNotification.isPermissionGranted();
        if (!permissionGranted) {
          const permission = await tauriNotification.requestPermission();
          permissionGranted = permission === 'granted';
        }
        if (permissionGranted) {
          await tauriNotification.sendNotification({ title, body });
        }
      } catch (error) {
        console.error('Notification error:', error);
      }
    }
  };

  return (
    <BrowserRouter>
      <div className="App">
        {/* Your existing app structure */}
        {isDesktop && (
          <div className="desktop-indicator" style={{
            position: 'fixed',
            bottom: 10,
            right: 10,
            padding: '5px 10px',
            background: '#4CAF50',
            color: 'white',
            borderRadius: 5,
            fontSize: 12,
            zIndex: 9999
          }}>
            🖥️ Desktop Mode
          </div>
        )}
        {/* Rest of your app */}
      </div>
    </BrowserRouter>
  );
}

export default App;
