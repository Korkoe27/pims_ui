import React from "react";

const BouncingBallsLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="flex gap-2 mb-4">
        <div className="w-4 h-4 rounded-full bg-red-500 animate-bounce delay-0" />
        <div className="w-4 h-4 rounded-full bg-yellow-500 animate-bounce delay-150" />
        <div className="w-4 h-4 rounded-full bg-blue-500 animate-bounce delay-300" />
      </div>
      <p className="text-gray-600 text-sm font-medium">Please wait...</p>
    </div>
  );
};

export default BouncingBallsLoader;
