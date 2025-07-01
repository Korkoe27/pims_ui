// src/components/ui/tabs.jsx
import React, { useState } from "react";

export const Tabs = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <div className="flex space-x-4 border-b">
        {React.Children.map(children, (child, index) => (
          <button
            className={`py-2 px-4 ${activeTab === index ? 'border-b-2 border-blue-500 font-bold' : ''}`}
            onClick={() => setActiveTab(index)}
          >
            {child.props.title}
          </button>
        ))}
      </div>
      <div className="mt-4">{children[activeTab]}</div>
    </div>
  );
};

export const Tab = ({ children }) => <div>{children}</div>;
