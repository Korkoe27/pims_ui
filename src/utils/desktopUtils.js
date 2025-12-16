/**
 * Desktop utilities for Tauri environment detection and testing
 */

export const isDesktopApp = () => {
  return typeof window !== 'undefined' && window.__TAURI__ !== undefined;
};

export const getDesktopEnvironmentInfo = () => {
  if (!isDesktopApp()) {
    return {
      isDesktop: false,
      platform: 'web',
      userAgent: navigator.userAgent
    };
  }

  return {
    isDesktop: true,
    platform: 'desktop',
    tauriVersion: window.__TAURI__?.version || 'unknown',
    hasFileSystem: window.__TAURI__?.fs !== undefined,
    hasDialog: window.__TAURI__?.dialog !== undefined,
    hasNotification: window.__TAURI__?.notification !== undefined
  };
};

export const testDesktopFeatures = async () => {
  const info = getDesktopEnvironmentInfo();
  
  if (!info.isDesktop) {
    return {
      success: false,
      message: 'Not running in desktop mode',
      info
    };
  }

  const tests = [];

  // Test basic Tauri API availability
  tests.push({
    name: 'Tauri API',
    success: window.__TAURI__ !== undefined,
    result: window.__TAURI__ ? 'Available' : 'Not available'
  });

  // Test localStorage (should work in both environments)
  try {
    localStorage.setItem('test_key', 'test_value');
    const value = localStorage.getItem('test_key');
    localStorage.removeItem('test_key');
    tests.push({
      name: 'Local Storage',
      success: value === 'test_value',
      result: 'Working'
    });
  } catch (error) {
    tests.push({
      name: 'Local Storage',
      success: false,
      result: `Error: ${error.message}`
    });
  }

  return {
    success: tests.every(test => test.success),
    info,
    tests
  };
};

export const mockDesktopFeatures = () => {
  if (typeof window !== 'undefined' && !window.__TAURI__) {
    // Mock Tauri API for development/testing
    window.__TAURI__ = {
      version: 'mock-1.0.0',
      fs: {
        readTextFile: async (path) => {
          console.log('Mock fs.readTextFile called with:', path);
          return JSON.stringify({ mock: 'data' });
        },
        writeTextFile: async (path, data) => {
          console.log('Mock fs.writeTextFile called with:', path, data);
          return true;
        }
      },
      dialog: {
        open: async (options) => {
          console.log('Mock dialog.open called with:', options);
          return '/mock/file/path.json';
        },
        save: async (options) => {
          console.log('Mock dialog.save called with:', options);
          return '/mock/save/path.json';
        }
      }
    };
    
    console.log('🔧 Tauri API mocked for development');
  }
};

export default {
  isDesktopApp,
  getDesktopEnvironmentInfo,
  testDesktopFeatures,
  mockDesktopFeatures
};