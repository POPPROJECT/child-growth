'use client';

import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ChartDataLabels);

// Plugin สำหรับแสดงปีตรงกลาง
const centerTextPlugin = {
  id: 'centerText',
  beforeDraw(chart: any) {
    const { width, height } = chart;
    const ctx = chart.ctx;
    ctx.save();

    const centerText = chart?.options?.plugins?.centerText?.text || '';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#000';
    ctx.fillText(centerText, width / 2, height / 2);
    ctx.restore();
  },
};

ChartJS.register(centerTextPlugin);

ChartJS.register(
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
);

type Summary = {
  total: number;
  underweight: number;
  normal: number;
  overweight: number;
  obese: number;
};

type CategoryGroupData = {
  category: 'underweight' | 'normal' | 'overweight' | 'obese';
  year: string;
  gender: string;
  count: number;
};

const categoryMap = {
  underweight: 'น้ำหนักน้อย',
  normal: 'น้ำหนักปกติ',
  overweight: 'น้ำหนักเกิน',
  obese: 'อ้วน',
};

const categoryColors = {
  underweight: '#FF9800',
  normal: '#4CAF50',
  overweight: '#FFC107',
  obese: '#F44336',
};

const genderColors = {
  MALE: '#2196F3',
  FEMALE: '#8BC34A',
};

export default function DashboardPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [categoryData, setCategoryData] = useState<CategoryGroupData[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      const [summaryRes, catRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/dashboard/summary`),
        fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/dashboard/by-category-gender-year`
        ),
      ]);
      setSummary(await summaryRes.json());
      const catJson = await catRes.json();
      setCategoryData(Array.isArray(catJson) ? catJson : []);
    };
    fetchAll();
  }, []);

  if (!summary) return <p className="p-6">กำลังโหลดข้อมูล...</p>;

  const renderCategoryChart = (category: keyof typeof categoryMap) => {
    const dataForCategory = categoryData.filter((d) => d.category === category);

    const years = [
      ...new Set(dataForCategory.map((d) => d.year).filter(Boolean)),
    ].sort();

    const males = years.map(
      (year) =>
        dataForCategory.find((d) => d.gender === 'MALE' && d.year === year)
          ?.count || 0
    );
    const females = years.map(
      (year) =>
        dataForCategory.find((d) => d.gender === 'FEMALE' && d.year === year)
          ?.count || 0
    );

    return {
      labels: years.map(displayYearLabel), // ✅ แปลงปีเป็น พ.ศ.
      datasets: [
        {
          label: 'ชาย',
          data: males,
          backgroundColor: genderColors.MALE,
        },
        {
          label: 'หญิง',
          data: females,
          backgroundColor: genderColors.FEMALE,
        },
      ],
    };
  };

  const displayYear = (raw: string) => {
    const parsed = new Date(raw);
    if (!isNaN(parsed.getTime())) {
      return `ปี ${parsed.getFullYear() + 543}`; // แสดงปี พ.ศ.
    }
    if (/^\d{4}$/.test(raw)) {
      return `ปี ${parseInt(raw) + 543}`; // ถ้าเป็นปี ค.ศ. (เช่น 2025)
    }
    return 'ปี -';
  };

  const barOptions = (title: string) => ({
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: title },
    },
    scales: {
      y: { beginAtZero: true },
    },
  });

  const renderDoughnutCharts = (category: keyof typeof categoryMap) => {
    const dataForCategory = categoryData.filter((d) => d.category === category);

    const years = [...new Set(dataForCategory.map((d) => d.year))];

    return years.map((year) => {
      const totalForYear = categoryData
        .filter((d) => d.year === year)
        .reduce((sum, d) => sum + d.count, 0);

      const categoryTotal = dataForCategory
        .filter((d) => d.year === year)
        .reduce((sum, d) => sum + d.count, 0);

      const doughnutData = {
        labels: [`${categoryMap[category]}`, 'เด็กทั้งหมด'],
        datasets: [
          {
            data: [categoryTotal, totalForYear - categoryTotal],
            backgroundColor: [categoryColors[category], '#BDBDBD'],
            borderWidth: 2,
          },
        ],
      };

      return (
        <div
          key={`${category}-${year}`}
          className="card p-4 flex flex-col items-center h-[320px]"
        >
          <h4 className="text-md font-semibold mb-2">
            แผนภาพแสดงสัดส่วน {categoryMap[category]} กับเด็กทั้งหมด (
            {displayYear(year)})
          </h4>

          <div className="w-[200px] h-[200px]">
            <Doughnut
              data={doughnutData}
              options={{
                plugins: {
                  legend: { position: 'bottom' },
                  tooltip: {
                    callbacks: {
                      label: function (
                        ctx: import('chart.js').TooltipItem<'doughnut'>
                      ) {
                        const val = ctx.raw as number;
                        const percent = Math.round((val / totalForYear) * 100);
                        return `${ctx.label}: ${val} คน (${percent}%)`;
                      },
                    },
                  },
                  centerText: {
                    text: displayYear(year),
                  },
                } as any,
                cutout: '60%',
              }}
            />
          </div>
        </div>
      );
    });
  };

  const displayYearLabel = (raw: string) => {
    if (!raw) return '-';
    const parsed = new Date(raw);
    if (!isNaN(parsed.getTime())) {
      return (parsed.getFullYear() + 543).toString(); // ค.ศ. → พ.ศ.
    }
    if (/^\d{4}$/.test(raw)) {
      return (parseInt(raw) + 543).toString(); // "2025" → "2568"
    }
    return raw;
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-green-800 mb-6">แดชบอร์ด</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <SummaryCard
          label="เด็กทั้งหมด"
          value={summary.total}
          color="bg-blue-500"
        />
        <SummaryCard
          label="น้ำหนักน้อย"
          value={summary.underweight}
          color="bg-orange-500"
        />
        <SummaryCard
          label="น้ำหนักปกติ"
          value={summary.normal}
          color="bg-green-500"
        />
        <SummaryCard
          label="น้ำหนักเกิน"
          value={summary.overweight}
          color="bg-yellow-500"
        />
        <SummaryCard label="อ้วน" value={summary.obese} color="bg-red-500" />
      </div>

      {/* รวม 3 หมวดหมู่แบบแยกกราฟ */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {(['underweight', 'normal', 'overweight', 'obese'] as const).map(
          (category) => (
            <div key={category} className="card p-4 h-[400px]">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                แผนภาพแสดง {categoryMap[category]}
              </h3>
              <Bar
                data={renderCategoryChart(category)}
                options={barOptions(`แผนภาพแสดงเกณฑ์ ${categoryMap[category]}`)}
              />
            </div>
          )
        )}
      </div>
      <div className="mt-10">
        <h2 className="text-xl font-bold text-green-800 mb-4">
          สัดส่วนเปรียบเทียบเกณฑ์น้ำหนักกับเด็กทั้งหมด
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {(['underweight', 'normal', 'overweight', 'obese'] as const).map(
            (category) => renderDoughnutCharts(category)
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="card p-6 flex items-center">
      <div className={`rounded-full p-3 mr-4 text-white ${color}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      </div>
      <div>
        <p className="text-gray-500">{label}</p>
        <h2 className="text-2xl font-bold">{value} คน</h2>
      </div>
    </div>
  );
}
