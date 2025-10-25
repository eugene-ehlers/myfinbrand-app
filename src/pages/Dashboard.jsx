export default function Dashboard() {
  return (
    <section className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-6">
      <h1 className="text-2xl font-semibold mb-2">Dashboard (Signed-in Landing)</h1>
      <p className="opacity-80 mb-4">
        Start a one-by-one OCR intake: choose a document type, upload, and process.
      </p>

      {/* Intake form stub – wire to your API next */}
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="block">
            <span className="block text-sm mb-1">Document type</span>
            <select className="w-full rounded-lg border border-[rgb(var(--border))] p-2 bg-white">
              <option>Bank Statement (PDF)</option>
              <option>Payslip (PDF)</option>
              <option>Other Financial (PDF)</option>
            </select>
          </label>

          <label className="block">
            <span className="block text-sm mb-1">Client reference (optional)</span>
            <input
              type="text"
              placeholder="e.g., APP-2025-00123"
              className="w-full rounded-lg border border-[rgb(var(--border))] p-2"
            />
          </label>
        </div>

        <label className="block">
          <span className="block text-sm mb-1">Upload file</span>
          <input
            type="file"
            accept="application/pdf"
            className="w-full rounded-lg border border-[rgb(var(--border))] p-2 bg-white"
          />
        </label>

        <div className="flex gap-3">
          <button type="submit" className="btn-primary inline-flex items-center px-3 py-2 rounded-lg">
            Run OCR
          </button>
          <a href="/results" className="inline-flex items-center px-3 py-2 rounded-lg border border-[rgb(var(--border))]">
            View Results
          </a>
        </div>
      </form>
    </section>
  );
}
