export default function Results() {
  return (
    <section className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-6">
      <h1 className="text-2xl font-semibold mb-2">Results</h1>
      <p className="opacity-80 mb-4">
        Below is a placeholder layout for OCR output. We’ll wire it to your API next.
      </p>

      {/* Summary cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <div className="rounded-lg border border-[rgb(var(--border))] p-4">
          <div className="text-sm opacity-70">Risk Score</div>
          <div className="text-2xl font-semibold">—</div>
        </div>
        <div className="rounded-lg border border-[rgb(var(--border))] p-4">
          <div className="text-sm opacity-70">Confidence</div>
          <div className="text-2xl font-semibold">—</div>
        </div>
        <div className="rounded-lg border border-[rgb(var(--border))] p-4">
          <div className="text-sm opacity-70">Document Type</div>
          <div className="text-2xl font-semibold">—</div>
        </div>
      </div>

      {/* Parsed fields table (stub) */}
      <div className="rounded-lg border border-[rgb(var(--border))] overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-white/40">
            <tr>
              <th className="text-left p-3 border-b border-[rgb(var(--border))]">Field</th>
              <th className="text-left p-3 border-b border-[rgb(var(--border))]">Value</th>
              <th className="text-left p-3 border-b border-[rgb(var(--border))]">Confidence</th>
            </tr>
          </thead>
          <tbody>
            <tr className="odd:bg-white/20">
              <td className="p-3 border-b border-[rgb(var(--border))]">Account Holder</td>
              <td className="p-3 border-b border-[rgb(var(--border))]">—</td>
              <td className="p-3 border-b border-[rgb(var(--border))]">—</td>
            </tr>
            <tr className="odd:bg-white/20">
              <td className="p-3 border-b border-[rgb(var(--border))]">Statement Period</td>
              <td className="p-3 border-b border-[rgb(var(--border))]">—</td>
              <td className="p-3 border-b border-[rgb(var(--border))]">—</td>
            </tr>
            <tr className="odd:bg-white/20">
              <td className="p-3 border-b border-[rgb(var(--border))]">Net Income</td>
              <td className="p-3 border-b border-[rgb(var(--border))]">—</td>
              <td className="p-3 border-b border-[rgb(var(--border))]">—</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Downloads / actions */}
      <div className="mt-6 flex gap-3">
        <button className="btn-primary inline-flex items-center px-3 py-2 rounded-lg">
          Download Summary (PDF)
        </button>
        <button className="inline-flex items-center px-3 py-2 rounded-lg border border-[rgb(var(--border))]">
          Download JSON
        </button>
      </div>
    </section>
  );
}
