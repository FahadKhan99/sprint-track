import React from "react";

const Footer = () => {
  return (
    <footer className="dotted-backgound text-gray-400 py-8 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between sm:flex-row">
          <p className="text-sm font-medium text-gray-500">
            © {new Date().getFullYear()} Fahad. All rights reserved.
          </p>

          <div className="mt-4 sm:mt-0 flex space-x-6">
            {/* Optional social icons or links */}
            <a href="#" className="hover:text-white hover:underline transition">
              Twitter
            </a>
            <a href="#" className="hover:text-white hover:underline transition">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
