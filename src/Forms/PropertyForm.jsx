import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { Icon } from '@iconify/react';
import axiosInstance from '../utils/axiosInstance';

const PropertyForm = ({ onClose, onPropertyAdded, onSubmit, property }) => {
  const [formData, setFormData] = useState({
    property_name: '',
    property_address: '',
    property_type: 'Residential',
    property_city: '',
    property_state: '',
    property_zip: '',
    property_contact_name: '',
    property_contact_email: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Reset form when property changes
    setFormData({
      property_name: property?.property_name || '',
      property_address: property?.property_address || '',
      property_type: property?.property_type || 'Residential',
      property_city: property?.property_city || '',
      property_state: property?.property_state || '',
      property_zip: property?.property_zip || '',
      property_contact_name: property?.property_contact_name || '',
      property_contact_email: property?.property_contact_email || ''
    });
  }, [property]); // This effect runs whenever the property prop changes

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.property_name.trim()) errors.property_name = 'Required';
    if (!formData.property_address.trim()) errors.property_address = 'Required';
    if (!formData.property_type.trim()) errors.property_type = 'Required';
    if (!formData.property_city.trim()) errors.property_city = 'Required';
    if (!formData.property_state.trim()) errors.property_state = 'Required';
    if (!formData.property_zip.trim()) errors.property_zip = 'Required';
    if (!formData.property_contact_name.trim()) errors.property_contact_name = 'Required';
    if (!formData.property_contact_email.trim()) errors.property_contact_email = 'Required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setError('');

    try {
      // Get the access token with the correct key
      const token = localStorage.getItem('access');
      const userId = localStorage.getItem('user_id');
      const payload = { ...formData };
      


      if (property) {
        // Update existing property
        const id = property.id || property.property_id;
        const response = await axiosInstance.patch(
          `/properties/property/${id}/`,
          payload
        );

        // Check for successful status (2xx range)
        if (response.status >= 200 && response.status < 300) {
          await (onSubmit && onSubmit(response.data));
          onClose && onClose();
        } else {
          throw new Error(`Unexpected status code: ${response.status}`);
        }
      } else {
        // Create new property
        const response = await axiosInstance.post(
          `/properties/property/`,
          payload
        );
        
        console.log("Property creation response:", response.status, response.data);
        
        // Check for successful status (2xx range)
        if (response.status >= 200 && response.status < 300) {
          await (onPropertyAdded && onPropertyAdded(response.data));
          onClose && onClose();
        } else {
          throw new Error(`Unexpected status code: ${response.status}`);
        }
      }
    } catch (err) {
      console.error('Form submission error:', err);
      const res = err.response?.data || err.message;
      const message = typeof res === 'object' ? JSON.stringify(res) : res;
      setError(message || 'An error occurred while saving the property');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0">{property ? 'Edit Property' : 'Add New Property'}</h5>
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
            <label htmlFor="property_name" className="form-label">Property Name *</label>
            <div className="icon-field">
              <span className="icon">
                <Icon icon="mdi:home-city-outline" />
              </span>
              <input
                id="property_name"
                name="property_name"
                value={formData.property_name || ''}
                onChange={handleInputChange}
                className={`form-control${formErrors.property_name ? ' is-invalid' : ''}`}
                placeholder="Enter Property Name"
                disabled={isSubmitting}
                required
              />
            </div>
            {formErrors.property_name && <div className="invalid-feedback d-block">{formErrors.property_name}</div>}
          </div>
          <div className="col-12">
            <label htmlFor="property_address" className="form-label">Address *</label>
            <div className="icon-field">
              <span className="icon">
                <Icon icon="mdi:map-marker-outline" />
              </span>
              <input
                id="property_address"
                name="property_address"
                value={formData.property_address || ''}
                onChange={handleInputChange}
                className={`form-control${formErrors.property_address ? ' is-invalid' : ''}`}
                placeholder="Enter Address"
                disabled={isSubmitting}
                required
              />
            </div>
            {formErrors.property_address && <div className="invalid-feedback d-block">{formErrors.property_address}</div>}
          </div>
          <div className="col-12">
            <label htmlFor="property_type" className="form-label">Type *</label>
            <div className="icon-field">
              <span className="icon">
                <Icon icon="material-symbols:category-outline" />
              </span>
              <select
                id="property_type"
                name="property_type"
                value={formData.property_type || 'Residential'}
                onChange={handleInputChange}
                className={`form-control${formErrors.property_type ? ' is-invalid' : ''}`}
                disabled={isSubmitting}
                required
              >
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Industrial">Industrial</option>
                <option value="Land">Land</option>
              </select>
            </div>
            {formErrors.property_type && <div className="invalid-feedback d-block">{formErrors.property_type}</div>}
          </div>
          <div className="col-12">
            <label htmlFor="property_city" className="form-label">City *</label>
            <div className="icon-field">
              <span className="icon">
                <Icon icon="mdi:city-variant-outline" />
              </span>
              <input
                id="property_city"
                name="property_city"
                value={formData.property_city || ''}
                onChange={handleInputChange}
                className={`form-control${formErrors.property_city ? ' is-invalid' : ''}`}
                placeholder="Enter City"
                disabled={isSubmitting}
                required
              />
            </div>
            {formErrors.property_city && <div className="invalid-feedback d-block">{formErrors.property_city}</div>}
          </div>
          <div className="col-12">
            <label htmlFor="property_state" className="form-label">State *</label>
            <div className="icon-field">
              <span className="icon">
                <Icon icon="mdi:map-outline" />
              </span>
              <input
                id="property_state"
                name="property_state"
                value={formData.property_state || ''}
                onChange={handleInputChange}
                className={`form-control${formErrors.property_state ? ' is-invalid' : ''}`}
                placeholder="Enter State"
                disabled={isSubmitting}
                required
              />
            </div>
            {formErrors.property_state && <div className="invalid-feedback d-block">{formErrors.property_state}</div>}
          </div>
          <div className="col-12">
            <label htmlFor="property_zip" className="form-label">ZIP *</label>
            <div className="icon-field">
              <span className="icon">
                <Icon icon="mdi:numeric" />
              </span>
              <input
                id="property_zip"
                name="property_zip"
                value={formData.property_zip || ''}
                onChange={handleInputChange}
                className={`form-control${formErrors.property_zip ? ' is-invalid' : ''}`}
                placeholder="Enter ZIP Code"
                disabled={isSubmitting}
                required
              />
            </div>
            {formErrors.property_zip && <div className="invalid-feedback d-block">{formErrors.property_zip}</div>}
          </div>
          <div className="col-12">
            <label htmlFor="property_contact_name" className="form-label">Contact Name *</label>
            <div className="icon-field">
              <span className="icon">
                <Icon icon="mdi:account-outline" />
              </span>
              <input
                id="property_contact_name"
                name="property_contact_name"
                value={formData.property_contact_name || ''}
                onChange={handleInputChange}
                className={`form-control${formErrors.property_contact_name ? ' is-invalid' : ''}`}
                placeholder="Enter Contact Name"
                disabled={isSubmitting}
                required
              />
            </div>
            {formErrors.property_contact_name && <div className="invalid-feedback d-block">{formErrors.property_contact_name}</div>}
          </div>
          <div className="col-12">
            <label htmlFor="property_contact_email" className="form-label">Contact Email *</label>
            <div className="icon-field">
              <span className="icon">
                <Icon icon="mage:email" />
              </span>
              <input
                id="property_contact_email"
                name="property_contact_email"
                value={formData.property_contact_email || ''}
                onChange={handleInputChange}
                className={`form-control${formErrors.property_contact_email ? ' is-invalid' : ''}`}
                placeholder="Enter Contact Email"
                type="email"
                disabled={isSubmitting}
                required
              />
            </div>
            {formErrors.property_contact_email && <div className="invalid-feedback d-block">{formErrors.property_contact_email}</div>}
          </div>
          <div className="col-12 d-flex justify-content-end gap-2 pt-2">
            
            <button
              type="submit"
              className="btn btn-primary-600 d-flex align-items-center gap-1"
              style={{ backgroundColor: '#30314f', color: 'white' }}
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

export default PropertyForm;
