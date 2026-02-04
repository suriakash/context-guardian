export default function AISummaryPanel() {
  return (
    <div className="max-w-3xl bg-white border rounded-lg p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">AI Meeting Summary</h2>
        <button className="px-3 py-1 text-sm border rounded">
          Regenerate
        </button>
      </div>

      <Section title="TL;DR">
        Launch delayed by two weeks due to integration risk.
      </Section>

      <Section title="Decisions">
        <ul className="list-disc pl-5">
          <li>Delay public launch</li>
          <li>Reassign QA resources</li>
        </ul>
      </Section>

      <Section title="Action Items">
        <ul className="list-disc pl-5">
          <li>John → Update roadmap</li>
          <li>Alice → Notify stakeholders</li>
        </ul>
      </Section>

      <Section title="Risks">
        Third-party API stability.
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h3 className="font-medium mb-1">{title}</h3>
      <div className="text-gray-700">{children}</div>
    </div>
  );
}
