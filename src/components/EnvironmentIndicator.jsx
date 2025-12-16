import React, { useEffect, useState } from 'react';

const EnvironmentIndicator = () => {
  const [environment, setEnvironment] = useState('checking...');
  const [tauriVersion, setTauriVersion] = useState(null);

  useEffect(() => {
    const checkEnvironment = async () => {
      if (typeof window !== 'undefined' && window.__TAURI__) {
        try {
          // Try to get Tauri version
          const { getName, getVersion } = await import('@tauri-apps/api/app');
          const appName = await getName();
          const appVersion = await getVersion();
          setEnvironment('🖥️ Tauri Desktop App');
          setTauriVersion(`${appName} v${appVersion}`);
        } catch (error) {
          setEnvironment('🖥️ Tauri Desktop (API Error)');
          console.error('Tauri API Error:', error);
        }
      } else {
        setEnvironment('🌐 Web Browser');
      }
    };

    checkEnvironment();
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 bg-black/80 text-white px-3 py-2 rounded-lg text-sm font-mono">
      <div className="flex flex-col gap-1">
        <div>Environment: {environment}</div>
        {tauriVersion && <div className="text-xs text-gray-300">App: {tauriVersion}</div>}
        <div className="text-xs text-gray-400">
          DevTools: {environment.includes('Desktop') ? 'Right-click → Inspect' : 'F12'}
        </div>
      </div>
    </div>
  );
};

export default EnvironmentIndicator;