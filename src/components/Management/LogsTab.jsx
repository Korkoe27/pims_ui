import React, { useState } from "react";

const LogsTab = ({ appointmentId, setActiveTab, role }) => {
  const [logEntry, setLogEntry] = useState("");
  const [logs, setLogs] = useState([]);

  const handleAddLog = () => {
    if (logEntry.trim()) {
      const newLog = {
        id: Date.now(),
        entry: logEntry,
        timestamp: new Date().toLocaleString(),
        user: role || "User",
      };
      setLogs([...logs, newLog]);
      setLogEntry("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddLog();
    }
  };

  return (
    <div className="rounded-md border bg-white p-6 w-full max-w-4xl">
      <h3 className="text-lg font-semibold mb-4">Consultation Logs</h3>

      {/* Existing Logs Display */}
      <div className="mb-6">
        <h4 className="text-md font-medium mb-3">Log History</h4>
        {logs.length > 0 ? (
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {logs.map((log) => (
              <div
                key={log.id}
                className="bg-gray-50 p-3 rounded-md border-l-4 border-blue-400"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    {log.user}
                  </span>
                  <span className="text-xs text-gray-500">{log.timestamp}</span>
                </div>
                <p className="text-sm text-gray-800">{log.entry}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm italic">No logs recorded yet.</p>
        )}
      </div>

      {/* Add New Log Entry */}
      <div className="border-t pt-4">
        <h4 className="text-md font-medium mb-3">Add Log Entry</h4>
        <div className="space-y-3">
          <textarea
            className="w-full border border-gray-300 rounded-md p-3 resize-vertical min-h-[100px]"
            value={logEntry}
            onChange={(e) => setLogEntry(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter log entry... (Press Enter to save, Shift+Enter for new line)"
            rows={4}
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleAddLog}
              disabled={!logEntry.trim()}
              className="px-4 py-2 rounded-md bg-[#2f3192] text-white disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Add Log Entry
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("management")}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Back to Management
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="mt-6 pt-4 border-t">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">
            Logs help track consultation progress and decisions
          </span>
          <div className="flex gap-2">
            {role === "student" && (
              <button
                type="button"
                onClick={() => setActiveTab("submit")}
                className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
              >
                Next: Submit →
              </button>
            )}
            {role !== "student" && (
              <button
                type="button"
                onClick={() => setActiveTab("complete")}
                className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
              >
                Next: Complete →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogsTab;
