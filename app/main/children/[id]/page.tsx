'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function ChildProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [child, setChild] = useState<any>(null);
  const [form, setForm] = useState<any>({});
  const [editing, setEditing] = useState(false);

  const years = Array.from({ length: 7 }, (_, i) => `${i + 1} ปี`);

  const weightData = years.map((y) => {
    const entry = form?.growthChart?.find((g: any) => `${g.age} ปี` === y);
    return entry?.weight ?? null;
  });

  const heightData = years.map((y) => {
    const entry = form?.growthChart?.find((g: any) => `${g.age} ปี` === y);
    return entry?.height ?? null;
  });

  useEffect(() => {
    const fetchChild = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/children/${id}`
      );
      const data = await res.json();
      setChild(data);
      setForm(data); // initial form
    };
    if (id) fetchChild();
  }, [id]);

  const handleChange = (section: string, field: string, value: string) => {
    if (
      [
        'code',
        'prefix',
        'fullName',
        'personalId',
        'religion',
        'bloodType',
        'birthDate',
        'phone',
        'nationality',
        'ethnicity',
      ].includes(field)
    ) {
      setForm((prev: any) => ({ ...prev, [field]: value || '-' }));
    } else {
      setForm((prev: any) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value || '-',
        },
      }));
    }
  };

  const handleSave = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/children/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      alert('บันทึกข้อมูลสำเร็จ');
      setEditing(false);
      router.refresh();
    } catch (err) {
      console.error('เกิดข้อผิดพลาด:', err);
    }
  };

  if (!child) return <p className="p-6">กำลังโหลดข้อมูล...</p>;

  const renderField = (label: string, section: string, field: string) => (
    <div>
      <strong>{label}:</strong>{' '}
      {editing ? (
        <input
          className="border p-1 rounded w-full"
          value={form?.[section]?.[field] ?? ''}
          onChange={(e) => handleChange(section, field, e.target.value)}
        />
      ) : (
        form?.[section]?.[field] ?? '-'
      )}
    </div>
  );

  const renderRootField = (label: string, field: string) => {
    if (editing) {
      // field พิเศษ: prefix → select พร้อม map gender
      if (field === 'prefix') {
        return (
          <div>
            <strong>{label}:</strong>{' '}
            <select
              className="border p-1 rounded w-full"
              value={form?.prefix ?? ''}
              onChange={(e) => {
                const prefix = e.target.value;
                const gender =
                  prefix === 'เด็กชาย'
                    ? 'MALE'
                    : prefix === 'เด็กหญิง'
                    ? 'FEMALE'
                    : '';
                setForm((prev: any) => ({ ...prev, prefix, gender }));
              }}
            >
              <option value="">เลือกคำนำหน้า</option>
              <option value="เด็กชาย">เด็กชาย</option>
              <option value="เด็กหญิง">เด็กหญิง</option>
            </select>
          </div>
        );
      }

      // field พิเศษ: birthDate → date input
      if (field === 'birthDate') {
        return (
          <div>
            <strong>{label}:</strong>{' '}
            <input
              type="date"
              className="border p-1 rounded w-full"
              value={form?.birthDate ?? ''}
              onChange={(e) => handleChange('', field, e.target.value)}
            />
          </div>
        );
      }

      // field อื่นทั่วไป
      return (
        <div>
          <strong>{label}:</strong>{' '}
          <input
            className="border p-1 rounded w-full"
            value={form?.[field] ?? ''}
            onChange={(e) => handleChange('', field, e.target.value)}
          />
        </div>
      );
    }

    return (
      <div>
        <strong>{label}:</strong> {form?.[field] ?? '-'}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-green-700">ข้อมูลส่วนบุคคล</h1>
        <div className="space-x-2">
          <button
            onClick={() => setEditing((prev) => !prev)}
            className={`px-4 py-2 rounded text-white ${
              editing ? 'bg-gray-500' : 'bg-blue-600'
            } hover:opacity-90`}
          >
            {editing ? 'ยกเลิก' : 'แก้ไข'}
          </button>
          {editing && (
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white rounded hover:opacity-90"
            >
              บันทึก
            </button>
          )}
        </div>
      </div>

      {/* ข้อมูลทั่วไป */}
      <section>
        <h2 className="text-green-700 font-semibold mb-2">ข้อมูลทั่วไป</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          {renderRootField('รหัสประจำตัว', 'code')}
          {renderRootField('คำนำหน้า', 'prefix')}
          {renderRootField('ชื่อ-นามสกุล', 'fullName')}
          {renderRootField('เลขประจำตัวประชาชน', 'personalId')}
          {renderRootField('วันเดือนปีเกิด', 'birthDate')}
          {renderRootField('ศาสนา', 'religion')}
          {renderRootField('หมู่โลหิต', 'bloodType')}
          {renderRootField('สัญชาติ', 'nationality')}
          {renderRootField('เชื้อชาติ', 'ethnicity')}
        </div>
      </section>

      {/* ที่อยู่ปัจจุบัน */}
      <section>
        <h2 className="text-green-700 font-semibold mb-2">ที่อยู่ปัจจุบัน</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          {renderField('บ้านเลขที่', 'currentAddress', 'houseNo')}
          {renderField('หมู่', 'currentAddress', 'moo')}
          {renderField('ถนน', 'currentAddress', 'road')}
          {renderField('ซอย', 'currentAddress', 'alley')}
          {renderField('ตำบล/แขวง', 'currentAddress', 'subDistrict')}
          {renderField('อำเภอ/เขต', 'currentAddress', 'district')}
          {renderField('จังหวัด', 'currentAddress', 'province')}
          {renderField('รหัสไปรษณีย์', 'currentAddress', 'postalCode')}
          {renderRootField('เบอร์โทรศัพท์', 'phone')}
        </div>
      </section>

      {/* ที่อยู่ตามทะเบียนบ้าน */}
      <section>
        <h2 className="text-green-700 font-semibold mb-2">
          ที่อยู่ตามทะเบียนบ้าน
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          {renderField('บ้านเลขที่', 'permanentAddress', 'houseNo')}
          {renderField('หมู่', 'permanentAddress', 'moo')}
          {renderField('ถนน', 'permanentAddress', 'road')}
          {renderField('ซอย', 'permanentAddress', 'alley')}
          {renderField('ตำบล/แขวง', 'permanentAddress', 'subDistrict')}
          {renderField('อำเภอ/เขต', 'permanentAddress', 'district')}
          {renderField('จังหวัด', 'permanentAddress', 'province')}
          {renderField('รหัสไปรษณีย์', 'permanentAddress', 'postalCode')}
        </div>
      </section>

      {/* ผู้ปกครอง */}
      <section>
        <h2 className="text-green-700 font-semibold mb-2">ข้อมูลผู้ปกครอง</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="font-semibold">บิดา</h3>
            {renderField('ชื่อ', 'father', 'fullName')}
            {renderField('อายุ', 'father', 'age')}
            {renderField('อาชีพ', 'father', 'job')}
            {renderField('โทรศัพท์', 'father', 'phone')}
            {renderField('รายได้ต่อปี', 'father', 'income')}
          </div>
          <div>
            <h3 className="font-semibold">มารดา</h3>
            {renderField('ชื่อ', 'mother', 'fullName')}
            {renderField('อายุ', 'mother', 'age')}
            {renderField('อาชีพ', 'mother', 'job')}
            {renderField('โทรศัพท์', 'mother', 'phone')}
            {renderField('รายได้ต่อปี', 'mother', 'income')}
          </div>
        </div>
      </section>

      {/* ผู้ปกครองกรณีพิเศษ */}
      <section>
        <h2 className="text-green-700 font-semibold mb-2">
          ผู้ปกครอง (กรณีไม่ใช่บิดา/มารดา)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          {renderField('ชื่อ', 'guardian', 'fullName')}
          {renderField('อายุ', 'guardian', 'age')}
          {renderField('อาชีพ', 'guardian', 'job')}
          {renderField('โทรศัพท์', 'guardian', 'phone')}
          {renderField('รายได้ต่อปี', 'guardian', 'income')}
          {renderField('ความเกี่ยวข้อง', 'guardian', 'relation')}
        </div>
      </section>

      {/* กราฟ */}
      <section>
        <h2 className="text-green-700 font-semibold mb-2">
          กราฟการเจริญเติบโต
        </h2>
        <div className="bg-white p-4 rounded border w-full h-[350px] relative">
          <Line
            data={{
              labels: years,
              datasets: [
                {
                  label: 'น้ำหนัก (กก.)',
                  data: weightData,
                  borderColor: '#4CAF50',
                  backgroundColor: 'rgba(76, 175, 80, 0.1)',
                  tension: 0.4,
                  fill: true,
                },
                {
                  label: 'ส่วนสูง (ซม.)',
                  data: heightData,
                  borderColor: '#FF9800',
                  backgroundColor: 'rgba(255, 152, 0, 0.1)',
                  tension: 0.4,
                  fill: true,
                  yAxisID: 'y1',
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: false,
                  title: { display: true, text: 'น้ำหนัก (กก.)' },
                },
                y1: {
                  beginAtZero: false,
                  position: 'right',
                  grid: { drawOnChartArea: false },
                  title: { display: true, text: 'ส่วนสูง (ซม.)' },
                },
              },
              plugins: {
                legend: { position: 'bottom' },
              },
            }}
          />
        </div>
      </section>
    </div>
  );
}
