'use client'; // เพราะใช้ component แบบ client เช่น Navbar, Sidebar

import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#f8fdf8] font-sarabun text-sm text-gray-800 min-h-screen">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
