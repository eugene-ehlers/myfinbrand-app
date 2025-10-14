import React, { useState, useEffect } from 'react';

export default function DocumentSelector({ initialData = [], onComplete, onBack }) {
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [customDocument, setCustomDocument] = useState('');

  // Document types with descriptions
  const documentTypes = [
    {
      id: 'bank-statements',
      name: 'Bank Statements',
      description: 'Personal or business bank account statements',
      icon: '🏦',
      popular: true
    },
    {
      id: 'profit-loss',
      name: 'Profit & Loss Statement',
      description: 'Business income and expense summary',
      icon: '📊',
      popular: true
    },
    {
      id: 'balance-sheet',
      name: 'Balance Sheet',
      description: 'Assets, liabilities, and equity statement',
      icon: '⚖️',
      popular: true
    },
    {
      id: 'tax-return',
      name: 'Tax Returns',
      description: 'Individual or business tax returns',
      icon: '📋',
      popular: true
    },
    {
      id: 'payslips',
      name: 'Payslips',
      description: 'Employee salary and wage statements',
      icon: '💰',
      popular: false
    },
    {
      id: 'invoices',
      name: 'Invoices',
      description: 'Sales invoices and billing documents',
      icon: '🧾',
      popular: false
    },
    {
      id: 'receipts',
      name: 'Receipts',
      description: 'Purchase receipts and expense records',
      icon: '🧾',
      popular: false
    },
    {
      id: 'cash-flow',
      name: 'Cash Flow Statement',
      description: 'Cash inflows and outflows analysis',
      icon: '💸',
      popular: false
    },
    {
      id: 'trial-balance',
      name: 'Trial Balance',
      description: 'Accounting trial balance reports',
      icon: '📈',
      popular: false
    },
    {
      id: 'aged-debtors',
      name: 'Aged Debtors Report',
      description: 'Outstanding customer payments analysis',
      icon: '📅',
      popular: false
    },
    {
      id: 'aged-creditors',
      name: 'Aged Creditors Report',
      description: 'Outstanding supplier payments analysis',
      icon: '📆',
      popular: false
    },
    {
      id: 'loan-statements',
      name: 'Loan Statements',
      description: 'Business or personal loan documents',
      icon: '🏛️',
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

  const handleAddCustomDocument = () => {
    if (customDocument.trim() && !selectedDocuments.includes(customDocument.trim())) {
      setSelectedDocuments(prev => [...prev, customDocument.trim()]);
      setCustomDocument('');
    }
  };

  const handleRemoveCustomDocument = (docName) => {
    setSelectedDocuments(prev => prev.filter(doc => doc !== docName));
  };

  const handleContinue = () => {
    if (selectedDocuments.length > 0) {
      onComplete(selectedDocuments);
    }
  };

  const popularDocuments = documentTypes.filter(doc => doc.popular);
  const otherDocuments = documentTypes.filter(doc => !doc.popular);
  const customDocuments = selectedDocuments.filter(doc => 
    !documentTypes.some(type => type.id === doc)
  );

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
          Most Popular
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Other Documents */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Other Document Types</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {otherDocuments.map((doc) => (
            <div
              key={doc.id}
              onClick={() => handleDocumentToggle(doc.id)}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                selectedDocuments.includes(doc.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center">
                <div className="text-lg mr-2">{doc.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{doc.name}</span>
                    {selectedDocuments.includes(doc.id) && (
                      <div className="text-blue-500">✓</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Document Input */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Add Custom Document Type</h3>
        <div className="flex space-x-3">
          <input
            type="text"
            value={customDocument}
            onChange={(e) => setCustomDocument(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddCustomDocument()}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-[rgb(var(--surface))]"
            placeholder="Enter custom document type..."
          />
          <button
            onClick={handleAddCustomDocument}
            disabled={!customDocument.trim()}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
      </div>

      {/* Custom Documents List */}
      {customDocuments.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Custom Documents</h3>
          <div className="space-y-2">
            {customDocuments.map((doc, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  <span className="text-lg mr-2">📄</span>
                  <span className="font-medium text-gray-900">{doc}</span>
                </div>
                <button
                  onClick={() => handleRemoveCustomDocument(doc)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

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

