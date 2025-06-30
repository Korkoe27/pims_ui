import React from "react";

const PageContainer = ({ children }) => {
  return (
    <div className="px-8 ml-72 flex flex-col mt-8 gap-8 bg-[#f9fafb] w-full min-h-screen">
      {children}
    </div>
  );
};

export default PageContainer;
