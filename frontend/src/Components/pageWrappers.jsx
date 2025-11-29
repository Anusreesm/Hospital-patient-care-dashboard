import React from "react";
import { useTheme } from "../Context/ThemeContext";


const PageWrapper = ({ children, className = "" }) => {
  const { theme } = useTheme();

  return (
    <div
      className={`h-auto min-h-fit
 w-full transition-colors duration-300
                  bg-gray-50 dark:bg-gray-900
                  text-black dark:text-white
                  ${className}`}
    >
      {children}
    </div>
  );
};

export default PageWrapper;
