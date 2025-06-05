'use client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/main/dashboard');
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-lime-100 to-yellow-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border-2 border-green-500 p-0 overflow-hidden">
        <div className="relative bg-gradient-to-br from-green-600 to-lime-500 p-6 text-white text-center">
          <h1 className="text-xl sm:text-2xl font-bold relative z-10">
            ระบบบันทึกการเจริญเติบโตของเด็ก
          </h1>
        </div>
        <div className="p-6 bg-white bg-opacity-90">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-green-900 font-semibold mb-1">
                ชื่อผู้ใช้
              </label>
              <input
                type="text"
                placeholder="กรอกชื่อผู้ใช้"
                className="w-full border-2 border-gray-300 rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-green-900 font-semibold mb-1">
                รหัสผ่าน
              </label>
              <input
                type="password"
                placeholder="กรอกรหัสผ่าน"
                className="w-full border-2 border-gray-300 rounded-lg p-2"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-gradient-to-r from-green-500 via-lime-400 to-yellow-300 text-white font-bold shadow-md hover:brightness-105 transition"
            >
              เข้าสู่ระบบ
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
