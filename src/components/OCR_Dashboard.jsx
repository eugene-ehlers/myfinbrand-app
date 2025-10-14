import React, { useState } from 'react';

const OCRDashboard = () => {
  const [clientType, setClientType] = useState('consumer');
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [services, setServices] = useState({
    raw: false,
    summary: false,
    confidence: false,
    risk: false
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    // Consumer fields
    name: '',
    surname: '',
    initials: '',
    netIncome: '',
    employerName: '',
    
    // Commercial fields
    companyName: '',
    registrationNumber: '',
    companyType: '',
    industry: '',
    financialYearEnd: '',
    financialYearCovered: '',
    
    // Common fields
    bankName: '',
    accountNumber: '',
    accountType: '',
    referenceNumber: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDocumentChange = (docType, checked) => {
    if (checked) {
      setSelectedDocs(prev => [...prev, docType]);
    } else {
      setSelectedDocs(prev => prev.filter(doc => doc !== docType));
    }
  };

  const handleServiceChange = (service, checked) => {
    setServices(prev => ({ ...prev, [service]: checked }));
  };

  // File upload handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = () => {
    console.log('Form Data:', formData);
    console.log('Selected Documents:', selectedDocs);
    console.log('Selected Services:', services);
    console.log('Selected Files:', selectedFiles);
    // Add your submission logic here
  };

  // Check if payslips or bank statements are selected
  const hasPayslips = selectedDocs.includes('payslips');
  const hasBankStatements = selectedDocs.includes('bank-statements');
  const hasFinancials = selectedDocs.includes('audited-financials') || selectedDocs.includes('interim-financials');

  return (
    <div className="min-h-screen bg-[rgb(var(--bg))] font-['Inter'] p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[rgb(var(--ink))] mb-2">OCR Processing Dashboard</h1>
          <p className="text-[rgb(var(--ink-dim))]">Configure your document processing request</p>
        </div>

        {/* Client Type Selection */}
        <div className="bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-lg p-6">
          <h2 className="text-xl font-semibold text-[rgb(var(--ink))] mb-4">Client Type</h2>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="clientType"
                value="consumer"
                checked={clientType === 'consumer'}
                onChange={(e) => setClientType(e.target.value)}
                className="w-4 h-4 text-[rgb(var(--primary))]"
              />
              <span className="font-medium text-[rgb(var(--ink))]">👤 Consumer</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="clientType"
                value="commercial"
                checked={clientType === 'commercial'}
                onChange={(e) => setClientType(e.target.value)}
                className="w-4 h-4 text-[rgb(var(--primary))]"
              />
              <span className="font-medium text-[rgb(var(--ink))]">🏢 Commercial</span>
            </label>
          </div>
        </div>

        {/* Client Information */}
        <div className="bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-lg p-6">
          <h2 className="text-xl font-semibold text-[rgb(var(--ink))] mb-4">Client Information</h2>
          
          {clientType === 'consumer' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[rgb(var(--ink))] mb-2">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-[rgb(var(--border))] rounded-lg focus:ring-2 focus:ring-[rgb(var(--primary))] focus:border-transparent"
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[rgb(var(--ink))] mb-2">Surname *</label>
                <input
                  type="text"
                  value={formData.surname}
                  onChange={(e) => handleInputChange('surname', e.target.value)}
                  className="w-full px-3 py-2 border border-[rgb(var(--border))] rounded-lg focus:ring-2 focus:ring-[rgb(var(--primary))] focus:border-transparent"
                  placeholder="Enter surname"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[rgb(var(--ink))] mb-2">Initials *</label>
                <input
                  type="text"
                  value={formData.initials}
                  onChange={(e) => handleInputChange('initials', e.target.value)}
                  className="w-full px-3 py-2 border border-[rgb(var(--border))] rounded-lg focus:ring-2 focus:ring-[rgb(var(--primary))] focus:border-transparent"
                  placeholder="e.g., J.D."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[rgb(var(--ink))] mb-2">Net Income *</label>
                <input
                  type="number"
                  value={formData.netIncome}
                  onChange={(e) => handleInputChange('netIncome', e.target.value)}
                  className="w-full px-3 py-2 border border-[rgb(var(--border))] rounded-lg focus:ring-2 focus:ring-[rgb(var(--primary))] focus:border-transparent"
                  placeholder="Monthly net income"
                />
              </div>
              
              {/* Conditional Consumer Fields */}
              {hasPayslips && (
                <div>
                  <label className="block text-sm font-medium text-[rgb(var(--ink))] mb-2">Employer Name *</label>
                  <input
                    type="text"
                    value={formData.employerName}
                    onChange={(e) => handleInputChange('employerName', e.target.value)}
                    className="w-full px-3 py-2 border border-[rgb(var(--border))] rounded-lg focus:ring-2 focus:ring-[rgb(var(--primary))] focus:border-transparent"
                    placeholder="Current employer"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[rgb(var(--ink))] mb-2">Company Name *</label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  className="w-full px-3 py-2 border border-[rgb(var(--border))] rounded-lg focus:ring-2 focus:ring-[rgb(var(--primary))] focus:border-transparent"
                  placeholder="Company legal name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[rgb(var(--ink))] mb-2">Registration Number *</label>
                <input
                  type="text"
                  value={formData.registrationNumber}
                  onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-[rgb(var(--border))] rounded-lg focus:ring-2 focus:ring-[rgb(var(--primary))] focus:border-transparent"
                  placeholder="Company registration number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[rgb(var(--ink))] mb-2">Company Type *</label>
                <select
                  value={formData.companyType}
                  onChange={(e) => handleInputChange('companyType', e.target.value)}
                  className="w-full px-3 py-2 border border-[rgb(var(--border))] rounded-lg focus:ring-2 focus:ring-[rgb(var(--primary))] focus:border-transparent"
                >
                  <option value="">Select company type</option>
                  <option value="pty-ltd">Pty Ltd</option>
                  <option value="public-company">Public Company</option>
                  <option value="close-corporation">Close Corporation</option>
                  <option value="trust">Trust</option>
                  <option value="partnership">Partnership</option>
                  <option value="sole-proprietor">Sole Proprietor</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[rgb(var(--ink))] mb-2">Industry *</label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                  className="w-full px-3 py-2 border border-[rgb(var(--border))] rounded-lg focus:ring-2 focus:ring-[rgb(var(--primary))] focus:border-transparent"
                  placeholder="Primary industry"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[rgb(var(--ink))] mb-2">Financial Year End *</label>
                <input
                  type="date"
                  value={formData.financialYearEnd}
                  onChange={(e) => handleInputChange('financialYearEnd', e.target.value)}
                  className="w-full px-3 py-2 border border-[rgb(var(--border))] rounded-lg focus:ring-2 focus:ring-[rgb(var(--primary))] focus:border-transparent"
                />
              </div>
              
              {/* Conditional Commercial Fields */}
              {hasFinancials && (
                <div>
                  <label className="block text-sm font-medium text-[rgb(var(--ink))] mb-2">Financial Year Covered *</label>
                  <input
                    type="date"
                    value={formData.financialYearCovered}
                    onChange={(e) => handleInputChange('financialYearCovered', e.target.value)}
                    className="w-full px-3 py-2 border border-[rgb(var(--border))] rounded-lg focus:ring-2 focus:ring-[rgb(var(--primary))] focus:border-transparent"
                  />
                </div>
              )}
            </div>
          )}

          {/* Common Bank Fields */}
          {hasBankStatements && (
            <div className="mt-6 pt-6 border-t border-[rgb(var(--border))]">
              <h3 className="text-lg font-medium text-[rgb(var(--ink))] mb-4">Banking Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[rgb(var(--ink))] mb-2">Bank Name *</label>
                  <input
                    type="text"
                    value={formData.bankName}
                    onChange={(e) => handleInputChange('bankName', e.target.value)}
                    className="w-full px-3 py-2 border border-[rgb(var(--border))] rounded-lg focus:ring-2 focus:ring-[rgb(var(--primary))] focus:border-transparent"
                    placeholder="Bank name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[rgb(var(--ink))] mb-2">Account Number *</label>
                  <input
                    type="text"
                    value={formData.accountNumber}
                    onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-[rgb(var(--border))] rounded-lg focus:ring-2 focus:ring-[rgb(var(--primary))] focus:border-transparent"
                    placeholder="Account number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[rgb(var(--ink))] mb-2">Account Type *</label>
                  <select
                    value={formData.accountType}
                    onChange={(e) => handleInputChange('accountType', e.target.value)}
                    className="w-full px-3 py-2 border border-[rgb(var(--border))] rounded-lg focus:ring-2 focus:ring-[rgb(var(--primary))] focus:border-transparent"
                  >
                    <option value="">Select account type</option>
                    <option value="current">Current Account</option>
                    <option value="savings">Savings Account</option>
                    <option value="business">Business Account</option>
                    <option value="credit">Credit Account</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Reference Number */}
          <div className="mt-6 pt-6 border-t border-[rgb(var(--border))]">
            <div className="w-full md:w-1/2">
              <label className="block text-sm font-medium text-[rgb(var(--ink))] mb-2">Reference Number</label>
              <input
                type="text"
                value={formData.referenceNumber}
                onChange={(e) => handleInputChange('referenceNumber', e.target.value)}
                className="w-full px-3 py-2 border border-[rgb(var(--border))] rounded-lg focus:ring-2 focus:ring-[rgb(var(--primary))] focus:border-transparent"
                placeholder="Optional reference number"
              />
            </div>
          </div>
        </div>

        {/* Document Type Selection */}
        <div className="bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-lg p-6">
          <h2 className="text-xl font-semibold text-[rgb(var(--ink))] mb-4">Document Types</h2>
          
          {clientType === 'consumer' ? (
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedDocs.includes('payslips')}
                  onChange={(e) => handleDocumentChange('payslips', e.target.checked)}
                  className="w-4 h-4 text-[rgb(var(--primary))] rounded"
                />
                <div>
                  <span className="font-medium text-[rgb(var(--ink))]">💰 Payslips</span>
                  <p className="text-sm text-[rgb(var(--ink-dim))]">Monthly salary statements</p>
                </div>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedDocs.includes('bank-statements')}
                  onChange={(e) => handleDocumentChange('bank-statements', e.target.checked)}
                  className="w-4 h-4 text-[rgb(var(--primary))] rounded"
                />
                <div>
                  <span className="font-medium text-[rgb(var(--ink))]">🏦 Bank Statements</span>
                  <p className="text-sm text-[rgb(var(--ink-dim))]">Personal banking records</p>
                </div>
              </label>
            </div>
          ) : (
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedDocs.includes('bank-statements')}
                  onChange={(e) => handleDocumentChange('bank-statements', e.target.checked)}
                  className="w-4 h-4 text-[rgb(var(--primary))] rounded"
                />
                <div>
                  <span className="font-medium text-[rgb(var(--ink))]">🏦 Bank Statements</span>
                  <p className="text-sm text-[rgb(var(--ink-dim))]">Business banking records</p>
                </div>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedDocs.includes('audited-financials')}
                  onChange={(e) => handleDocumentChange('audited-financials', e.target.checked)}
                  className="w-4 h-4 text-[rgb(var(--primary))] rounded"
                />
                <div>
                  <span className="font-medium text-[rgb(var(--ink))]">📊 Audited Financial Statements</span>
                  <p className="text-sm text-[rgb(var(--ink-dim))]">Full year audited financials</p>
                </div>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedDocs.includes('interim-financials')}
                  onChange={(e) => handleDocumentChange('interim-financials', e.target.checked)}
                  className="w-4 h-4 text-[rgb(var(--primary))] rounded"
                />
                <div>
                  <span className="font-medium text-[rgb(var(--ink))]">📈 Unaudited Interim Financial Statements</span>
                  <p className="text-sm text-[rgb(var(--ink-dim))]">Interim management accounts</p>
                </div>
              </label>
            </div>
          )}
        </div>

        {/* Service Level Selection */}
        <div className="bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-lg p-6">
          <h2 className="text-xl font-semibold text-[rgb(var(--ink))] mb-4">Analysis Services</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-[rgb(var(--ink))] mb-3">Data Extraction</h3>
              <div className="space-y-3">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={services.raw}
                    onChange={(e) => handleServiceChange('raw', e.target.checked)}
                    className="w-4 h-4 text-[rgb(var(--primary))] rounded mt-1"
                  />
                  <div>
                    <span className="font-medium text-[rgb(var(--ink))]">📋 Raw OCR Results</span>
                    <p className="text-sm text-[rgb(var(--ink-dim))]">Basic text extraction & structured data</p>
                  </div>
                </label>
                
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={services.summary}
                    onChange={(e) => handleServiceChange('summary', e.target.checked)}
                    className="w-4 h-4 text-[rgb(var(--primary))] rounded mt-1"
                  />
                  <div>
                    <span className="font-medium text-[rgb(var(--ink))]">📊 Summary Analysis</span>
                    <p className="text-sm text-[rgb(var(--ink-dim))]">Categorized income/expenses, key metrics & ratios</p>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-[rgb(var(--ink))] mb-3">Quality & Risk Assessment</h3>
              <div className="space-y-3">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={services.confidence}
                    onChange={(e) => handleServiceChange('confidence', e.target.checked)}
                    className="w-4 h-4 text-[rgb(var(--primary))] rounded mt-1"
                  />
                  <div>
                    <span className="font-medium text-[rgb(var(--ink))]">🎯 Confidence Scoring</span>
                    <p className="text-sm text-[rgb(var(--ink-dim))]">OCR accuracy & data validation confidence</p>
                  </div>
                </label>
                
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={services.risk}
                    onChange={(e) => handleServiceChange('risk', e.target.checked)}
                    className="w-4 h-4 text-[rgb(var(--primary))] rounded mt-1"
                  />
                  <div>
                    <span className="font-medium text-[rgb(var(--ink))]">⚠️ Risk Assessment</span>
                    <p className="text-sm text-[rgb(var(--ink-dim))]">Cross-document validation & consistency checks</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* File Upload Section */}
        <div className="bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-[rgb(var(--border))]">
            <h3 className="text-lg font-semibold text-[rgb(var(--ink))]">Document Upload</h3>
            <p className="text-sm text-[rgb(var(--ink-dim))] mt-1">
              Upload your financial documents for OCR processing
            </p>
          </div>

          <div className="p-6">
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-[rgb(var(--primary))] bg-[rgb(var(--primary))]/5'
                  : 'border-[rgb(var(--border))] hover:border-[rgb(var(--primary))]/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept=".pdf,.jpg,.jpeg,.png"
              />
              
              <div className="space-y-4">
                <div className="w-12 h-12 mx-auto bg-[rgb(var(--accent))]/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-[rgb(var(--accent))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                
                <div>
                  <p className="text-[rgb(var(--ink))] font-medium">
                    Choose files or drag and drop
                  </p>
                  <p className="text-sm text-[rgb(var(--ink-dim))] mt-1">
                    PDF, JPG, PNG up to 10MB each
                  </p>
                </div>
              </div>
            </div>

            {selectedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium text-[rgb(var(--ink))]">Selected Files:</h4>
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-[rgb(var(--surface-2))] rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-[rgb(var(--primary))]/10 rounded flex items-center justify-center">
                        <svg className="w-4 h-4 text-[rgb(var(--primary))]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[rgb(var(--ink))]">{file.name}</p>
                        <p className="text-xs text-[rgb(var(--ink-dim))]">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== index))}
                      className="text-[rgb(var(--ink-dim))] hover:text-[rgb(var(--primary))] transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="px-6 py-4 bg-[rgb(var(--surface-2))] border-t border-[rgb(var(--border))] rounded-b-lg flex justify-end space-x-3">
            <button
              onClick={() => {
                setSelectedFiles([]);
                setFormData({
                  name: '', surname: '', initials: '', netIncome: '', employerName: '',
                  companyName: '', registrationNumber: '', companyType: '', industry: '',
                  financialYearEnd: '', financialYearCovered: '', bankName: '',
                  accountNumber: '', accountType: '', referenceNumber: ''
                });
                setSelectedDocs([]);
                setServices({ raw: false, summary: false, confidence: false, risk: false });
              }}
              className="px-4 py-2 text-sm font-medium text-[rgb(var(--ink-dim))] hover:text-[rgb(var(--ink))] transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={handleSubmit}
              disabled={selectedFiles.length === 0 || selectedDocs.length === 0}
              className="px-6 py-2 bg-[rgb(var(--primary))] text-[rgb(var(--primary-fg))] text-sm font-medium rounded-lg hover:bg-[rgb(var(--primary))]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              🚀 Process OCR Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OCRDashboard;
