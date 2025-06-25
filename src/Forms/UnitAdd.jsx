import { useState } from 'react';
import { FiX } from 'react-icons/fi';
import { Icon } from '@iconify/react';
import { properties } from '../services/api'; // Use the same API service

const UnitAdd = ({ onClose, onUnitAdded, property }) => {
  const [formData, setFormData] = useState({
    unit_name: '',
    unit_address: '',
    unit_rent: '',
    active: true,
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.unit_name.trim()) errors.unit_name = 'Unit name is required';
    if (!formData.unit_address.trim()) errors.unit_address = 'Unit address is required';
    if (!formData.unit_rent || isNaN(formData.unit_rent) || parseFloat(formData.unit_rent) <= 0) {
      errors.unit_rent = 'Valid rent amount is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError('');

    try {
      // Ensure we have a valid property ID
      const propertyId = property.property_id || property.id;
      if (!propertyId) {
        throw new Error('Invalid property ID');
      }

      const payload = {
        unit_name: formData.unit_name.trim(),
        unit_address: formData.unit_address.trim(),
        unit_rent: parseFloat(formData.unit_rent),
        active: formData.active,
        property_id: property.property_id
      };

      console.log('Submitting unit data:', payload);

      // Use the same API service as Properties component
      const response = await properties.postunit(payload);
      
      console.log('Unit creation response:', {
        status: response.status,
        data: response.data,
        headers: response.headers
      });

      // Check if the response indicates success
      if (response.data) {
        if (response.data.status === 1) {
          const newUnit = response.data.data;
          console.log('Unit created successfully:', newUnit);
          onUnitAdded && onUnitAdded(newUnit);
          onClose();
        } else {
          // Handle validation errors
          const errors = response.data.data;
          if (errors && typeof errors === 'object') {
            const errorMessage = Object.entries(errors)
              .map(([field, msgs]) => `${field}: ${msgs.join(', ')}`)
              .join('\n');
            throw new Error(errorMessage || 'Validation failed');
          } else {
            throw new Error(response.data?.message || 'Failed to create unit');
          }
        }
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Error creating unit:', err);
      setError(err.response?.data?.message || err.message || 'Failed to add unit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0">Add New Unit{property?.property_name ? ` to ${property.property_name}` : ''}</h5>
        <button type="button" onClick={onClose} className="btn btn-link p-0 text-secondary" disabled={isSubmitting}>
          <FiX className="h-6 w-6" />
        </button>
      </div>
      <div className="card-body">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 p-3 mb-3 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="row gy-3 needs-validation" noValidate>
          <div className="col-12">
            <label htmlFor="unit_name" className="form-label">Unit Name *</label>
            <div className="icon-field">
              <span className="icon">
                <Icon icon="mdi:home-outline" />
              </span>
              <input
                id="unit_name"
                name="unit_name"
                type="text"
                value={formData.unit_name}
                onChange={handleChange}
                placeholder="Unit Name"
                className={`form-control${formErrors.unit_name ? ' is-invalid' : ''}`}
                required
                disabled={isSubmitting}
              />
            </div>
            {formErrors.unit_name && <div className="invalid-feedback d-block">{formErrors.unit_name}</div>}
          </div>
          <div className="col-12">
            <label htmlFor="unit_address" className="form-label">Unit Address *</label>
            <div className="icon-field">
              <span className="icon">
                <Icon icon="mdi:map-marker-outline" />
              </span>
              <input
                id="unit_address"
                name="unit_address"
                type="text"
                value={formData.unit_address}
                onChange={handleChange}
                placeholder="Complete address of this unit"
                className={`form-control${formErrors.unit_address ? ' is-invalid' : ''}`}
                required
                disabled={isSubmitting}
              />
            </div>
            {formErrors.unit_address && <div className="invalid-feedback d-block">{formErrors.unit_address}</div>}
          </div>
          <div className="col-12">
            <label htmlFor="unit_rent" className="form-label">Monthly Rent ($) *</label>
            <div className="icon-field">
              <span className="icon">
                <Icon icon="mdi:currency-usd" />
              </span>
              <input
                id="unit_rent"
                name="unit_rent"
                type="number"
                min="0"
                step="0.01"
                value={formData.unit_rent}
                onChange={handleChange}
                placeholder="0.00"
                className={`form-control${formErrors.unit_rent ? ' is-invalid' : ''}`}
                required
                disabled={isSubmitting}
              />
            </div>
            {formErrors.unit_rent && <div className="invalid-feedback d-block">{formErrors.unit_rent}</div>}
          </div>
          <div className="col-12">
            <label htmlFor="status" className="form-label">Status</label>
            <div className="icon-field">
              <span className="icon">
                <Icon icon="mdi:checkbox-marked-outline" />
              </span>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-control"
                disabled={isSubmitting}
              >
                <option value="Vacant">Vacant</option>
                <option value="Occupied">Occupied</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="col-12 d-flex align-items-center">
            <input
              type="checkbox"
              id="active"
              name="active"
              checked={formData.active}
              onChange={handleChange}
              className="form-check-input me-2"
              disabled={isSubmitting}
            />
            <label htmlFor="active" className="form-label mb-0">Active Unit</label>
          </div>
          <div className="col-12 d-flex justify-content-end gap-2 pt-2">
            
            <button
              type="submit"
              className="btn btn-primary-600 d-flex align-items-center gap-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UnitAdd;