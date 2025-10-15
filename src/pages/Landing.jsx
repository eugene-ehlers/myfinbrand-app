import React from 'react';

export default function Landing({ onUpgrade }) {
  const handleGetStarted = () => {
    // Use the onUpgrade function passed from App.js
    onUpgrade();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-blue-600">MyFinBrand</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your trusted partner for professional financial document processing and business services
          </p>
          <button 
            onClick={handleGetStarted}
            className="btn-primary text-lg px-8 py-3"
          >
            Get Started Today
          </button>
        </div>

        {/* Account Info Card */}
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 mb-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p><strong>Business:</strong> MyFinBrand Services</p>
            <p><strong>Contact:</strong> info@myfinbrand.com</p>
            <p><strong>Phone:</strong> +1 (555) 123-4567</p>
            <p><strong>Status:</strong> <span className="text-green-600 font-medium">Active</span></p>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-blue-600 text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">Financial Analysis</h3>
            <p className="text-gray-600">Professional financial document review and analysis</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-blue-600 text-4xl mb-4">📋</div>
            <h3 className="text-xl font-semibtml mb-2">Document Processing</h3>
            <p className="text-gray-600">Secure handling of your important business documents</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-blue-600 text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-semibold mb-2">Business Consulting</h3>
            <p className="text-gray-600">Expert guidance for your business growth</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-gray-600 mb-6">Join thousands of satisfied clients</p>
          <button 
            onClick={handleGetStarted}
            className="btn-primary text-lg px-8 py-3"
          >
            Access Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
