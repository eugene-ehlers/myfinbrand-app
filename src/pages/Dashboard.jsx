import React, { useState } from 'react';
import ClientForm from '../components/dashboard/ClientForm';
import DocumentSelector from '../components/dashboard/DocumentSelector';
import ServiceSelector from '../components/dashboard/ServiceSelector';
import FileUpload from '../components/dashboard/FileUpload';

export default function Dashboard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    client: {},
    documents: [],
    services: [],
    files: []
  });

  const steps = [
    { id: 1, name: 'Client Information', component: 'client' },
    { id: 2, name: 'Document Types', component: 'documents' },
    { id: 3, name: 'Services Required', component: 'services' },
    { id: 4, name: 'Upload & Process', component: 'upload' }
  ];

  const handleStepComplete = (stepData) => {
    setFormData(prev => ({ ...prev, ...stepData }));
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleStepBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleProcessComplete = () => {
    alert(`Processing Complete!\n\nClient: ${formData.client.name || 'N/A'}\nDocuments: ${formData.documents.length} types\nServices: ${formData.services.length} selected\n\n✅ Results saved to your account!`);
    
    // Reset form for next client
    setFormData({
      client: {},
      documents: [],
      services: [],
      files: []
    });
    setCurrentStep(1);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <ClientForm 
            initialData={formData.client}
            onComplete={(clientData) => handleStepComplete({ client: clientData })}
          />
        );
      case 2:
        return (
          <DocumentSelector 
            initialData={formData.documents}
            onComplete={(documents) => handleStepComplete({ documents })}
            onBack={handleStepBack}
          />
        );
      case 3:
        return (
          <ServiceSelector 
            initialData={formData.services}
            onComplete={(services) => handleStepComplete({ services })}
            onBack={handleStepBack}
          />
        );
      case 4:
        return (
          <FileUpload 
            onUploadComplete={handleProcessComplete}
            isDemo={false}
            clientInfo={formData.client}
            selectedDocuments={formData.documents}
            selectedServices={formData.services}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Financial OCR Processing</h1>
        <p className="text-gray-600 mt-2">Complete financial document analysis and data extraction</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                currentStep > step.id 
                  ? 'bg-green-500 text-white' 
                  : currentStep === step.id 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
              }`}>
                {currentStep > step.id ? '✓' : step.id}
              </div>
              <div className="ml-3">
                <div className={`text-sm font-medium ${
                  currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {step.name}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`mx-4 h-0.5 w-16 ${
                  currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Current Step Content */}
      <div className="bg-white rounded-lg border p-6">
        {renderStepContent()}
      </div>

      {/* Summary Panel (when on upload step) */}
      {currentStep === 4 && (
        <div className="mt-6 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Processing Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-medium text-gray-700">Client</div>
              <div className="text-gray-600">
                {formData.client.name || 'Not specified'}
                {formData.client.company && (
                  <div className="text-xs">{formData.client.company}</div>
                )}
              </div>
            </div>
            <div>
              <div className="font-medium text-gray-700">Document Types ({formData.documents.length})</div>
              <div className="text-gray-600">
                {formData.documents.length > 0 
                  ? formData.documents.join(', ')
                  : 'None selected'
                }
              </div>
            </div>
            <div>
              <div className="font-medium text-gray-700">Services ({formData.services.length})</div>
              <div className="text-gray-600">
                {formData.services.length > 0 
                  ? formData.services.join(', ')
                  : 'None selected'
                }
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-8 flex justify-between items-center text-sm text-gray-600">
        <div>
          Step {currentStep} of {steps.length}
        </div>
        <div className="flex space-x-4">
          <button 
            onClick={() => {
              setFormData({ client: {}, documents: [], services: [], files: [] });
              setCurrentStep(1);
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            Start Over
          </button>
          <button className="text-blue-600 hover:text-blue-800">
            Save Progress
          </button>
        </div>
      </div>
    </div>
  );
}
