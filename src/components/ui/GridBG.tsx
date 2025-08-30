import React from "react";

export const GridBG = () => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none select-none z-0"
    aria-hidden="true"
    focusable="false"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ opacity: 0.07 }}
  >
    <defs>
      <pattern id="grid" width="90" height="90" patternUnits="userSpaceOnUse">
        <path d="M 90 0 L 0 0 0 90" fill="none" stroke="currentColor" strokeWidth="1" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)" />
  </svg>
);
