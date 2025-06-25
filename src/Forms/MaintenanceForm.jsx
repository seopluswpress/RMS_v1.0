import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { properties } from '../services/api';

const MaintenanceForm = ({ onClose, onMaintenanceAdded, editData, onUpdate }) => {
  const [formData, setFormData] = useState(editData ? {
    maintainence_type: editData.maintainence_type || '',
    maintainence_date: editData.maintainence_date ? new Date(editData.maintainence_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    maintainence_cost: editData.maintainence_cost || '',
    priority: editData.priority || 'Medium',
    status: editData.status || 'pending',
    description: editData.description || '',
    property_id: editData.property_id || ''
  } : {
    maintainence_type: '',
    maintainence_date: new Date().toISOString().split('T')[0],
    maintainence_cost: '',
    priority: 'Medium',
    status: 'pending',
    description: '',
    property_id: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState('');
  const [isloading, setIsLoading] = useState(false);
  const [propertiesList, setPropertiesList] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare the data in the correct format for the API
    const submitData = {
      maintainence_type: formData.maintainence_type,
      maintainence_date: formData.maintainence_date,
      maintainence_cost: parseFloat(formData.maintainence_cost) || 0, // Ensure it's a number
      priority: formData.priority,
      status: formData.status,
      description: formData.description,
      property: formData.property_id, // This should match the backend field name
      property_id: formData.property_id // Include both for compatibility
    };
    
    console.log('Form data before submission:', formData);
    console.log('Prepared submit data:', submitData);
    
    // Validate form
    const errors = {};
    if (!submitData.maintainence_type) errors.maintainence_type = 'Maintenance type is required';
    if (!submitData.description) errors.description = 'Description is required';
    if (!submitData.maintainence_date) errors.maintainence_date = 'Date is required';
    if (!submitData.property) errors.property_id = 'Property is required';
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    try {
      console.log('Submitting maintenance data:', submitData);
      
      if (editData && (editData.id || editData.maintainence_id)) {
        // Update existing maintenance
        const maintenanceId = editData.id || editData.maintainence_id;
        console.log('Updating maintenance with ID:', maintenanceId, 'Data:', submitData);
        try {
          const response = await properties.updatemaintainence(maintenanceId, submitData);
          console.log('Update response:', response);
          
          if (onUpdate) {
            onUpdate(maintenanceId, response.data);
          }
        } catch (error) {
          console.error('Update error:', error);
          throw error; // Re-throw to be caught by the outer try-catch
        }
        onClose();
      } else {
        // Create new maintenance
        console.log('Creating new maintenance with data:', submitData);
        try {
          const response = await properties.createmaintainence(submitData);
          console.log('Create response:', response);
          
          if (onMaintenanceAdded) {
            onMaintenanceAdded(response.data);
          }
        } catch (error) {
          console.error('Create error:', error);
          throw error; // Re-throw to be caught by the outer try-catch
        }
        onClose();
      }
    } catch (err) {
      console.error('Error saving maintenance:', err);
      console.error('Error response:', err.response);
      
      let errorMessage = 'Failed to save maintenance. Please try again.';
      
      // Handle different error response formats
      if (err.response) {
        if (err.response.data) {
          if (typeof err.response.data === 'string') {
            errorMessage = err.response.data;
          } else if (err.response.data.detail) {
            errorMessage = err.response.data.detail;
          } else if (err.response.data.message) {
            errorMessage = err.response.data.message;
          } else if (err.response.data.non_field_errors) {
            errorMessage = err.response.data.non_field_errors.join(' ');
          } else if (typeof err.response.data === 'object') {
            // Handle field-specific errors
            const fieldErrors = [];
            Object.entries(err.response.data).forEach(([field, errors]) => {
              if (Array.isArray(errors)) {
                fieldErrors.push(`${field}: ${errors.join(', ')}`);
              } else {
                fieldErrors.push(`${field}: ${errors}`);
              }
            });
            errorMessage = fieldErrors.join('; ');
          }
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

  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      try {
        const response = await properties.getProperties();
        setPropertiesList(response.data.data);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('Failed to load properties');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (isloading) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <div className="bg-gray-900 text-white shadow p-4 rounded">
          Loading properties...
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 text-white w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center px-4 py-2 border-b border-gray-700" style={{marginBottom:0, paddingBottom:0}}>
          <h6 className="text-lg font-semibold mb-0">
            {editData ? 'Edit Maintenance Request' : 'Create Maintenance Request'}
          </h6>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
            disabled={isSubmitting}
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {error && (
  <div className="bg-red-500 text-white px-4 py-2 mx-4 mt-2 mb-2 rounded" style={{marginTop: '0.5rem', marginBottom: '0.5rem', paddingTop: 0, paddingBottom: 0}}>
    {error}
  </div>
)}
<form onSubmit={handleSubmit} style={{marginTop: 0, paddingTop: 0}} className="mt-0 pt-0">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-0 pt-0" style={{marginTop: 0, paddingTop: 0}}>
    <div className="col-12 mt-0 pt-0" style={{marginTop: 0, paddingTop: 0}}>
      <label className="form-label mb-1" style={{marginBottom: '0.25rem'}} >
    Maintenance Type <span className="text-danger">*</span>
  </label>
  <select
    name="maintainence_type"
    value={formData.maintainence_type}
    onChange={handleInputChange}
    className={`form-select${formErrors.maintainence_type ? ' is-invalid' : ''}`}
    disabled={isSubmitting}
  >
    <option value="">Select category</option>
    <option value="Plumbing">Plumbing</option>
    <option value="Electrical">Electrical</option>
    <option value="HVAC">HVAC</option>
    <option value="Appliance">Appliance</option>
    <option value="Structural">Structural</option>
    <option value="Pest">Pest</option>
    <option value="Landscaping">Landscaping</option>
    <option value="Janitorial">Janitorial</option>
    <option value="Safety">Safety</option>
    <option value="Preventive">Preventive</option>
    <option value="Renovation">Renovation</option>
    <option value="Emergency">Emergency</option>
  </select>
  {formErrors.maintainence_type && (
    <div className="invalid-feedback d-block">{formErrors.maintainence_type}</div>
  )}
</div>
            <div className="col-12">
              <label className="form-label">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={`form-control${formErrors.description ? ' is-invalid' : ''}`}
                disabled={isSubmitting}
                rows={2}
              />
              {formErrors.description && (
                <div className="invalid-feedback d-block">{formErrors.description}</div>
              )}
            </div>
            <div className="col-md-6">
              <label className="form-label">Priority *</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="form-select"
                disabled={isSubmitting}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label">Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="form-select"
                disabled={isSubmitting}
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label">Maintenance Date *</label>
              <input
                type="date"
                name="maintainence_date"
                value={formData.maintainence_date}
                onChange={handleInputChange}
                className={`form-control${formErrors.maintainence_date ? ' is-invalid' : ''}`}
                disabled={isSubmitting}
              />
              {formErrors.maintainence_date && (
                <div className="invalid-feedback d-block">{formErrors.maintainence_date}</div>
              )}
            </div>
            <div className="col-md-6">
              <label className="form-label">Property *</label>
              <select
                name="property_id"
                value={formData.property_id}
                onChange={handleInputChange}
                className={`form-select${formErrors.property_id ? ' is-invalid' : ''}`}
                disabled={isSubmitting}
              >
                <option value="">Select a property</option>
                {propertiesList.map((property) => (
                  <option key={property.property_id} value={property.property_id}>
                    {property.property_name}
                  </option>
                ))}
              </select>
              {formErrors.property_id && (
                <div className="invalid-feedback d-block">{formErrors.property_id}</div>
              )}
            </div>
            <div className="col-md-6">
              <label className="form-label">Maintenance Cost ($)</label>
              <input
                type="number"
                name="maintainence_cost"
                value={formData.maintainence_cost}
                onChange={handleInputChange}
                className="form-control"
                placeholder="0.00"
                min="0"
                step="0.01"
                disabled={isSubmitting}
              />
            </div>
          </div>
          <div className="d-flex justify-content-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary-600 d-inline-flex align-items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Submitting...
                </>
              ) : (editData ? 'Update Request' : 'Submit Request')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaintenanceForm;
