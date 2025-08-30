export function Logo({ className }: { className?: string }) {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient
          id="logo-gradient"
          x1="12.392"
          y1="2.905"
          x2="12.392"
          y2="21.095"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#4A45E5" />
          <stop offset="1" stopColor="#8481F4" />
        </linearGradient>
      </defs>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.254 12.001L19.23 19.34c.69.83.17 2.06-.92 2.06H16.2c-.39 0-.77-.16-.97-.47L9.92 13.68l-3.34 5.2c-.2.31-.58.47-.97.47H3.5c-1.09 0-1.61-1.23-.92-2.06L9.531 12 2.58 4.12c-.69-.83-.17-2.06.92-2.06h2.11c.39 0 .77.16.97.47l4.31 6.72 4.31-6.72c.2-.31.58-.47.97-.47h2.11c1.09 0 1.61 1.23.92 2.06l-6.951 7.881z"
        fill="url(#logo-gradient)"
      />
    </svg>
  );
}
