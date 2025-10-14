import React, { useState, useEffect } from 'react';

export default function ClientForm({ initialData = {}, onComplete }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    abn: '',
    address: '',
    city: '',
    state: '',
    postcode: '',
    clientType: 'individual',
    ...initialData
  });

  const [errors, setErrors] = useState({});

  // Load initial data
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation (basic)
    const phoneRegex = /^[\d\s\-\+\(\)]{8,}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Business validation
    if (formData.clientType === 'business') {
      if (!formData.company.trim()) newErrors.company = 'Company name is required for business clients';
      if (!formData.abn.trim()) newErrors.abn = 'ABN is required for business clients';
      
      // ABN validation (basic - 11 digits)
      const abnRegex = /^\d{11}$/;
      if (formData.abn && !abnRegex.test(formData.abn.replace(/\s/g, ''))) {
        newErrors.abn = 'ABN must be 11 digits';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onComplete(formData);
    }
  };

  const formatABN = (value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format as XX XXX XXX XXX
    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
    if (digits.length <= 8) return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
    return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 11)}`;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Client Information</h2>
        <p className="text-gray-600 text-sm mt-1">Enter the client details for this financial assessment</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Client Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Client Type</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="clientType"
                value="individual"
                checked={formData.clientType === 'individual'}
                onChange={(e) => handleInputChange('clientType', e.target.value)}
                className="mr-2"
              />
              <span className="text-sm">Individual</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="clientType"
                value="business"
                checked={formData.clientType === 'business'}
                onChange={(e) => handleInputChange('clientType', e.target.value)}
                className="mr-2"
              />
              <span className="text-sm">Business</span>
            </label>
          </div>
        </div>

        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md bg-[rgb(var(--surface))] ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="John Smith"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md bg-[rgb(var(--surface))] ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="john@example.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md bg-[rgb(var(--surface))] ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0412 345 678"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>
        </div>

        {/* Business Information (conditional) */}
        {formData.clientType === 'business' && (
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Business Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md bg-[rgb(var(--surface))] ${
                    errors.company ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Acme Pty Ltd"
                />
                {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ABN *
                </label>
                <input
                  type="text"
                  value={formData.abn}
                  onChange={(e) => handleInputChange('abn', formatABN(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-md bg-[rgb(var(--surface))] ${
                    errors.abn ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="12 345 678 901"
                  maxLength="14"
                />
                {errors.abn && <p className="text-red-500 text-xs mt-1">{errors.abn}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Address Information */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Address (Optional)</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-[rgb(var(--surface))]"
                placeholder="123 Main Street"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-[rgb(var(--surface))]"
                  placeholder="Sydney"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <select
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-[rgb(var(--surface))]"
                >
                  <option value="">Select State</option>
                  <option value="NSW">NSW</option>
                  <option value="VIC">VIC</option>
                  <option value="QLD">QLD</option>
                  <option value="WA">WA</option>
                  <option value="SA">SA</option>
                  <option value="TAS">TAS</option>
                  <option value="ACT">ACT</option>
                  <option value="NT">NT</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Postcode</label>
                <input
                  type="text"
                  value={formData.postcode}
                  onChange={(e) => handleInputChange('postcode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-[rgb(var(--surface))]"
                  placeholder="2000"
                  maxLength="4"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-6 border-t">
          <button
            type="submit"
            className="btn-primary px-6 py-2 rounded-md"
          >
            Continue to Document Selection
          </button>
        </div>
      </form>
    </div>
  );
}
