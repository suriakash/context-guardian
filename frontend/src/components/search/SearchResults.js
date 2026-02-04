import { useNavigate } from "react-router-dom";

/**
 * Fake semantic search data
 * (later: embeddings + vector DB)
 */
const MEMORY_INDEX = [
  {
    id: "m1",
    type: "Meeting",
    title: "Sprint Planning",
    snippet: "Launch delayed by two weeks due to integration risk",
  },
  {
    id: "m2",
    type: "Decision",
    title: "Product Roadmap",
    snippet: "Decision made to delay public launch",
  },
  {
    id: "m3",
    type: "Action Item",
    title: "Fundraising",
    snippet: "Update investor deck and roadmap",
  },
];

export default function SearchResults({ query, onClose }) {
  const navigate = useNavigate();

  const results = MEMORY_INDEX.filter((item) =>
    item.snippet.toLowerCase().includes(query.toLowerCase()) ||
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  if (results.length === 0) {
    return (
      <div className="absolute mt-2 w-full bg-white border rounded-lg shadow p-3 text-sm text-gray-500">
        No results found
      </div>
    );
  }

  return (
    <div className="absolute mt-2 w-full bg-white border rounded-lg shadow max-h-64 overflow-y-auto z-50">
      {results.map((r) => (
        <div
          key={r.id}
          onClick={() => {
            navigate(`/meetings/${r.id}`);
            onClose();
          }}
          className="p-3 cursor-pointer hover:bg-gray-50 border-b last:border-b-0"
        >
          <div className="text-xs text-gray-400">
            {r.type}
          </div>
          <div className="font-medium text-sm">
            {r.title}
          </div>
          <div className="text-sm text-gray-600">
            {r.snippet}
          </div>
        </div>
      ))}
    </div>
  );
}
