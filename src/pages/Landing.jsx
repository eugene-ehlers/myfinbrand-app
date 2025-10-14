import React from 'react';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/dashboard/FileUpload';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Financial Document OCR Processing
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Extract, analyze, and score financial data from documents with AI-powered OCR technology
        </p>
      </div>

      {/* Three Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Upload Financials Card */}
        <div className="bg-white rounded-lg border p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📄</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Financials</h3>
            <p className="text-gray-600 text-sm">
              Process payslips, bank statements, and financial reports with AI-powered extraction
            </p>
          </div>
          
          <div className="space-y-3">
            <button 
              onClick={() => document.getElementById('demo-section').scrollIntoView({ behavior: 'smooth' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Try Demo
            </button>
            <button 
              onClick={() => navigate('/dashboard')}
              className="w-full btn-primary px-4 py-2 rounded-md"
            >
              Get Started
            </button>
          </div>
        </div>

        {/* KPI Preview Card */}
        <div className="bg-white rounded-lg border p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Results Preview</h3>
            <p className="text-gray-600 text-sm">
              See what kind of insights and scores you'll get from your documents
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Confidence Score</span>
              <span className="font-semibold text-green-600">94%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Risk Score</span>
              <span className="font-semibold text-orange-600">Medium</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Data Points</span>
              <span className="font-semibold text-blue-600">127</span>
            </div>
            <div className="text-xs text-gray-500 text-center mt-4">
              Sample results from demo data
            </div>
          </div>
        </div>

        {/* Account Info Card */}
        <div className="bg-white rounded-lg border p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">👤</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Account Info</h3>
            <p className="text-gray-600 text-sm">
              Sign in to view your account details and processing history
            </p>
          </div>
          
          {/* Not signed in state */}
          <div className="space-y-4">
            <div className="text-center py-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-2">Not signed in</p>
              <p className="text-xs text-gray-400">Join 1,000+ users processing financial documents</p>
            </div>
            <button 
              onClick={() => navigate('/dashboard')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>

      {/* Demo Section */}
      <div id="demo-section" className="bg-gray-50 rounded-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Try Our Demo</h2>
          <p className="text-gray-600">
            Upload a sample document to see our OCR processing in action
          </p>
        </div>
        
        <FileUpload 
          isDemo={true}
          onUploadComplete={() => {
            alert('Demo Complete! 🎉\n\nExtracted Data:\n• Confidence Score: 94%\n• Risk Score: Medium\n• 127 data points processed\n\nReady to process your real documents?');
          }}
        />
      </div>
    </div>
  );
}
