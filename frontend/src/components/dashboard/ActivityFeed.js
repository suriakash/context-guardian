const activity = [
  "AI summary generated for Product Roadmap",
  "Meeting transcript uploaded",
  "Summary regenerated for Fundraising",
];

export default function ActivityFeed() {
  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="font-semibold mb-3">Recent Activity</div>
      <ul className="space-y-2 text-sm text-gray-600">
        {activity.map((a, i) => (
          <li key={i}>• {a}</li>
        ))}
      </ul>
    </div>
  );
}
