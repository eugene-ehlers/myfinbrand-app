import React, { useState } from 'react';

const FileUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);

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

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleDownload = () => {
    // Add download logic here
    console.log('Download clicked');
  };

  const handleCancel = () => {
    setSelectedFiles([]);
  };

  return (
    <div className="bg-[rgb(var(--surface))] border border-[rgb(var(--border))] rounded-lg shadow-sm">
      {/* Card Header */}
      <div className="px-6 py-4 border-b border-[rgb(var(--border))]">
        <h3 className="text-lg font-semibold text-[rgb(var(--ink))]">
          Document Upload
        </h3>
        <p className="text-sm text-[rgb(var(--ink-dim))] mt-1">
          Upload financial documents for OCR processing
        </p>
      </div>

      {/* Card Body - Upload Area */}
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
            onChange={handleChange}
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
                PDF, JPG, PNG up to 10MB
              </p>
            </div>
          </div>
        </div>

        {/* Selected Files */}
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
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Card Actions */}
      <div className="px-6 py-4 bg-[rgb(var(--surface-2))] border-t border-[rgb(var(--border))] rounded-b-lg flex justify-end space-x-3">
        <button
          onClick={handleCancel}
          className="px-4 py-2 text-sm font-medium text-[rgb(var(--ink-dim))] hover:text-[rgb(var(--ink))] transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleDownload}
          disabled={selectedFiles.length === 0}
          className="px-4 py-2 bg-[rgb(var(--primary))] text-[rgb(var(--primary-fg))] text-sm font-medium rounded-lg hover:bg-[rgb(var(--primary))]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Process Files
        </button>
      </div>
    </div>
  );
};

export default FileUpload;

