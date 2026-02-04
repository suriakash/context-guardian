import Tooltip from "../ui/Tooltip";

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
          <div className="text-2xl font-semibold tracking-tight text-gray-900">
            {s.value}
          </div>

          <div className="text-xs text-gray-400 uppercase tracking-wide flex items-center">
             {s.label}
             <Tooltip text={getKpiHelp(s.label)} />
          </div>
        </div>
      ))}
    </div>
  );
}

function getKpiHelp(label) {
  const map = {
    Projects: "Number of active initiatives being tracked",
    "Meetings Processed": "Total meetings analyzed by AI",
    "AI Summaries": "Structured summaries generated",
    "Est. Cost Saved": "Estimated time & cost reduction",
  };
  return map[label] || "";
}
