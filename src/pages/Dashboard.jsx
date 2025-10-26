// src/pages/Dashboard.jsx
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [partyType, setPartyType] = useState("individual"); // 'individual' | 'business'
  const [mode, setMode] = useState("one"); // 'one' | 'batch' (batch disabled for now)
  const [docs, setDocs] = useState({
    personalPayslip: false,
    personalBank: true,
    personalId: false,
    businessFinancials: false,
    businessBank: false,
  });
  const [financialsType, setFinancialsType] = useState("audited-full");
  const [files, setFiles] = useState({ primary: null, extra: [] });

  // helpers
  const toggleDoc = (k) => setDocs((d) => ({ ...d, [k]: !d[k] }));

  const onPrimaryFile = (e) => setFiles((f) => ({ ...f, primary: e.target.files?.[0] ?? null }));
  const onExtraFiles = (e) => setFiles((f) => ({ ...f, extra: Array.from(e.target.files ?? []) }));

  const onSubmit = (e) => {
    e.preventDefault();
    // TODO: call your API (Amplify/Fetch) with the collected payload
    // For now just navigate to Results page to keep flow visible.
    window.location.assign("/results");
  };

  // derived booleans to control conditional sections
  const wantsPersonal = partyType === "individual";
  const wantsBusiness = partyType === "business";
  const wantsPayslip = wantsPersonal && docs.personalPayslip;
  const wantsPersonalBank = wantsPersonal && docs.personalBank;
  const wantsId = wantsPersonal && docs.personalId;
  const wantsBusinessFinancials = wantsBusiness && docs.businessFinancials;
  const wantsBusinessBank = wantsBusiness && docs.businessBank;

  return (
    <section className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Dashboard (Signed-in landing)</h1>
        <div className="flex gap-2">
          <Link to="/" className="px-3 py-2 rounded-lg border border-[rgb(var(--border))]">Home</Link>
          <Link to="/admin" className="px-3 py-2 rounded-lg border border-[rgb(var(--border))]">Admin</Link>
          <button className="px-3 py-2 rounded-lg border border-[rgb(var(--border))]">Sign out</button>
        </div>
      </div>

      <p className="opacity-80 mb-6">
        Specify the documents to OCR, capture required details, upload files, and then <em>Commence</em> to process.
      </p>

      <form className="space-y-6" onSubmit={onSubmit}>
        {/* Mode (one-by-one vs batch) */}
        <fieldset className="rounded-lg border border-[rgb(var(--border))] p-4">
          <legend className="font-medium px-2">Mode</legend>
          <div className="flex gap-6">
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="mode"
                value="one"
                checked={mode === "one"}
                onChange={() => setMode("one")}
              />
              <span>One by one</span>
            </label>
            <label className="inline-flex items-center gap-2 opacity-60 cursor-not-allowed" title="Batch coming later">
              <input type="radio" name="mode" value="batch" disabled />
              <span>Batch (coming later)</span>
            </label>
          </div>
        </fieldset>

        {/* Party type */}
        <fieldset className="rounded-lg border border-[rgb(var(--border))] p-4">
          <legend className="font-medium px-2">Client type</legend>
          <div className="flex gap-6">
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="party"
                value="individual"
                checked={partyType === "individual"}
                onChange={() => setPartyType("individual")}
              />
              <span>Individual</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="party"
                value="business"
                checked={partyType === "business"}
                onChange={() => setPartyType("business")}
              />
              <span>Business</span>
            </label>
          </div>
        </fieldset>

        {/* Base identity fields */}
        {wantsPersonal && (
          <div className="grid gap-4 md:grid-cols-2 rounded-lg border border-[rgb(var(--border))] p-4">
            <div>
              <label className="block text-sm mb-1">First name</label>
              <input className="w-full rounded-lg border border-[rgb(var(--border))] p-2" />
            </div>
            <div>
              <label className="block text-sm mb-1">Surname</label>
              <input className="w-full rounded-lg border border-[rgb(var(--border))] p-2" />
            </div>
            <div>
              <label className="block text-sm mb-1">Initials</label>
              <input className="w-full rounded-lg border border-[rgb(var(--border))] p-2" />
            </div>
            <div>
              <label className="block text-sm mb-1">Net income</label>
              <input type="number" className="w-full rounded-lg border border-[rgb(var(--border))] p-2" />
            </div>
          </div>
        )}

        {wantsBusiness && (
          <div className="grid gap-4 md:grid-cols-2 rounded-lg border border-[rgb(var(--border))] p-4">
            <div>
              <label className="block text-sm mb-1">Registered name</label>
              <input className="w-full rounded-lg border border-[rgb(var(--border))] p-2" />
            </div>
            <div>
              <label className="block text-sm mb-1">Registration number</label>
              <input className="w-full rounded-lg border border-[rgb(var(--border))] p-2" />
            </div>
            <div>
              <label className="block text-sm mb-1">Industry</label>
              <input className="w-full rounded-lg border border-[rgb(var(--border))] p-2" />
            </div>
            <div>
              <label className="block text-sm mb-1">Type of business</label>
              <select className="w-full rounded-lg border border-[rgb(var(--border))] p-2 bg-white">
                <option>Company</option>
                <option>Trust</option>
                <option>Partnership</option>
                <option>Sole Proprietor</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Financial year end (MM)</label>
              <input type="text" placeholder="e.g., 02" className="w-full rounded-lg border border-[rgb(var(--border))] p-2" />
            </div>
          </div>
        )}

        {/* Documents selection */}
        <fieldset className="rounded-lg border border-[rgb(var(--border))] p-4">
          <legend className="font-medium px-2">Select documents to OCR</legend>

          {wantsPersonal && (
            <div className="grid gap-3 md:grid-cols-3">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={docs.personalPayslip} onChange={() => toggleDoc("personalPayslip")} />
                <span>Payslip</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={docs.personalBank} onChange={() => toggleDoc("personalBank")} />
                <span>Bank statements</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={docs.personalId} onChange={() => toggleDoc("personalId")} />
                <span>ID/Passport</span>
              </label>
            </div>
          )}

          {wantsBusiness && (
            <div className="grid gap-3 md:grid-cols-3">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={docs.businessFinancials} onChange={() => toggleDoc("businessFinancials")} />
                <span>Financial statements</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={docs.businessBank} onChange={() => toggleDoc("businessBank")} />
                <span>Bank statements</span>
              </label>
            </div>
          )}
        </fieldset>

        {/* Conditional fields driven by selections */}
        {wantsPayslip && (
          <div className="rounded-lg border border-[rgb(var(--border))] p-4">
            <h3 className="font-medium mb-3">Payslip details</h3>
            <label className="block">
              <span className="block text-sm mb-1">Employer name</span>
              <input className="w-full rounded-lg border border-[rgb(var(--border))] p-2" />
            </label>
          </div>
        )}

        {wantsPersonalBank && (
          <div className="rounded-lg border border-[rgb(var(--border))] p-4">
            <h3 className="font-medium mb-3">Personal bank details</h3>
            <div className="grid gap-3 md:grid-cols-3">
              <label className="block">
                <span className="block text-sm mb-1">Bank name</span>
                <input className="w-full rounded-lg border border-[rgb(var(--border))] p-2" />
              </label>
              <label className="block">
                <span className="block text-sm mb-1">Account number</span>
                <input className="w-full rounded-lg border border-[rgb(var(--border))] p-2" />
              </label>
              <label className="block">
                <span className="block text-sm mb-1">Account type</span>
                <select className="w-full rounded-lg border border-[rgb(var(--border))] p-2 bg-white">
                  <option>Cheque/Current</option>
                  <option>Savings</option>
                  <option>Credit</option>
                </select>
              </label>
            </div>
          </div>
        )}

        {wantsId && (
          <div className="rounded-lg border border-[rgb(var(--border))] p-4">
            <h3 className="font-medium mb-3">ID / Passport</h3>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="block">
                <span className="block text-sm mb-1">ID / Passport number</span>
                <input className="w-full rounded-lg border border-[rgb(var(--border))] p-2" />
              </label>
              <label className="block">
                <span className="block text-sm mb-1">Country of issue</span>
                <input className="w-full rounded-lg border border-[rgb(var(--border))] p-2" />
              </label>
            </div>
          </div>
        )}

        {wantsBusinessFinancials && (
          <div className="rounded-lg border border-[rgb(var(--border))] p-4">
            <h3 className="font-medium mb-3">Financial statements</h3>
            <div className="grid gap-3 md:grid-cols-3">
              <label className="block">
                <span className="block text-sm mb-1">Type</span>
                <select
                  value={financialsType}
                  onChange={(e) => setFinancialsType(e.target.value)}
                  className="w-full rounded-lg border border-[rgb(var(--border))] p-2 bg-white"
                >
                  <option value="audited-full">Audited full year</option>
                  <option value="unaudited-full">Unaudited full year</option>
                  <option value="unaudited-interim">Unaudited interim/half-year</option>
                </select>
              </label>
              <label className="block md:col-span-2">
                <span className="block text-sm mb-1">Financial period covered</span>
                <input placeholder="e.g., Jan 2024 – Dec 2024" className="w-full rounded-lg border border-[rgb(var(--border))] p-2" />
              </label>
            </div>
          </div>
        )}

        {wantsBusinessBank && (
          <div className="rounded-lg border border-[rgb(var(--border))] p-4">
            <h3 className="font-medium mb-3">Business bank details</h3>
            <div className="grid gap-3 md:grid-cols-3">
              <label className="block">
                <span className="block text-sm mb-1">Bank name</span>
                <input className="w-full rounded-lg border border-[rgb(var(--border))] p-2" />
              </label>
              <label className="block">
                <span className="block text-sm mb-1">Account number</span>
                <input className="w-full rounded-lg border border-[rgb(var(--border))] p-2" />
              </label>
              <label className="block">
                <span className="block text-sm mb-1">Account type</span>
                <select className="w-full rounded-lg border border-[rgb(var(--border))] p-2 bg-white">
                  <option>Cheque/Current</option>
                  <option>Savings</option>
                  <option>Credit</option>
                </select>
              </label>
            </div>
          </div>
        )}

        {/* Uploads */}
        <div className="rounded-lg border border-[rgb(var(--border))] p-4">
          <h3 className="font-medium mb-3">Upload documents</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="block">
              <span className="block text-sm mb-1">Primary file (PDF)</span>
              <input type="file" accept="application/pdf" onChange={onPrimaryFile}
                     className="w-full rounded-lg border border-[rgb(var(--border))] p-2 bg-white" />
            </label>
            <label className="block">
              <span className="block text-sm mb-1">Additional files (optional)</span>
              <input multiple type="file" accept="application/pdf" onChange={onExtraFiles}
                     className="w-full rounded-lg border border-[rgb(var(--border))] p-2 bg-white" />
            </label>
          </div>
          {files.primary && (
            <p className="text-sm opacity-70 mt-2">Selected: {files.primary.name} (+{files.extra.length} extra)</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <button type="submit" className="btn-primary inline-flex items-center px-3 py-2 rounded-lg">
            Commence / Start
          </button>
          <button type="reset" className="inline-flex items-center px-3 py-2 rounded-lg border border-[rgb(var(--border))]">
            Clear
          </button>
          <Link to="/" className="inline-flex items-center px-3 py-2 rounded-lg border border-[rgb(var(--border))]">
            Home
          </Link>
          <Link to="/admin" className="inline-flex items-center px-3 py-2 rounded-lg border border-[rgb(var(--border))]">
            Admin
          </Link>
          <Link to="/results" className="inline-flex items-center px-3 py-2 rounded-lg border border-[rgb(var(--border))]">
            Results
          </Link>
        </div>
      </form>
    </section>
  );
}

      </form>
    </section>
  );
}
