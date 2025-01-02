import React from "react";

const Footer = () => {
  return (
    <footer className="footer w-full bg-white text-center py-4 shadow-inner fixed bottom-0 left-0 z-10">
      <p className="text-sm text-gray-500">
        &copy; {new Date().getFullYear()} All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
