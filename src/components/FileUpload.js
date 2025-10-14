import React, { useState, useCallback } from 'react';
import { s3, BUCKET_NAME } from '../aws-config';

const FileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  // Handle file upload to S3
  const uploadToS3 = async (file) => {
    const fileName = `${Date.now()}-${file.name}`;
    
    const params = {
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: file,
      ContentType: file.type,
    };

    try {
      setUploading(true);
      
      const upload = s3.upload(params);
      
      // Track upload progress
      upload.on('httpUploadProgress', (progress) => {
        const percentage = Math.round((progress.loaded / progress.total) * 100);
        setUploadProgress(percentage);
      });

      const result = await upload.promise();
      
      setUploadedFiles(prev => [...prev, {
        name: file.name,
        size: file.size,
        url: result.Location,
        key: result.Key
      }]);
      
      setUploading(false);
      setUploadProgress(0);
      
      return result;
    } catch (error) {
      console.error('Upload failed:', error);
      setUploading(false);
      setUploadProgress(0);
      throw error;
    }
  };

  // Handle file selection
  const handleFiles = (files) => {
    Array.from(files).forEach(file => {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload PDF, JPG, or PNG files only');
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      
      uploadToS3(file);
    });
  };

  // Drag and drop handlers
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          <div className="text-6xl text-gray-400">📄</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Upload Financial Documents
            </h3>
            <p className="text-gray-600">
              Drag and drop files here, or click to select
            </p>
            <p className="text-sm text-gray-500">
              Supports PDF, JPG, PNG (max 10MB)
            </p>
          </div>
          
          <input
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
            id="file-upload"
          />
          
          <label
            htmlFor="file-upload"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
          >
            Select Files
          </label>
        </div>
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="mt-6 bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Uploading...</span>
            <span className="text-sm text-gray-500">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="mt-6 bg-white rounded-lg shadow">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Uploaded Files</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">📄</div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Process OCR
                  </button>
                  <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
