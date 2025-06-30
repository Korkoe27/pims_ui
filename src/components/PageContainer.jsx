import React from "react";

const PageContainer = ({ children }) => {
  return (
    <div className="px-8 ml-72 flex flex-col mt-24 gap-8 bg-[#f9fafb] w-full min-h-screen overflow-x-auto overflow-y-auto">
      {children}
    </div>
  );
};

export default PageContainer;