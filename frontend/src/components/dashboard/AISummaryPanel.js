// components/meetings/AISummaryPanel.tsx
export default function AISummaryPanel() {
  return (
    <div className="bg-white border rounded-lg p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">AI Summary</h2>
        <button className="text-sm px-3 py-1 border rounded">
          Regenerate
        </button>
      </div>

      <section>
        <h3 className="font-medium">TL;DR</h3>
        <p className="text-gray-700">
          Launch delayed by two weeks due to integration risk.
        </p>
      </section>

      <section>
        <h3 className="font-medium">Decisions</h3>
        <ul className="list-disc pl-5 text-gray-700">
          <li>Delay launch</li>
          <li>Reallocate QA resources</li>
        </ul>
      </section>

      <section>
        <h3 className="font-medium">Action Items</h3>
        <ul className="list-disc pl-5 text-gray-700">
          <li>John → Update roadmap</li>
          <li>Alice → Notify stakeholders</li>
        </ul>
      </section>
    </div>
  );
}