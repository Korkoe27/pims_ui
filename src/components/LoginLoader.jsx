import React from "react";

const LoginLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#f9fafb]">
      <h1 className="text-3xl font-extrabold text-blue-600 mb-6 tracking-wide">
        Logging In... Please Wait...
      </h1>
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 border-4 border-blue-500 rounded-full animate-spin-hourglass"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-blue-300 to-blue-600 rounded-full"></div>
        <div className="absolute inset-0 bg-[#f9fafb] m-3 rounded-full"></div>
      </div>
      <p className="mt-8 text-lg text-blue-700 font-semibold">
        We're almost there!
      </p>
      <style jsx>{`
        .animate-spin-hourglass {
          animation: spin-hourglass 1.5s linear infinite;
        }
        @keyframes spin-hourglass {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default LoginLoader;
