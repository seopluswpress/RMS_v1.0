import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { FiX } from 'react-icons/fi';
import { properties } from '../services/api';
import axiosInstance from '../utils/axiosInstance';

export default function LeaseForm({  unit, onClose, onLeaseAdded }) {
  const [formData, setFormData] = useState({
    tenant: '',
    lease_start: '',
    lease_end: '',
    due_date: '',
    rent: '',
    fine_amount: '',
    increment_percent: '',
    unit: unit?.unit_id || unit?.id || '',
  });

  const [units, setUnits] = useState([]);
  const [tenantList, setTenantList] = useState([]);

  useEffect(() => {
    if (unit) {
      setUnits([unit]);
      setFormData(prev => ({
        ...prev,
        unit: unit.unit_id || unit.id || '',
        rent: unit.unit_rent || ''
      }));
    }

    const fetchTenants = async () => {
      try {
        const response = await properties.gettenants();
        const data = Array.isArray(response.data?.results)
          ? response.data.results
          : Array.isArray(response.data)
          ? response.data
          : [];
        setTenantList(data);
      } catch (err) {
        console.error("Failed to fetch tenants:", err);
      }
    };

    fetchTenants();
  }, [unit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tenant || !formData.unit || !formData.lease_start || !formData.lease_end || !formData.due_date) {
      alert("All fields are required.");
      return;
    }

    // Parse values with validation
    const tenantId = parseInt(formData.tenant, 10);
    const unitId = parseInt(formData.unit, 10);
    const dueDate = parseInt(formData.due_date, 10);
    const incrementPercent = parseInt(formData.increment_percent, 10);
    
    // Validate parsed values
    if (isNaN(tenantId)) {
      alert("Please select a valid tenant.");
      return;
    }
    
    if (isNaN(unitId)) {
      alert("Please select a valid unit.");
      return;
    }

    // Get current user ID for owner from user object in localStorage
    const userObj = JSON.parse(localStorage.getItem("user"));
    const userId = userObj?.user_id;

    // Only send required lease fields. Backend will set created_by from authenticated user.
    const payload = {
      tenant: tenantId,
      unit: unitId,
      lease_start: formData.lease_start,
      lease_end: formData.lease_end,
      due_date: dueDate,
      rent: parseFloat(formData.rent),
      fine_amount: parseFloat(formData.fine_amount || 0),
      increment_percent: incrementPercent,
      created_by: userId,
    };

    
    // Add debug logging
    console.log("Tenant ID before parsing:", formData.tenant);
    console.log("Tenant ID after parsing:", tenantId);

    console.log("Posting lease payload:", payload);

    try {
      // Explicitly set Authorization header with access token
      const access = localStorage.getItem("access");
      if (!access) {
        alert("You must be logged in to add a lease. Please log in and try again.");
        return;
      }
      const response = await axiosInstance.post('/properties/lease/', payload, {
        headers: {
          Authorization: `Bearer ${access}`
        }
      });
      
      console.log("Lease POST response:", response);

      if (response.status === 201 || response.data?.status === 1) {
        alert('Lease created successfully');
        onLeaseAdded(response.data);
      } else {
        throw new Error('Lease creation failed');
      }
    } catch (err) {
      console.error("Lease POST error:", err);
      alert('Error creating lease: ' + err.message);
    }
  };

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0">Create Lease</h5>
        <button type="button" onClick={onClose} className="btn btn-link p-0 text-secondary">
          <FiX className="h-6 w-6" />
        </button>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit} className="row gy-3 needs-validation" noValidate>
          <div className="col-12">
            <label className="form-label">Select Unit</label>
            <div className="icon-field">
              <span className="icon">
                <Icon icon="mdi:home-outline" />
              </span>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                required
                className="form-control"
              >
                <option value="">Select unit</option>
                {units.map((u, idx) => {
                  const unitValue = u.unit_id || u.id;
                  return (
                    <option key={unitValue || idx} value={unitValue}>
                      {u.unit_name || `Unit ${unitValue}`}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="col-12">
            <label className="form-label">Select Tenant</label>
            <div className="icon-field">
              <span className="icon">
                <Icon icon="mdi:account-outline" />
              </span>
              <select
                name="tenant"
                value={formData.tenant}
                onChange={handleChange}
                required
                className="form-control"
              >
                <option value="">Select tenant</option>
                {tenantList.map((t, idx) => {
                  // Use user_id as the primary ID, fall back to id if needed
                  const tenantId = t.user_id || t.id;
                  return (
                    <option key={tenantId || idx} value={tenantId}>
                      {t.username || t.email || (`Tenant ${tenantId}`)}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="col-12">
            <label className="form-label">Lease Start Date</label>
            <div className="icon-field">
              <span className="icon">
                <Icon icon="mdi:calendar-start-outline" />
              </span>
              <input
                type="date"
                name="lease_start"
                value={formData.lease_start}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
          </div>
          <div className="col-12">
            <label className="form-label">Lease End Date</label>
            <div className="icon-field">
              <span className="icon">
                <Icon icon="mdi:calendar-end-outline" />
              </span>
              <input
                type="date"
                name="lease_end"
                value={formData.lease_end}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
          </div>
          <div className="col-12">
            <label className="form-label">Payment Due Day (1-31)</label>
            <div className="icon-field">
              <span className="icon">
                <Icon icon="mdi:calendar-clock-outline" />
              </span>
              <input
                type="number"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                required
                min="1"
                max="31"
                placeholder="Enter day of month (1-31)"
                className="form-control"
              />
            </div>
          </div>
          <div className="col-12">
            <label className="form-label">Late Payment Fine Amount</label>
            <div className="icon-field">
              <span className="icon">
                <Icon icon="mdi:currency-usd-off" />
              </span>
              <input
                type="number"
                name="fine_amount"
                value={formData.fine_amount}
                onChange={handleChange}
                className="form-control"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <div className="col-12">
            <label className="form-label">Increment Percent (%)</label>
            <div className="icon-field">
              <span className="icon">
                <Icon icon="mdi:percent-outline" />
              </span>
              <input
                type="number"
                name="increment_percent"
                value={formData.increment_percent}
                onChange={handleChange}
                required
                min="0"
                max="100"
                placeholder="0"
                className="form-control"
              />
            </div>
          </div>
          <div className="col-12">
            <label className="form-label">Rent Amount</label>
            <div className="icon-field">
              <span className="icon">
                <Icon icon="mdi:currency-usd" />
              </span>
              <input
                type="number"
                name="rent"
                value={formData.rent}
                onChange={handleChange}
                required
                className="form-control"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <div className="col-12 mb-3">
            <div className="alert alert-danger d-flex align-items-center" role="alert">
              <Icon icon="mdi:information-outline" className="me-2" />
              <small><strong>Important:</strong> After successful payment, an invoice will be automatically generated.</small>
            </div>
          </div>
          <div className="col-12 d-flex justify-content-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary-600 d-flex align-items-center gap-1"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
