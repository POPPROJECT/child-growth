'use client';

import { useEffect, useState } from 'react';

export default function GrowthPage() {
  const [children, setChildren] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [currentPageGrowth, setCurrentPageGrowth] = useState(1); // สำหรับ growth form
  const [currentPageHistory, setCurrentPageHistory] = useState(1); // สำหรับ history
  const pageSize = 10;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ปกติ':
        return 'bg-green-100 text-green-700';
      case 'น้ำหนักน้อย':
        return 'bg-blue-100 text-blue-700';
      case 'น้ำหนักเกิน':
        return 'bg-yellow-100 text-yellow-700';
      case 'อ้วน':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = () => {
    const d = new Date();
    return d.toLocaleDateString('en-GB');
  };

  const getBMIStatus = (weight: number, height: number) => {
    const h = height / 100;
    const bmi = weight / (h * h);
    let status = '';
    if (bmi < 18.5) status = 'น้ำหนักน้อย';
    else if (bmi < 25) status = 'ปกติ';
    else if (bmi < 30) status = 'น้ำหนักเกิน';
    else status = 'อ้วน';
    return { bmi: bmi.toFixed(1), status };
  };

  const filtered = children.filter((c) =>
    `${c.prefix} ${c.fullName}`.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedGrowth = filtered.slice(
    (currentPageGrowth - 1) * pageSize,
    currentPageGrowth * pageSize
  );

  const flatHistory = children.flatMap((child) =>
    child.growthChart.map((entry: any, i: number) => {
      const { bmi, status } = getBMIStatus(entry.weight, entry.height);
      return {
        date: formatDate(),
        code: child.code,
        name: `${child.prefix} ${child.fullName}`,
        age: entry.age ?? i + 1,
        weight: entry.weight,
        height: entry.height,
        bmi,
        status,
      };
    })
  );

  const paginatedHistory = flatHistory.slice(
    (currentPageHistory - 1) * pageSize,
    currentPageHistory * pageSize
  );

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/growth`
      );
      const data = await res.json();
      const withDraft = data.map((child: any) => ({
        ...child,
        draft: { weight: '', height: '' },
      }));
      setChildren(withDraft);
    };
    fetchData();
  }, []);

  const updateDraft = (
    id: string,
    field: 'weight' | 'height',
    value: string
  ) => {
    setChildren((prev) =>
      prev.map((child) =>
        child.id === id
          ? { ...child, draft: { ...child.draft, [field]: value } }
          : child
      )
    );
  };

  const saveGrowth = async (id: string) => {
    const child = children.find((c) => c.id === id);
    const { weight, height } = child.draft;

    if (!weight || !height) return alert('กรุณากรอกข้อมูลให้ครบ');

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/growth/${id}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weight, height }),
      }
    );

    if (!res.ok) return alert('บันทึกไม่สำเร็จ');

    const updated = await res.json();

    setChildren((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              growthChart: [...c.growthChart, updated],
              draft: { weight: '', height: '' },
            }
          : c
      )
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-green-800 mb-4">
        บันทึกการเจริญเติบโต (อายุ 1-7 ปี)
      </h1>

      <div className="mb-4 flex items-center justify-between">
        <input
          type="text"
          className="border px-4 py-2 rounded w-80"
          placeholder="ค้นหาด้วยชื่อเด็ก..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="w-full border text-sm mb-2">
        <thead className="bg-green-600 text-white">
          <tr>
            <th className="border px-4 py-2">รหัสเด็ก</th>
            <th className="border px-4 py-2">ชื่อ</th>
            <th className="border px-4 py-2">น้ำหนัก (กก.)</th>
            <th className="border px-4 py-2">ส่วนสูง (ซม.)</th>
            <th className="border px-4 py-2">BMI</th>
            <th className="border px-4 py-2">อายุ</th>
            <th className="border px-4 py-2">บันทึก</th>
          </tr>
        </thead>
        <tbody>
          {paginatedGrowth.map((child) => {
            const age = child.growthChart.length + 1;
            const { draft } = child;
            const show =
              draft.weight && draft.height
                ? getBMIStatus(Number(draft.weight), Number(draft.height))
                : null;
            return (
              <tr key={child.id} className="hover:bg-green-50">
                <td className="border px-4 py-2">{child.code}</td>
                <td className="border px-4 py-2">
                  {child.prefix} {child.fullName}
                </td>
                <td className="border px-4 py-2">
                  <input
                    type="number"
                    className="w-full border rounded px-2 py-1"
                    value={draft.weight}
                    onChange={(e) =>
                      updateDraft(child.id, 'weight', e.target.value)
                    }
                    disabled={age > 7}
                  />
                </td>
                <td className="border px-4 py-2">
                  <input
                    type="number"
                    className="w-full border rounded px-2 py-1"
                    value={draft.height}
                    onChange={(e) =>
                      updateDraft(child.id, 'height', e.target.value)
                    }
                    disabled={age > 7}
                  />
                </td>
                <td className="border px-4 py-2 text-center">
                  {show ? `${show.bmi} (${show.status})` : '-'}
                </td>
                <td className="border px-4 py-2 text-center">
                  {age <= 7 ? age : 'ครบ 7 ปีแล้ว'}
                </td>
                <td className="border px-4 py-2 text-center">
                  {age <= 7 ? (
                    <button
                      onClick={() => saveGrowth(child.id)}
                      className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500"
                    >
                      บันทึก
                    </button>
                  ) : (
                    <span className="text-red-500 text-xs">เกิน 7 ปี</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* ✅ Pagination (Growth) */}
      <div className="flex justify-between items-center text-sm mb-10">
        <p className="text-gray-600">
          แสดง{' '}
          {Math.min((currentPageGrowth - 1) * pageSize + 1, filtered.length)} -{' '}
          {Math.min(currentPageGrowth * pageSize, filtered.length)} จาก{' '}
          {filtered.length} รายการ
        </p>
        <div className="space-x-2">
          <button
            onClick={() => setCurrentPageGrowth((p) => Math.max(p - 1, 1))}
            disabled={currentPageGrowth === 1}
            className="px-3 py-1 rounded border bg-white hover:bg-gray-100 disabled:opacity-50"
          >
            ก่อนหน้า
          </button>
          <button
            onClick={() =>
              setCurrentPageGrowth((p) =>
                Math.min(p + 1, Math.ceil(filtered.length / pageSize))
              )
            }
            disabled={
              currentPageGrowth >= Math.ceil(filtered.length / pageSize)
            }
            className="px-3 py-1 rounded border bg-white hover:bg-gray-100 disabled:opacity-50"
          >
            ถัดไป
          </button>
        </div>
      </div>

      {/* ✅ ประวัติการบันทึก */}
      <h2 className="text-lg font-semibold mb-4 text-green-800">
        ประวัติการบันทึก
      </h2>
      <div className="overflow-x-auto bg-white rounded shadow mb-4">
        <table className="min-w-full text-sm border">
          <thead className="bg-green-100 text-green-800">
            <tr>
              <th className="px-4 py-2 border">วันที่</th>
              <th className="px-4 py-2 border">รหัส</th>
              <th className="px-4 py-2 border">ชื่อ-นามสกุล</th>
              <th className="px-4 py-2 border">อายุ</th>
              <th className="px-4 py-2 border">น้ำหนัก (กก.)</th>
              <th className="px-4 py-2 border">ส่วนสูง (ซม.)</th>
              <th className="px-4 py-2 border">BMI</th>
              <th className="px-4 py-2 border">สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {paginatedHistory.map((entry, i) => (
              <tr
                key={`${entry.code}-${i}`}
                className={`border-t text-center ${
                  i % 2 === 1 ? 'bg-yellow-50' : ''
                }`}
              >
                <td className="px-4 py-2 border">{entry.date}</td>
                <td className="px-4 py-2 border">{entry.code}</td>
                <td className="px-4 py-2 border">{entry.name}</td>
                <td className="px-4 py-2 border">{entry.age} ปี</td>
                <td className="px-4 py-2 border">{entry.weight}</td>
                <td className="px-4 py-2 border">{entry.height}</td>
                <td className="px-4 py-2 border">{entry.bmi}</td>
                <td className="px-4 py-2 border">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      entry.status
                    )}`}
                  >
                    {entry.status}
                  </span>
                </td>
              </tr>
            ))}
            {paginatedHistory.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-4 text-gray-500">
                  ยังไม่มีประวัติการบันทึก
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Pagination (History) */}
      <div className="flex justify-between items-center text-sm">
        <p className="text-gray-600">
          แสดง{' '}
          {Math.min(
            (currentPageHistory - 1) * pageSize + 1,
            flatHistory.length
          )}{' '}
          - {Math.min(currentPageHistory * pageSize, flatHistory.length)} จาก{' '}
          {flatHistory.length} รายการ
        </p>
        <div className="space-x-2">
          <button
            onClick={() => setCurrentPageHistory((p) => Math.max(p - 1, 1))}
            disabled={currentPageHistory === 1}
            className="px-3 py-1 rounded border bg-white hover:bg-gray-100 disabled:opacity-50"
          >
            ก่อนหน้า
          </button>
          <button
            onClick={() =>
              setCurrentPageHistory((p) =>
                Math.min(p + 1, Math.ceil(flatHistory.length / pageSize))
              )
            }
            disabled={
              currentPageHistory >= Math.ceil(flatHistory.length / pageSize)
            }
            className="px-3 py-1 rounded border bg-white hover:bg-gray-100 disabled:opacity-50"
          >
            ถัดไป
          </button>
        </div>
      </div>
    </div>
  );
}
