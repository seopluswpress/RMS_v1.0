import { useState } from 'react';
import { properties } from '../services/api';

const MaintenanceRequest = ({ onSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    maintainence_type: '',
    description: '',
    priority: 'Medium',
    property_id: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for the field being edited
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.maintainence_type) errors.maintainence_type = 'Maintenance type is required';
    if (!formData.description) errors.description = 'Description is required';
    if (!formData.property_id) errors.property_id = 'Property is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await properties.createmaintenence({
        ...formData,
        status: 'pending',
        maintainence_date: new Date().toISOString().split('T')[0]
      });
      
      if (onSuccess) onSuccess(response.data);
      if (onClose) onClose();
      
    } catch (err) {
      console.error('Error submitting maintenance request:', err);
      let errorMessage = 'Failed to submit maintenance request. Please try again.';
      
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data.detail) {
          errorMessage = err.response.data.detail;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data.non_field_errors) {
          errorMessage = err.response.data.non_field_errors.join(' ');
        } else if (typeof err.response.data === 'object') {
          const fieldErrors = Object.entries(err.response.data)
            .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`);
          errorMessage = fieldErrors.join('; ');
        }
      } else if (err.request) {
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        errorMessage = err.message || 'An unknown error occurred';
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Submit Maintenance Request</h2>
      
      {error && (
        <div className="bg-red-500 text-white px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Maintenance Type <span className="text-red-400">*</span>
          </label>
          <select
            name="maintainence_type"
            value={formData.maintainence_type}
            onChange={handleInputChange}
            className={`w-full bg-gray-800 text-white border px-3 py-2 rounded ${
              formErrors.maintainence_type ? 'border-red-500' : 'border-gray-700'
            }`}
            disabled={isSubmitting}
          >
            <option value="">Select type</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Electrical">Electrical</option>
            <option value="HVAC">HVAC</option>
            <option value="Appliance">Appliance</option>
            <option value="Structural">Structural</option>
            <option value="Pest">Pest Control</option>
            <option value="Other">Other</option>
          </select>
          {formErrors.maintainence_type && (
            <p className="text-red-400 text-sm mt-1">{formErrors.maintainence_type}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Description <span className="text-red-400">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className={`w-full bg-gray-800 text-white border px-3 py-2 rounded ${
              formErrors.description ? 'border-red-500' : 'border-gray-700'
            }`}
            disabled={isSubmitting}
            placeholder="Please describe the issue in detail..."
          />
          {formErrors.description && (
            <p className="text-red-400 text-sm mt-1">{formErrors.description}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Priority
          </label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            className="w-full bg-gray-800 text-white border border-gray-700 px-3 py-2 rounded"
            disabled={isSubmitting}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Emergency">Emergency</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Property ID <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            name="property_id"
            value={formData.property_id}
            onChange={handleInputChange}
            className={`w-full bg-gray-800 text-white border px-3 py-2 rounded ${
              formErrors.property_id ? 'border-red-500' : 'border-gray-700'
            }`}
            placeholder="Enter property ID"
            disabled={isSubmitting}
          />
          {formErrors.property_id && (
            <p className="text-red-400 text-sm mt-1">{formErrors.property_id}</p>
          )}
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-600 rounded hover:bg-gray-800 disabled:opacity-50"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MaintenanceRequest;