import React, { useState, useEffect } from 'react';

export default function ServiceSelector({ initialData = [], onComplete, onBack }) {
  const [selectedServices, setSelectedServices] = useState([]);

  // YOUR ACTUAL 4 SERVICES
  const services = [
    {
      id: 'raw',
      name: 'Raw Data',
      description: 'Extract raw data exactly as it appears in documents',
      icon: '📄',
      price: 'Base service',
      required: true,
      details: 'Unprocessed extracted text and numbers from OCR scanning'
    },
    {
      id: 'summary',
      name: 'Summary Data',
      description: 'Organized and structured summary of key information',
      icon: '📋',
      price: '+$5 per document',
      required: false,
      details: 'Cleaned, categorized, and formatted data ready for analysis'
    },
    {
      id: 'confidence-score',
      name: 'Confidence Score',
      description: 'AI confidence rating for data extraction accuracy',
      icon: '🎯',
      price: '+$2 per document',
      required: false,
      details: 'Percentage score indicating how confident our AI is in the extracted data'
    },
    {
      id: 'risk-score',
      name: 'Risk Score',
      description: 'Financial risk assessment based on extracted data',
      icon: '⚠️',
      price: '+$10 per client',
      required: false,
      details: 'Low/Medium/High risk rating with supporting analysis'
    }
  ];

  // Load initial data - default to raw data
  useEffect(() => {
    if (initialData && initialData.length > 0) {
      setSelectedServices(initialData);
    } else {
      // Raw data is always selected by default
      setSelectedServices(['raw']);
    }
  }, [initialData]);

  const handleServiceToggle = (serviceId) => {
    setSelectedServices(prev => {
      // Raw data cannot be deselected
      if (serviceId === 'raw') {
        return prev.includes('raw') ? prev : [...prev, 'raw'];
      }
      
      if (prev.includes(serviceId)) {
        return prev.filter(id => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };

  const handleContinue = () => {
    // Raw data is required
    if (selectedServices.includes('raw')) {
      onComplete(selectedServices);
    }
  };

  const calculateEstimatedCost = () => {
    let baseCost = 15; // Base cost for raw data
    if (selectedServices.includes('summary')) baseCost += 5;
    if (selectedServices.includes('confidence-score')) baseCost += 2;
    if (selectedServices.includes('risk-score')) baseCost += 10;
    return baseCost;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Services Required</h2>
        <p className="text-gray-600 text-sm mt-1">
          Select the processing services you need for your financial documents
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {services.map((service) => (
          <div
            key={service.id}
            onClick={() => handleServiceToggle(service.id)}
            className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
              selectedServices.includes(service.id)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            } ${service.id === 'raw' ? 'ring-2 ring-green-200' : ''}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <span className="text-2xl mr-3">{service.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900 flex items-center">
                    {service.name}
                    {service.required && (
                      <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                        Required
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                </div>
              </div>
              {selectedServices.includes(service.id) && (
                <div className="text-blue-500 text-xl">✓</div>
              )}
            </div>

            <div className="mb-3">
              <span className={`text-sm font-medium ${
                service.price === 'Base service' ? 'text-green-600' : 'text-gray-900'
              }`}>
                {service.price}
              </span>
            </div>

            <div className="text-xs text-gray-500">
              {service.details}
            </div>

            {service.id === 'raw' && (
              <div className="mt-3 text-xs text-green-600 font-medium">
                ✓ Always included - cannot be deselected
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Service Summary */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-4">Service Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-sm text-gray-600 mb-2">Selected Services</div>
            <div className="text-2xl font-bold text-gray-900">{selectedServices.length}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-2">Estimated Cost per Document</div>
            <div className="text-2xl font-bold text-green-600">${calculateEstimatedCost()}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-2">Processing Time</div>
            <div className="text-2xl font-bold text-blue-600">
              {selectedServices.length <= 2 ? '5-10' : '10-15'} min
            </div>
          </div>
        </div>

        {/* Selected Services List */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600 mb-2">You will receive:</div>
          <ul className="text-sm text-gray-700 space-y-1">
            {selectedServices.map(serviceId => {
              const service = services.find(s => s.id === serviceId);
              return (
                <li key={serviceId} className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  {service?.name} - {service?.details}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t">
        <button
          onClick={onBack}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Back to Documents
        </button>
        
        <button
          onClick={handleContinue}
          className="btn-primary px-6 py-2 rounded-md"
        >
          Continue to Upload ({selectedServices.length} services)
        </button>
      </div>
    </div>
  );
}
