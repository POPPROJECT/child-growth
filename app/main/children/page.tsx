'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AddChildModal from '@/components/children/AddChildModal';

type Child = {
  id: string;
  code: string;
  prefix: string;
  fullName: string;
};

export default function ChildrenPage() {
  const [children, setChildren] = useState<Child[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const fetchChildren = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/children`
    );
    const data = await res.json();
    setChildren(data);
  };

  useEffect(() => {
    fetchChildren();
  }, []);

  const filteredChildren = children.filter((child) =>
    `${child.prefix} ${child.fullName}`.includes(searchTerm)
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-green-800">รายชื่อเด็ก</h1>

      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="ค้นหาด้วยรายชื่อ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-4 py-2 rounded w-[300px]"
        />
        <button
          className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500"
          onClick={() => setShowModal(true)}
        >
          + เพิ่มข้อมูลเด็ก
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-200 text-sm">
              <th className="px-6 py-3 text-left">รหัสเด็ก</th>
              <th className="px-6 py-3 text-left">ชื่อ-นามสกุล</th>
              <th className="px-6 py-3 text-left">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {filteredChildren.map((child) => (
              <tr key={child.id} className="border-t hover:bg-green-50 text-sm">
                <td className="px-6 py-3">{child.code}</td>
                <td className="px-6 py-3">
                  {child.prefix} {child.fullName}
                </td>
                <td className="px-6 py-3">
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    onClick={() => router.push(`/main/children/${child.id}`)}
                  >
                    ข้อมูลส่วนบุคคล
                  </button>
                </td>
              </tr>
            ))}
            {filteredChildren.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center py-4 text-gray-500">
                  ไม่พบข้อมูลเด็กที่ตรงกับ "{searchTerm}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Modal สำหรับเพิ่มข้อมูล */}
      {showModal && (
        <AddChildModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchChildren();
          }}
        />
      )}
    </div>
  );
}
