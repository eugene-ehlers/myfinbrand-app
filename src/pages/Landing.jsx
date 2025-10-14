import React from 'react';
import FileUpload from '../components/dashboard/FileUpload';

export default function Landing({ onUpgrade }) {
  const handleDemoUpload = () => {
    // After demo upload completes, show upgrade prompt
    setTimeout(() => {
      const shouldUpgrade = window.confirm(
        "Demo complete! Sign up to save results and access full features?"
      );
      if (shouldUpgrade) {
        onUpgrade();
      }
    }, 2000);
  };

  return (
    <div>
      {/* Page Title */}
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Financial OCR Dashboard</h1>
      
      {/* 3-Card Grid - Your Existing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Upload Financials Card */}
        <div className="rounded-xl border p-5 bg-[rgb(var(--surface))]">
          <div className="text-sm opacity-80">Upload</div>
          <div className="mt-2 text-lg font-semibold">Upload Financials</div>
          <div className="mt-2 text-sm opacity-70">
            Extract data from financial documents with AI-powered OCR
          </div>
          <div className="mt-4 flex gap-2">
            <button 
              onClick={() => document.getElementById('demo-upload').scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary px-4 py-2 rounded-md"
            >
              Try Demo
            </button>
            <button 
              onClick={onUpgrade}
              className="px-4 py-2 rounded-md border hover:bg-gray-50"
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* KPI Card */}
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

        {/* Form Preview Card */}
        <div className="rounded-xl border p-5 bg-[rgb(var(--surface))]">
          <div className="text-sm opacity-80">Quick Start</div>
          <label className="block mt-2 text-sm">Applicant Name</label>
          <input 
            className="mt-1 w-full rounded-md px-3 py-2 border bg-[rgb(var(--surface))]" 
            placeholder="Jane Doe" 
            disabled
          />
          <label className="block mt-3 text-sm">Company</label>
          <input 
            className="mt-1 w-full rounded-md px-3 py-2 border bg-[rgb(var(--surface))]" 
            placeholder="Acme Pty Ltd" 
            disabled
          />
          <button 
            onClick={onUpgrade}
            className="mt-4 w-full btn-primary px-4 py-2 rounded-md"
          >
            Get Full Access
          </button>
        </div>
      </div>

      {/* Demo Upload Section */}
      <div id="demo-upload" className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Try Our Demo</h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="text-yellow-600 mr-2">⚡</div>
            <div className="text-sm text-yellow-800">
              <strong>Demo Mode:</strong> Upload and process documents instantly. Sign up to save results and access advanced features.
            </div>
          </div>
        </div>
        <FileUpload onUploadComplete={handleDemoUpload} isDemo={true} />
      </div>
    </div>
  );
}
