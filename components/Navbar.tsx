// components/Navbar.tsx
'use client';

export default function Navbar() {
  return (
    <nav className="navbar flex items-center justify-between p-4 text-white bg-gradient-to-r from-green-600 to-green-400">
      <div className="flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        <span className="text-xl font-bold">
          ระบบบันทึกการเจริญเติบโตของเด็ก
        </span>
      </div>
      <div className="flex items-center">
        <span className="mr-4">ยินดีต้อนรับ, คุณครู</span>
      </div>
    </nav>
  );
}
