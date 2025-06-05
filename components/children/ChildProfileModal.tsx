'use client';

import { ChildData } from '@/lib/type';
import { useEffect } from 'react';
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
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Props {
  child: ChildData | null;
  onClose: () => void;
}

export default function ChildProfileModal({ child, onClose }: Props) {
  if (!child) return null;

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Optional: Split fullName if necessary
  const [firstName = '', lastName = ''] = child.fullName.split(' ');

  // ดึง 7 ปีจาก 1 ถึง 7
  const years = Array.from({ length: 7 }, (_, i) => `${i + 1} ปี`);

  // ใช้ find() เพื่อ match กับ age ที่อยู่ใน growthChart
  const weightData = years.map(
    (year) =>
      child.growthChart.find((entry) => entry.age === year)?.weight ?? null
  );
  const heightData = years.map(
    (year) =>
      child.growthChart.find((entry) => entry.age === year)?.height ?? null
  );

  return (
    <div className="fixed inset-0 z-50 bg-white/80 flex justify-center items-start pt-10 overflow-y-auto">
      <div className="bg-white w-[90%] max-w-6xl rounded-lg shadow-lg animate-fadeIn p-6 border">
        {/* Header Title Bar */}
        <div className="-mx-6 -mt-6 bg-gradient-to-r from-green-600 to-yellow-400 text-white px-6 py-3 rounded-t-lg flex justify-between items-center">
          <h2 className="text-md font-bold">ข้อมูลส่วนบุคคล</h2>
          <button
            onClick={onClose}
            className="text-white text-xl hover:text-gray-200"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Profile Header Section */}
        <div className="flex justify-between items-center px-6 py-4 bg-green-50 border-b -mx-6">
          <div className="flex items-center gap-4">
            <div className="bg-green-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shadow-md">
              {child.fullName[0]}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-black">
                {child.prefix}
                {child.fullName}
              </h3>
              <p className="text-gray-700 text-sm">
                รหัส: {child.id} | อายุ:{' '}
                {(() => {
                  const birthYear = parseInt(child.birthDate.split(' ')[2]);
                  const currentYear = new Date().getFullYear() + 543;
                  return currentYear - birthYear;
                })()}{' '}
                ปี
              </p>
            </div>
          </div>
        </div>

        {/* ข้อมูลทั่วไป */}
        <section className="mb-6 mt-5">
          <h3 className="text-green-700 font-bold mb-2">ข้อมูลทั่วไป</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <p>
              <strong>รหัสประจำตัว:</strong> {child.id}
            </p>
            <p>
              <strong>คำนำหน้า:</strong> {child.prefix}
            </p>
            <p>
              <strong>ชื่อ:</strong> {firstName}
            </p>
            <p>
              <strong>นามสกุล:</strong> {lastName}
            </p>
            <p>
              <strong>เลขประจำตัวประชาชน:</strong> {child.personalId}
            </p>
            <p>
              <strong>วันเดือนปีเกิด:</strong> {child.birthDate}
            </p>
            <p>
              <strong>ศาสนา:</strong> {child.religion}
            </p>
            <p>
              <strong>หมู่โลหิต:</strong> {child.bloodType}
            </p>
          </div>
        </section>

        {/* ที่อยู่ปัจจุบัน */}
        <section className="mb-6">
          <h3 className="text-green-700 font-bold mb-2">ที่อยู่ปัจจุบัน</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <p>
              <strong>บ้านเลขที่:</strong> {child.address.houseNumber}
            </p>
            <p>
              <strong>หมู่ที่:</strong> {child.address.moo}
            </p>
            <p>
              <strong>ถนน:</strong> {child.address.road}
            </p>
            <p>
              <strong>ซอย:</strong> {child.address.alley}
            </p>
            <p>
              <strong>ตำบล/แขวง:</strong> {child.address.subDistrict}
            </p>
            <p>
              <strong>อำเภอ/เขต:</strong> {child.address.district}
            </p>
            <p>
              <strong>จังหวัด:</strong> {child.address.province}
            </p>
            <p>
              <strong>รหัสไปรษณีย์:</strong> {child.address.postalCode}
            </p>
            <p>
              <strong>โทรศัพท์:</strong> {child.address.phone}
            </p>
          </div>
        </section>

        {/* ที่อยู่ตามทะเบียนบ้าน */}
        {child.address.permanent && (
          <section className="mb-6">
            <h3 className="text-green-700 font-bold mb-2">
              ที่อยู่ตามทะเบียนบ้าน
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <p>
                <strong>บ้านเลขที่:</strong>{' '}
                {child.address.permanent.houseNumber}
              </p>
              <p>
                <strong>หมู่ที่:</strong> {child.address.permanent.moo}
              </p>
              <p>
                <strong>ถนน:</strong> {child.address.permanent.road}
              </p>
              <p>
                <strong>ซอย:</strong> {child.address.permanent.alley}
              </p>
              <p>
                <strong>ตำบล/แขวง:</strong>{' '}
                {child.address.permanent.subDistrict}
              </p>
              <p>
                <strong>อำเภอ/เขต:</strong> {child.address.permanent.district}
              </p>
              <p>
                <strong>จังหวัด:</strong> {child.address.permanent.province}
              </p>
              <p>
                <strong>รหัสไปรษณีย์:</strong>{' '}
                {child.address.permanent.postalCode}
              </p>
            </div>
          </section>
        )}

        {/* ผู้ปกครอง */}
        <section className="mb-6">
          <h3 className="text-green-700 font-bold mb-2">ข้อมูลผู้ปกครอง</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-semibold mb-1">บิดา</h4>
              <p>
                <strong>ชื่อ:</strong> {child.father.fullName}
              </p>
              <p>
                <strong>อายุ:</strong> {child.father.age}
              </p>
              <p>
                <strong>อาชีพ:</strong> {child.father.job}
              </p>
              <p>
                <strong>โทรศัพท์:</strong> {child.father.phone}
              </p>
              <p>
                <strong>รายได้ต่อปี:</strong> {child.father.income}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold mb-1">มารดา</h4>
              <p>
                <strong>ชื่อ:</strong> {child.mother.fullName}
              </p>
              <p>
                <strong>อายุ:</strong> {child.mother.age}
              </p>
              <p>
                <strong>อาชีพ:</strong> {child.mother.job}
              </p>
              <p>
                <strong>โทรศัพท์:</strong> {child.mother.phone}
              </p>
              <p>
                <strong>รายได้ต่อปี:</strong> {child.mother.income}
              </p>
            </div>
          </div>
        </section>

        {/* ผู้ปกครองกรณีอื่น */}
        <section className="mb-6">
          <h3 className="text-green-700 font-bold mb-2">
            ผู้ปกครอง (กรณีไม่ใช่บิดา/มารดา)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <p>
                <strong>ชื่อ-นามสกุล:</strong> {child.guardian.fullName}
              </p>
              <p>
                <strong>อายุ:</strong> {child.guardian.age}
              </p>
              <p>
                <strong>อาชีพ:</strong> {child.guardian.job}
              </p>
            </div>
            <div className="space-y-2">
              <p>
                <strong>โทรศัพท์:</strong> {child.guardian.phone}
              </p>
              <p>
                <strong>รายได้ต่อปี:</strong> {child.guardian.income}
              </p>
              <p>
                <strong>ความเกี่ยวข้อง:</strong> {child.guardian.relation}
              </p>
            </div>
          </div>
        </section>

        {/* กราฟการเจริญเติบโต */}
        <div className="p-4">
          <h3 className="text-green-700 font-bold mb-2">กราฟการเจริญเติบโต</h3>
          {child.growthChart.length > 0 ? (
            <div className="bg-white p-4 rounded border w-full h-[350px] relative">
              <Line
                data={{
                  labels: years.map((y) => `${y} ปี`),
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
          ) : (
            <p className="text-sm text-gray-500">ยังไม่มีข้อมูลกราฟ</p>
          )}
        </div>

        {/* ปุ่มปิด */}
        <div className="flex justify-end px-6 pt-2 pb-6 bg-white border-t">
          <button
            onClick={onClose}
            className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2 rounded-md font-semibold"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
}
