import React from "react";

const PageContainer = ({ children }) => {
  return (
    <div className="px-8 pt-20 pb-8 bg-[#f9fafb] w-full min-h-full">
      {children}
    </div>
  );
};

export default PageContainer;
