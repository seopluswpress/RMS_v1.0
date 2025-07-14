import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { FiPlus } from 'react-icons/fi';
import axios from 'axios';
import MaintenanceForm from '../Forms/MaintenanceForm';

export default function Maintenance() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingRequest, setEditingRequest] = useState(null);

  useEffect(() => {
    const fetchMaintenanceData = async () => {
      try {
        setLoading(true);
        setError(null);
        const access = localStorage.getItem('access');
        const response = await axios.get(
          'https://hemanth525.pythonanywhere.com/properties/maintainence/',
          {
            headers: {
              Authorization: `Bearer ${access}`,
              'Content-Type': 'application/json',
            },
          }
        );

        let data = response?.data?.data || response?.data || [];
        const enriched = data.map(item => {
          const property = item.property_details || {};
          return {
            ...item,
            id: item.maintainence_id,
            propertyName: property.property_name || 'N/A',
            propertyAddress: property.property_address || '',
          };
        });

        setRequests(enriched);
      } catch (err) {
        console.error('Failed to fetch maintenance requests:', err);
        setError('Failed to load maintenance data');
      } finally {
        setLoading(false);
      }
    };

    fetchMaintenanceData();
  }, [refreshKey]);

  const handleAddRequest = async (formData) => {
    try {
      const access = localStorage.getItem('access');
      await axios.post(
        'https://hemanth525.pythonanywhere.com/properties/maintainence/',
        formData,
        {
          headers: {
            Authorization: `Bearer ${access}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setRefreshKey(prev => prev + 1);
      setShowModal(false);
    } catch (err) {
      console.error('Failed to add maintenance request:', err);
    }
  };

  return (
    <div className="container py-4">
       <div className="d-flex flex-wrap justify-content-end align-items-center gap-3" style={{paddingBottom: '1rem',paddingTop: '1rem'}}>
        
        {(() => {
          const user = JSON.parse(localStorage.getItem("user"));
          const userRole = user?.type || user?.user_type;
          return userRole !== "property_owner" ? (
            <button 
              className="btn btn-primary" 
              onClick={() => setShowModal(true)}
              style={{
                transition: 'background-color 0.3s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#30314f'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = ''}
            >
              <FiPlus className="me-2" /> New Request
            </button>
          ) : null;
        })()}
      </div>

      {loading ? (
        <div className="text-center py-5">Loading...</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : requests.length === 0 ? (
        <div className="text-center py-5 text-muted">No maintenance requests found.</div>
      ) : (
        <div className="bg-light rounded shadow overflow-auto">
        <div className="table-responsive">
          <table className="table bordered-table mb-0">
            <thead className="table-light">
            <tr className="bg-primary-600 text-white">
                <th scope="col">Type</th>
                <th scope="col">Property</th>
                <th scope="col">Date</th>
                <th scope="col">Cost</th>
                <th scope="col">Status</th>
                <th scope="col">Priority</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((item) => (
                <tr key={item.id}>
                  <td>{item.maintainence_type}</td>
                  <td>
                    <div>{item.propertyName}</div>
                    <small className="text-muted">{item.propertyAddress}</small>
                  </td>
                  <td>{item.maintainence_date}</td>
                  <td>{item.maintainence_cost}</td>
                  <td>
                    {String(item.status || '').toLowerCase() === 'completed' && (
                      <span
                        className="d-inline-flex align-items-center justify-content-center bg-success-focus text-success-main fw-medium text-sm"
                        style={{
                          width: '100px',
                          height: '30px',
                          borderRadius: '999px',
                          padding: '0 10px',
                        }}
                      >
                        Completed
                      </span>
                    )}
                    {String(item.status || '').toLowerCase() === 'pending' && (
                      <span
                        className="d-inline-flex align-items-center justify-content-center bg-danger-focus text-danger-main fw-medium text-sm"
                        style={{
                          width: '100px',
                          height: '30px',
                          borderRadius: '999px',
                          padding: '0 10px',
                        }}
                      >
                        Pending
                      </span>
                    )}
                    {['completed','pending'].indexOf(String(item.status || '').toLowerCase()) === -1 && (
                      <span
                        className="d-inline-flex align-items-center justify-content-center bg-secondary text-secondary-main fw-medium text-sm"
                        style={{
                          width: '100px',
                          height: '30px',
                          borderRadius: '999px',
                          padding: '0 10px',
                        }}
                      >
                        {item.status || 'Unknown'}
                      </span>
                    )}
                  </td>
                  <td>{item.priority}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      )}

      {showModal && (
        <>
          <div className="modal fade show" tabIndex="-1" style={{ display: 'block', background: 'rgba(0,0,0,0.35)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header pb-2">
                  <h6 className="modal-title">Add New Maintenance Request</h6>
                  <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body pt-2">
                  <MaintenanceForm
                    onClose={() => setShowModal(false)}
                    onMaintenanceAdded={handleAddRequest}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
}
