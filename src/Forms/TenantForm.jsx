import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { FiX } from 'react-icons/fi';
import axios from 'axios';

const TenantForm = ({ onClose, onTenantAdded, onTenantUpdated, tenant }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    type: 'tenant'
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (tenant) {
      setFormData({
        username: tenant.username || '',
        email: tenant.email || '',
        password: '', // Password is never pre-filled
        type: 'tenant'
      });
    }
  }, [tenant]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    if (!tenant) { // Only validate password for new tenants
      if (!formData.password) {
        errors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
      }
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
      if (tenant) {
        // Edit tenant
        const response = await axios.patch(`https://hemanth525.pythonanywhere.com/user/tenant/${tenant.id}/`, {
          username: formData.username,
          email: formData.email
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 200) {
          onTenantUpdated && onTenantUpdated(response.data);
          onClose();
        }
      } else {
        // New tenant
        const response = await axios.post('https://hemanth525.pythonanywhere.com/user/', {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          type: 'tenant'
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 201) {
          onTenantAdded(response.data);
          onClose();
        }
      }
    } catch (err) {
      console.error('Error submitting tenant:', err);
      setError(err.response?.data?.detail || 'Failed to submit tenant. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">


        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mx-6 mt-4">
            <p>{error}</p>
          </div>
        )}

<div className="card">
  <div className="card-body">
    <form onSubmit={handleSubmit} className="row gy-3 needs-validation" noValidate>
      <div className="col-12">
        <label htmlFor="username" className="form-label">Username *</label>
        <div className="icon-field has-validation">
          <span className="icon">
            <Icon icon="f7:person" />
          </span>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className={`form-control${formErrors.username ? ' is-invalid' : ''}`}
            placeholder="Enter Username"
            disabled={isSubmitting}
            required
          />
          <div className="invalid-feedback">{formErrors.username || 'Please provide a username'}</div>
        </div>
      </div>
      <div className="col-12">
        <label htmlFor="email" className="form-label">Email *</label>
        <div className="icon-field has-validation">
          <span className="icon">
            <Icon icon="mage:email" />
          </span>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`form-control${formErrors.email ? ' is-invalid' : ''}`}
            placeholder="Enter Email"
            disabled={isSubmitting}
            required
          />
          <div className="invalid-feedback">{formErrors.email || 'Please provide email address'}</div>
        </div>
      </div>

      <div className="col-12 d-flex justify-content-end gap-2 pt-2">
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
          className="btn btn-primary-600 d-flex align-items-center gap-1"
          disabled={isSubmitting}
        >
          {isSubmitting && (
            <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
          )}
          {tenant ? (isSubmitting ? 'Updating...' : 'Update Tenant') : (isSubmitting ? 'Adding...' : 'Add Tenant')}
        </button>
      </div>
    </form>
  </div>
</div>

      </div>
    </div>
  );
};

export default TenantForm;
