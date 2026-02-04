// components/dashboard/KPICards.tsx
const stats = [
  { label: "Projects", value: 6 },
  { label: "Meetings Processed", value: 42 },
  { label: "AI Summaries", value: 89 },
  { label: "Est. Cost Saved", value: "$1,240" },
];

export default function KPICards() {
  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-white p-4 rounded-lg border"
        >
          <div className="text-sm text-gray-500">{s.label}</div>
          <div className="text-2xl font-semibold">{s.value}</div>
        </div>
      ))}
    </div>
  );
}