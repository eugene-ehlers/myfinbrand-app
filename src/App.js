import './styles/globals.css';
import Header from './components/Header';
import Footer from './components/Footer';
import FileUpload from './components/FileUpload';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="container flex-1 py-10">
        <h1 className="text-3xl font-bold mb-2">Financial OCR Dashboard</h1>
        <p className="opacity-80">Your rust/navy/off-white brand is live.</p>

        <div className="mt-6 grid md:grid-cols-3 gap-6">
          <div className="rounded-xl border p-5 bg-[rgb(var(--surface))]">
            <div className="text-sm opacity-80">Card</div>
            <div className="mt-1 text-xl font-semibold">Upload Financials</div>
            <p className="mt-2 opacity-80">
              PDF or image. We’ll OCR, summarise and compute risk ratios.
            </p>
            <div className="mt-4 flex gap-3">
              <button className="btn-primary px-4 py-2 rounded-md">Upload</button>
              <button className="px-4 py-2 rounded-md border">Cancel</button>
            </div>
          </div>

          <div className="rounded-xl border p-5 bg-[rgb(var(--surface))]">
            <div className="text-sm opacity-80">KPI</div>
            <div className="mt-1 flex items-end gap-2">
              <div className="text-2xl font-bold">1.23x</div>
              <span className="font-semibold" style={{ color: 'rgb(var(--accent))' }}>
                +0.08
              </span>
            </div>
            <div className="mt-2 w-full h-2 rounded-full" style={{ background: 'rgba(43,212,224,.25)' }}>
              <div className="h-2 rounded-full" style={{ width: '62%', background: 'rgb(var(--primary))' }} />
            </div>
            <div className="mt-2 text-xs opacity-80">Affordability Index (12m)</div>
          </div>

          <div className="rounded-xl border p-5 bg-[rgb(var(--surface))]">
            <div className="text-sm opacity-80">Form</div>
            <label className="block mt-2 text-sm">Applicant Name</label>
            <input className="mt-1 w-full rounded-md px-3 py-2 border bg-[rgb(var(--surface))]" placeholder="Jane Doe" />
            <label className="block mt-3 text-sm">Company</label>
            <input className="mt-1 w-full rounded-md px-3 py-2 border bg-[rgb(var(--surface))]" placeholder="Acme Pty Ltd" />
            <button className="mt-4 w-full btn-primary px-4 py-2 rounded-md">Continue</button>
          </div>
        </div>
          {/* ADD THIS NEW SECTION - AFTER your existing dashboard content */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Documents</h2>
            <FileUpload />
          </div>

      </main>

      <Footer />
    </div>
  );
}
