import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientForm from '../components/dashboard/ClientForm';
import DocumentSelector from '../components/dashboard/DocumentSelector';
import ServiceSelector from '../components/dashboard/ServiceSelector';
import FileUpload from '../components/dashboard/FileUpload';

export default function Dashboard() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    client: {},
    documents: [],
    services: [],
    files: []
  });

  const steps = [
    { number: 1, name: 'Client Information', component: 'client' },
    { number: 2, name: 'Document Types', component: 'documents' },
    { number: 3, name: 'Services Required', component: 'services' },
    { number: 4, name: 'Upload Documents', component: 'upload' }
  ];

  const handleStepComplete = (step, data) => {
    setFormData(prev => ({ ...prev, [step]: data }));
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStartOver = () => {
    setCurrentStep(1);
    setFormData({
      client: {},
      documents: [],
      services: [],
      files: []
    });
  };

  const handleBackToLanding = () => {
    navigate('/');
  };

  const handleSave = () => {
    // In real app, this would save to database
    console.log('Saving data:', formData);
    alert('Data saved successfully! 💾\n\nIn the full version, this would save to your database.');
  };

  const handleFinalSubmit = (files) => {
    const finalData = { ...formData, files };
    console.log('Final submission:', finalData);
    
    // Simulate processing
    alert(`🎉 Processing Complete!\n\nClient: ${finalData.client.name}\nDocuments: ${finalData.documents.length} types\nServices: ${finalData.services.length} selected\nFiles: ${files.length} uploaded\n\nResults would appear here in the full version!`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header with Back to Landing */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Document Processing</h1>
          <p className="text-gray-600">Complete the steps below to process your documents</p>
        </div>
        <button
          onClick={handleBackToLanding}
          className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          ← Back to Home
        </button>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                currentStep >= step.number 
                  ? 'bg-blue-500 border-blue-500 text-white' 
                  : 'border-gray-300 text-gray-500'
              }`}>
                {currentStep > step.number ? '✓' : step.number}
              </div>
              <div className="ml-3">
                <div className={`text-sm font-medium ${
                  currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {step.name}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 ${
                  currentStep > step.number ? 'bg-blue-500' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg border p-8 mb-6">
        {currentStep === 1 && (
          <ClientForm
            initialData={formData.client}
            onComplete={(data) => handleStepComplete('client', data)}
          />
        )}

        {currentStep === 2 && (
          <DocumentSelector
            initialData={formData.documents}
            onComplete={(data) => handleStepComplete('documents', data)}
            onBack={handleBack}
          />
        )}

        {currentStep === 3 && (
          <ServiceSelector
            initialData={formData.services}
            onComplete={(data) => handleStepComplete('services', data)}
            onBack={handleBack}
          />
        )}

        {currentStep === 4 && (
          <FileUpload
            initialData={formData.files}
            onComplete={handleFinalSubmit}
            onBack={handleBack}
            selectedDocuments={formData.documents}
            selectedServices={formData.services}
          />
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={handleStartOver}
          className="px-4 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md"
        >
          🔄 Start Over
        </button>

        <div className="flex space-x-3">
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            💾 Save Progress
          </button>
          
          {currentStep > 1 && (
            <button
              onClick={handleBack}
              className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              ← Previous Step
            </button>
          )}
        </div>
      </div>

      {/* Debug Info (remove in production) */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg text-xs text-gray-600">
        <strong>Debug Info:</strong> Step {currentStep}/4 | 
        Client: {Object.keys(formData.client).length > 0 ? '✓' : '○'} | 
        Documents: {formData.documents.length} | 
        Services: {formData.services.length} | 
        Files: {formData.files.length}
      </div>
    </div>
  );
}
