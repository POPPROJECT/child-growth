'use client';

import React, { useState } from 'react';

interface AddChildModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddChildModal({
  onClose,
  onSuccess,
}: AddChildModalProps) {
  const [form, setForm] = useState({
    // ข้อมูลทั่วไป
    code: '',
    prefix: '',
    gender: '',
    fullName: '',
    personalId: '',
    birthDate: '',
    religion: '',
    bloodType: '',
    phone: '',

    // ที่อยู่ปัจจุบัน
    currentAddress: {
      houseNo: '',
      moo: '',
      road: '',
      alley: '',
      subDistrict: '',
      district: '',
      province: '',
      postalCode: '',
    },

    // ทะเบียนบ้าน
    permanentAddress: {
      houseNo: '',
      moo: '',
      road: '',
      alley: '',
      subDistrict: '',
      district: '',
      province: '',
      postalCode: '',
    },

    // ผู้ปกครอง
    father: {
      fullName: '',
      age: '',
      job: '',
      phone: '',
      income: '',
    },
    mother: {
      fullName: '',
      age: '',
      job: '',
      phone: '',
      income: '',
    },
    guardian: {
      fullName: '',
      age: '',
      job: '',
      phone: '',
      income: '',
      relation: '',
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    section?: keyof typeof form,
    field?: string
  ) => {
    const { name, value } = e.target;

    // ตั้งค่า gender จาก prefix
    if (name === 'prefix') {
      let genderValue = '';
      if (value === 'เด็กชาย') genderValue = 'MALE';
      if (value === 'เด็กหญิง') genderValue = 'FEMALE';

      setForm((prev) => ({
        ...prev,
        prefix: value,
        gender: genderValue,
      }));
      return;
    }

    if (section && field) {
      setForm((prev) => ({
        ...prev,
        [section]: {
          ...(prev[section] as Record<string, any>),
          [field]: value,
        },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/children`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      }
    );

    if (!res.ok) {
      alert('บันทึกไม่สำเร็จ');
      return;
    }

    alert('บันทึกข้อมูลสำเร็จ');
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex justify-center items-start pt-10 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl p-6 rounded-lg shadow-lg space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-green-800">
            เพิ่มข้อมูลเด็ก
          </h2>
          <button
            onClick={onClose}
            className="text-xl font-bold text-gray-500 hover:text-red-500"
          >
            ×
          </button>
        </div>

        {/* ข้อมูลทั่วไป */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <input
            name="code"
            placeholder="รหัสเด็ก"
            onChange={handleChange}
            className="input"
          />
          <select name="prefix" onChange={handleChange} className="input">
            <option value="">เลือกคำนำหน้า</option>
            <option value="เด็กชาย">เด็กชาย</option>
            <option value="เด็กหญิง">เด็กหญิง</option>
          </select>

          <input
            name="fullName"
            placeholder="ชื่อ-นามสกุล"
            onChange={handleChange}
            className="input"
          />
          <input
            name="personalId"
            placeholder="เลขบัตรประชาชน"
            onChange={handleChange}
            className="input"
          />
          <input
            name="birthDate"
            type="date"
            onChange={handleChange}
            className="input"
          />
          <input
            name="religion"
            placeholder="ศาสนา"
            onChange={handleChange}
            className="input"
          />
          <input
            name="bloodType"
            placeholder="หมู่โลหิต"
            onChange={handleChange}
            className="input"
          />
          <input
            name="phone"
            placeholder="เบอร์โทรศัพท์"
            onChange={handleChange}
            className="input"
          />
        </section>

        {/* ที่อยู่ปัจจุบัน */}
        <section>
          <h3 className="text-green-700 font-semibold mb-2">ที่อยู่ปัจจุบัน</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            {[
              'บ้านเลขที่',
              'หมู่ที่',
              'ถนน',
              'ซอย',
              'อำเภอ',
              'ตำบล',
              'จังหวัด',
              'รหัสไปษณีย์',
            ].map((key) => (
              <input
                key={key}
                placeholder={key}
                onChange={(e) => handleChange(e, 'currentAddress', key)}
                className="input"
              />
            ))}
          </div>
        </section>

        {/* ที่อยู่ตามทะเบียนบ้าน */}
        <section>
          <h3 className="text-green-700 font-semibold mb-2">
            ที่อยู่ตามทะเบียนบ้าน
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            {[
              'บ้านเลขที่',
              'หมู่ที่',
              'ถนน',
              'ซอย',
              'อำเภอ',
              'ตำบล',
              'จังหวัด',
              'รหัสไปษณีย์',
            ].map((key) => (
              <input
                key={key}
                placeholder={key}
                onChange={(e) => handleChange(e, 'permanentAddress', key)}
                className="input"
              />
            ))}
          </div>
        </section>

        {/* บิดา / มารดา */}
        <section>
          <h3 className="text-green-700 font-semibold mb-2">
            ข้อมูลบิดา / มารดา
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {(['father', 'mother'] as const).map((parent) => (
              <div key={parent}>
                <h4 className="font-semibold mb-1">
                  {parent === 'father' ? 'บิดา' : 'มารดา'}
                </h4>
                {[
                  'ชื่อ-สกุล',
                  'อายุ',
                  'อาชีพ',
                  'เบอร์โทรศัพท์',
                  'รายได้ต่อปี',
                ].map((field) => (
                  <input
                    key={`${parent}-${field}`} // ✅ แก้ให้ key เป็น unique
                    placeholder={field}
                    onChange={(e) => handleChange(e, parent, field)}
                    className="input mb-1"
                  />
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* ผู้ปกครองกรณีอื่น */}
        <section>
          <h3 className="text-green-700 font-semibold mb-2">
            ผู้ปกครอง (กรณีไม่ใช่บิดา/มารดา)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            {[
              'ชื่อ-สกุล',
              'อาชีพ',
              'อาชีพ',
              'เบอร์โทรศัพท์',
              'รายได้ต่อปี',
              'ความเกี่ยวข้อง',
            ].map((field, index) => (
              <input
                key={`${field}-${index}`} // ✅ แก้ key ให้ไม่ซ้ำ
                placeholder={field}
                onChange={(e) => handleChange(e, 'guardian', field)}
                className="input"
              />
            ))}
          </div>
        </section>

        {/* ปุ่ม */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            บันทึก
          </button>
        </div>
      </div>
    </div>
  );
}
