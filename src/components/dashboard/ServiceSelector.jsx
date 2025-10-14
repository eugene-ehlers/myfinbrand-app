import React, { useState, useEffect } from 'react';

export default function ServiceSelector({ initialData = [], onComplete, onBack }) {
  const [selectedServices, setSelectedServices] = useState([]);
  const [serviceOptions, setServiceOptions] = useState({});

  // Service categories with options
  const serviceCategories = [
    {
      id: 'data-extraction',
      name: 'Data Extraction',
      description: 'Extract structured data from documents',
      icon: '🔍',
      required: true,
      services: [
        {
          id: 'basic-extraction',
          name: 'Basic Data Extraction',
          description: 'Extract key financial figures (revenue, expenses, totals)',
          price: 'Included',
          default: true
        },
        {
          id: 'detailed-extraction',
          name: 'Detailed Line Items',
          description: 'Extract all line items and transaction details',
          price: '+$2 per document'
        },
        {
          id: 'custom-fields',
          name: 'Custom Field Extraction',
          description: 'Extract specific fields you define',
          price: '+$5 per document'
        }
      ]
    },
    {
      id: 'analysis',
      name: 'Financial Analysis',
      description: 'Analyze and interpret the extracted data',
      icon: '📊',
      required: false,
      services: [
        {
          id: 'ratio-analysis',
          name: 'Financial Ratios',
          description: 'Calculate key financial ratios and metrics',
          price: '+$10 per client'
        },
        {
          id: 'trend-analysis',
          name: 'Trend Analysis',
          description: 'Identify trends across multiple periods',
          price: '+$15 per client'
        },
        {
          id: 'benchmarking',
          name: 'Industry Benchmarking',
          description: 'Compare against industry standards',
          price: '+$20 per client'
        }
      ]
    },
    {
      id: 'validation',
      name: 'Data Validation',
      description: 'Verify accuracy and completeness',
      icon: '✅',
      required: false,
      services: [
        {
          id: 'accuracy-check',
          name: 'Accuracy Verification',
          description: 'Cross-check extracted data for errors',
          price: '+$3 per document'
        },
        {
          id: 'completeness-check',
          name: 'Completeness Check',
          description: 'Ensure all required fields are captured',
          price: '+$2 per document'
        },
        {
          id: 'consistency-check',
          name: 'Consistency Validation',
          description: 'Check for internal consistency across documents',
          price: '+$5 per client'
        }
      ]
    },
    {
      id: 'output',
      name: 'Output Formats',
      description: 'Choose how you receive the processed data',
      icon: '📤',
      required: true,
      services: [
        {
          id: 'json-output',
          name: 'JSON Format',
          description: 'Structured JSON data for API integration',
          price: 'Included',
          default: true
        },
        {
          id: 'excel-output',
          name: 'Excel Spreadsheet',
          description: 'Formatted Excel file with data and charts',
          price: '+$5 per client'
        },
        {
          id: 'pdf-report',
          name: 'PDF Report',
          description: 'Professional PDF report with analysis',
          price: '+$10 per client'
        },
        {
          id: 'api-webhook',
          name: 'API Webhook',
          description: 'Real-time data delivery to your system',
          price: '+$15 per client'
        }
      ]
    },
    {
      id: 'additional',
      name: 'Additional Services',
      description: 'Extra features and customizations',
      icon: '⚡',
      required: false,
      services: [
        {
          id: 'priority-processing',
          name: 'Priority Processing',
          description: 'Process documents within 1 hour',
          price: '+$25 per batch'
        },
        {
          id: 'data-retention',
          name: 'Extended Data Retention',
          description: 'Keep processed data for 2 years (vs 6 months)',
          price: '+$50 per year'
        },
        {
          id: 'custom-integration',
          name: 'Custom Integration',
          description: 'Custom API integration with your systems',
          price: 'Quote on request'
        }
      ]
    }
  ];

  // Load initial data
  useEffect(() => {
    if (initialData && initialData.length > 0) {
      setSelectedServices(initialData);
    } else {
      // Set default services
      const defaults = [];
      serviceCategories.forEach(category => {
        category.services.forEach(service => {
          if (service.default) {
            defaults.push(service.id);
          }
        });
      });
      setSelectedServices(defaults);
    }
  }, [initialData]);

  const handleServiceToggle = (serviceId) => {
    setSelectedServices(prev => {
      if (prev.includes(serviceId)) {
        return prev.filter(id => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };

  const handleOptionChange = (serviceId, option, value) => {
    setServiceOptions(prev => ({
      ...prev,
      [serviceId]: {
        ...prev[serviceId],
        [option]: value
      }
    }));
  };

  const handleContinue = () => {
    // Check if required categories have at least one service selected
    const requiredCategories = serviceCategories.filter(cat => cat.required);
    const hasRequiredServices = requiredCategories.every(category => 
      category.services.some(service => selectedServices.includes(service.id))
    );

    if (hasRequiredServices) {
      onComplete(selectedServices, serviceOptions);
    }
  };

  const getSelectedServicesCount = () => selectedServices.length;

  const calculateEstimatedCost = () => {
    // This is a simplified cost calculation for display
    const baseCost = 25; // Base cost per client
    const additionalCost = selectedServices.length * 5;
    return baseCost + additionalCost;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Services Required</h2>
        <p className="text-gray-600 text-sm mt-1">
          Select the services you need for processing your financial documents
        </p>
      </div>

      {/* Service Categories */}
      <div className="space-y-8">
        {serviceCategories.map((category) => (
          <div key={category.id} className="border rounded-lg p-6">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">{category.icon}</span>
              <div className="flex-1">
                <div className="flex items-center">
                  <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                  {category.required && (
                    <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                      Required
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{category.description}</p>
              </div>
            </div>

            {/* Services in Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {category.services.map((service) => (
                <div
                  key={service.id}
                  onClick={() => handleServiceToggle(service.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedServices.includes(service.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h4 className="font-medium text-gray-900">{service.name}</h4>
                        {selectedServices.includes(service.id) && (
                          <div className="ml-2 text-blue-500">✓</div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                      <div className="mt-2">
                        <span className={`text-sm font-medium ${
                          service.price === 'Included' ? 'text-green-600' : 'text-gray-900'
                        }`}>
                          {service.price}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Service Options (if selected) */}
                  {selectedServices.includes(service.id) && service.id === 'custom-fields' && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Custom Fields (comma-separated)
                      </label>
                      <input
                        type="text"
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => handleOptionChange(service.id, 'fields', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
                        placeholder="e.g., Invoice Number, Due Date, Tax Amount"
                      />
                    </div>
                  )}

                  {selectedServices.includes(service.id) && service.id === 'api-webhook' && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Webhook URL
                      </label>
                      <input
                        type="url"
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => handleOptionChange(service.id, 'webhook_url', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
                        placeholder="https://your-api.com/webhook"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Service Summary */}
      {selectedServices.length > 0 && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-4">Service Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-gray-600 mb-2">Selected Services</div>
              <div className="text-2xl font-bold text-gray-900">{getSelectedServicesCount()}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-2">Estimated Cost per Client</div>
              <div className="text-2xl font-bold text-green-600">${calculateEstimatedCost()}</div>
              <div className="text-xs text-gray-500">Base pricing, final cost may vary</div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t mt-8">
        <button
          onClick={onBack}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Back to Documents
        </button>
        
        <button
          onClick={handleContinue}
          disabled={selectedServices.length === 0}
          className="btn-primary px-6 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Upload ({getSelectedServicesCount()} services)
        </button>
      </div>

      {/* Validation Message */}
      {selectedServices.length === 0 && (
        <div className="mt-4 text-center text-sm text-gray-500">
          Select at least one service from required categories to continue
        </div>
      )}
    </div>
  );
}

