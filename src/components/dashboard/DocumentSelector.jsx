import React, { useState, useEffect } from 'react';

export default function DocumentSelector({ initialData = [], onComplete, onBack }) {
  const [selectedDocuments, setSelectedDocuments] = useState([]);

  // YOUR ACTUAL DOCUMENT TYPES
  const documentTypes = [
    {
      id: 'payslip',
      name: 'Payslip',
      description: 'Employee payslip documents',
      icon: '💰',
      requiredFields: ['Name', 'Employer', 'Gross Income', 'Net Income'],
      popular: true
    },
    {
      id: 'individual-bank-statements',
      name: 'Individual Bank Statements',
      description: 'Personal bank account statements',
      icon: '🏦',
      requiredFields: ['Name', 'Account Balance', 'Transaction History'],
      popular: true
    },
    {
      id: 'business-bank-statements',
      name: 'Business Bank Statements',
      description: 'Business bank account statements',
      icon: '🏢',
      requiredFields: ['Business Name', 'Account Balance', 'Transaction History'],
      popular: true
    },
    {
      id: 'audited-financial-statements',
      name: 'Audited Financial Statements',
      description: 'Professionally audited financial reports',
      icon: '📊',
      requiredFields: ['Business Name', 'Revenue', 'Expenses', 'Assets', 'Liabilities'],
      popular: false
    },
    {
      id: 'unaudited-interim-statements',
      name: 'Unaudited Interim Statements',
      description: 'Internal financial statements (unaudited)',
      icon: '📈',
      requiredFields: ['Business Name', 'Revenue', 'Expenses', 'Assets', 'Liabilities'],
      popular: false
    }
  ];

  // Load initial data
  useEffect(() => {
    if (initialData && initialData.length > 0) {
      setSelectedDocuments(initialData);
    }
  }, [initialData]);

  const handleDocumentToggle = (documentId) => {
    setSelectedDocuments(prev => {
      if (prev.includes(documentId)) {
        return prev.filter(id => id !== documentId);
      } else {
        return [...prev, documentId];
      }
    });
  };

  const handleContinue = () => {
    if (selectedDocuments.length > 0) {
      onComplete(selectedDocuments);
    }
  };

  const popularDocuments = documentTypes.filter(doc => doc.popular);
  const otherDocuments = documentTypes.filter(doc => !doc.popular);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Document Types</h2>
        <p className="text-gray-600 text-sm mt-1">
          Select the types of financial documents you'll be processing
        </p>
      </div>

      {/* Popular Documents */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <span className="mr-2">⭐</span>
          Most Common
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {popularDocuments.map((doc) => (
            <div
              key={doc.id}
              onClick={() => handleDocumentToggle(doc.id)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedDocuments.includes(doc.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-start">
                <div className="text-2xl mr-3">{doc.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">{doc.name}</h4>
                    {selectedDocuments.includes(doc.id) && (
                      <div className="text-blue-500 text-xl">✓</div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                  <div className="mt-2">
                    <div className="text-xs text-gray-500">
                      <strong>Extracts:</strong> {doc.requiredFields.join(', ')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Other Documents */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Business Documents</h3>
        <div className="grid grid-cols-1 gap-4">
          {otherDocuments.map((doc) => (
            <div
              key={doc.id}
              onClick={() => handleDocumentToggle(doc.id)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedDocuments.includes(doc.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-start">
                <div className="text-2xl mr-3">{doc.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">{doc.name}</h4>
                    {selectedDocuments.includes(doc.id) && (
                      <div className="text-blue-500 text-xl">✓</div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                  <div className="mt-2">
                    <div className="text-xs text-gray-500">
                      <strong>Extracts:</strong> {doc.requiredFields.join(', ')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Summary */}
      {selectedDocuments.length > 0 && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-medium text-green-800 mb-2">
            Selected Documents ({selectedDocuments.length})
          </h4>
          <div className="text-sm text-green-700">
            {selectedDocuments.map(docId => {
              const docType = documentTypes.find(d => d.id === docId);
              return docType ? docType.name : docId;
            }).join(', ')}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t">
        <button
          onClick={onBack}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Back to Client Info
        </button>
        
        <button
          onClick={handleContinue}
          disabled={selectedDocuments.length === 0}
          className="btn-primary px-6 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Services ({selectedDocuments.length} selected)
        </button>
      </div>

      {/* Help Text */}
      {selectedDocuments.length === 0 && (
        <div className="mt-4 text-center text-sm text-gray-500">
          Select at least one document type to continue
        </div>
      )}
    </div>
  );
}
