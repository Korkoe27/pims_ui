import React from "react";

const PageContainer = ({ children }) => {
  return (
    <div className="px-8 pt-20 bg-[#f9fafb] w-full min-h-screen">
      {children}
    </div>
  );
};

export default PageContainer;
