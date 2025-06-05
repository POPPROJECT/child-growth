import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ระบบบันทึกการเจริญเติบโตของเด็ก',
  description: 'แอปสำหรับติดตามการเติบโตของเด็ก',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className="font-sarabun text-sm text-gray-800 bg-[#f8fdf8]">
        {children}
      </body>
    </html>
  );
}
