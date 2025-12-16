import React, { useState, useMemo } from "react";
import { FaCog, FaDatabase, FaServer, FaSync, FaCloudUploadAlt } from "react-icons/fa";

const DesktopSettings = () => {
  const [status, setStatus] = useState({ type: "", message: "" });

  const ACTIONS = useMemo(() => (
    [
      {
        key: "backup",
        label: "Backup Data",
        description: "Export the local database snapshot for safe keeping.",
        icon: <FaDatabase className="text-xl" />,
      },
      {
        key: "remote",
        label: "Add Remote Database",
        description: "Configure a remote PostgreSQL or MySQL endpoint.",
        icon: <FaServer className="text-xl" />,
      },
      {
        key: "update",
        label: "Update Software",
        description: "Check for new desktop releases and install updates.",
        icon: <FaCloudUploadAlt className="text-xl" />,
      },
      {
        key: "sync",
        label: "Sync Data",
        description: "Push and pull records between local and cloud stores.",
        icon: <FaSync className="text-xl" />,
      },
    ]
  ), []);

  const STATUS_STYLES = {
    info: "bg-blue-50 border border-blue-200 text-blue-700",
    success: "bg-emerald-50 border border-emerald-200 text-emerald-700",
    warning: "bg-amber-50 border border-amber-200 text-amber-700",
    error: "bg-red-50 border border-red-200 text-red-700",
  };

  const handleAction = (action) => {
    setStatus({ type: "info", message: `${action.label} coming soon.` });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <FaCog className="text-blue-500 text-2xl" />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Desktop Settings</h2>
          <p className="text-gray-600 text-sm">Supervisor tools for managing the desktop client.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ACTIONS.map((action) => (
          <button
            key={action.key}
            type="button"
            onClick={() => handleAction(action)}
            className="flex flex-col items-start gap-2 p-5 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow focus:ring-2 focus:ring-blue-200 transition-shadow text-left"
          >
            <div className="flex items-center gap-3 text-gray-800">
              <span className="p-3 bg-blue-50 rounded-full text-blue-600">
                {action.icon}
              </span>
              <span className="font-semibold text-lg">{action.label}</span>
            </div>
            <p className="text-sm text-gray-600 leading-snug">{action.description}</p>
          </button>
        ))}
      </div>

      {status.message && (
        <div className={`${STATUS_STYLES[status.type] || "bg-gray-50 border border-gray-200 text-gray-700"} text-sm rounded-lg px-4 py-3`}>
          {status.message}
        </div>
      )}
    </div>
  );
};

export default DesktopSettings;