import React, { useState, useEffect } from 'react';
import { FaCog, FaDesktop, FaGlobe, FaCheckCircle, FaTimes } from 'react-icons/fa';
import { getDesktopEnvironmentInfo, testDesktopFeatures } from '../utils/desktopUtils';

const DesktopTest = () => {
  const [envInfo, setEnvInfo] = useState(null);
  const [testResults, setTestResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const info = getDesktopEnvironmentInfo();
    setEnvInfo(info);
  }, []);

  const runTests = async () => {
    setIsLoading(true);
    try {
      const results = await testDesktopFeatures();
      setTestResults(results);
    } catch (error) {
      console.error('Test failed:', error);
      setTestResults({
        success: false,
        error: error.message,
        tests: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
          <FaCog className="text-blue-500" />
          Desktop Environment Test
        </h2>

        {/* Environment Info */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Environment Information</h3>
          {envInfo && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  {envInfo.isDesktop ? (
                    <FaDesktop className="text-blue-500" />
                  ) : (
                    <FaGlobe className="text-orange-500" />
                  )}
                  <span className="font-medium">Platform:</span>
                  <span className={envInfo.isDesktop ? 'text-blue-600' : 'text-orange-600'}>
                    {envInfo.platform}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-medium">Desktop Mode:</span>
                  {envInfo.isDesktop ? (
                    <span className="text-green-600 flex items-center gap-1">
                      <FaCheckCircle />
                      Enabled
                    </span>
                  ) : (
                    <span className="text-gray-600 flex items-center gap-1">
                      <FaTimes />
                      Web Mode
                    </span>
                  )}
                </div>

                {envInfo.isDesktop && (
                  <>
                    <div>
                      <span className="font-medium">Tauri Version:</span>
                      <span className="ml-2 text-gray-600">{envInfo.tauriVersion}</span>
                    </div>

                    <div>
                      <span className="font-medium">File System:</span>
                      <span className={`ml-2 ${envInfo.hasFileSystem ? 'text-green-600' : 'text-red-600'}`}>
                        {envInfo.hasFileSystem ? 'Available' : 'Not Available'}
                      </span>
                    </div>

                    <div>
                      <span className="font-medium">Dialog API:</span>
                      <span className={`ml-2 ${envInfo.hasDialog ? 'text-green-600' : 'text-red-600'}`}>
                        {envInfo.hasDialog ? 'Available' : 'Not Available'}
                      </span>
                    </div>

                    <div>
                      <span className="font-medium">Notifications:</span>
                      <span className={`ml-2 ${envInfo.hasNotification ? 'text-green-600' : 'text-red-600'}`}>
                        {envInfo.hasNotification ? 'Available' : 'Not Available'}
                      </span>
                    </div>
                  </>
                )}

                {!envInfo.isDesktop && (
                  <div>
                    <span className="font-medium">User Agent:</span>
                    <span className="ml-2 text-gray-600 text-sm">{envInfo.userAgent}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Test Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Functionality Tests</h3>
          <button
            onClick={runTests}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Running Tests...
              </>
            ) : (
              'Run Desktop Tests'
            )}
          </button>

          {testResults && (
            <div className="mt-4 bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="font-medium">Test Results:</span>
                {testResults.success ? (
                  <span className="text-green-600 flex items-center gap-1">
                    <FaCheckCircle />
                    Passed
                  </span>
                ) : (
                  <span className="text-red-600 flex items-center gap-1">
                    <FaTimes />
                    Failed
                  </span>
                )}
              </div>

              {testResults.error && (
                <div className="text-red-600 text-sm mb-3">
                  Error: {testResults.error}
                </div>
              )}

              {testResults.tests && testResults.tests.length > 0 && (
                <div className="space-y-2">
                  {testResults.tests.map((test, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm">
                      {test.success ? (
                        <FaCheckCircle className="text-green-500" />
                      ) : (
                        <FaTimes className="text-red-500" />
                      )}
                      <span className="font-medium">{test.name}:</span>
                      <span className="text-gray-600">{test.result}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">Testing Instructions:</h4>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• If running in web mode, download the desktop app to access advanced features</li>
            <li>• Desktop mode provides file system access, system dialogs, and notifications</li>
            <li>• Run tests to verify all desktop APIs are working correctly</li>
            <li>• Desktop settings will be available only in desktop mode</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DesktopTest;