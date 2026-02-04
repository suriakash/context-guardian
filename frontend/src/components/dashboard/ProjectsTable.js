import { useNavigate } from "react-router-dom";

const projects = [
  {
    id: "1",
    name: "Series A Fundraising",
    lastMeeting: "2026-02-01",
    summary: "Valuation aligned, legal review pending",
    status: "Active",
  },
];

export default function ProjectsTable() {
  const navigate = useNavigate();

  return (
    <div className="bg-white border rounded-lg">
      <div className="p-4 font-semibold border-b">Projects</div>

      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="text-left p-3">Project</th>
            <th className="text-left p-3">Last Meeting</th>
            <th className="text-left p-3">Latest AI Summary</th>
            <th className="text-left p-3">Status</th>
          </tr>
        </thead>

        <tbody>
          {projects.map((p) => (
            <tr
              key={p.id}
              className="border-t cursor-pointer hover:bg-gray-50"
              onClick={() => navigate(`/projects/${p.id}`)}
            >
              <td className="p-3 font-medium">{p.name}</td>
              <td className="p-3">{p.lastMeeting}</td>
              <td className="p-3 text-gray-600">{p.summary}</td>
              <td className="p-3">
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                  {p.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
