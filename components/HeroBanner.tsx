// components/Header.tsx
import React from "react";

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-background-light/80 px-6 py-3 backdrop-blur-sm dark:border-gray-800 dark:bg-background-dark/80">
      {/* Search Bar */}
      <div className="relative w-full max-w-xs">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <svg
            className="text-gray-400 dark:text-gray-500"
            fill="currentColor"
            height="20"
            viewBox="0 0 256 256"
            width="20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
          </svg>
        </div>
        <input
          className="w-full rounded-lg border-0 bg-gray-200/70 py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary/50 dark:bg-gray-800/70 dark:text-white dark:placeholder-gray-400"
          placeholder="Search"
          type="text"
        />
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-4">
        <button className="rounded-full p-2 text-gray-500 hover:bg-gray-200/50 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-300">
          <svg
            fill="currentColor"
            height="24"
            viewBox="0 0 256 256"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z"></path>
          </svg>
        </button>
        <div
          className="h-10 w-10 rounded-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDgGQDJM4qPbg0fAFW6yAx7dX95DuetHpC0Mxr5oALb77hwsMt3em0I_d-EEqc2ni1bCTxHXxQlKJ7Va8cyn-xVvQVzf0rOTdtwwDJhVXYNItby6hK-DYrGSoNIR5PCKoT6evgeS760Zr-e3Ua_5L57IayHxAZkkwA9DzrLeY97d6TSresNDzgrtCBJVxVB21tldSX9jjxRfe_G62qI56fgDFuBd8zCcC1u5Zw8TnTPJI10SzbDYgcpIZenil2IExoAhkhObUrbqF3O")',
          }}
        ></div>
      </div>
    </header>
  );
};

export default Header;
