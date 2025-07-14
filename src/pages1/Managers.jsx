import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiSearch, FiUser, FiPlus } from 'react-icons/fi';

const Managers = () => {
  const [managers, setManagers] = useState([]);
  const [filteredManagers, setFilteredManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchManagers = async () => {
    try {
      const token = localStorage.getItem("access");
      const response = await axios.get("https://hemanth525.pythonanywhere.com/user/manager/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = Array.isArray(response.data) ? response.data : response.data.data;
      setManagers(data || []);
    } catch (err) {
      console.error("Error fetching managers:", err);
      setError("Failed to fetch manager data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredManagers(managers);
    } else {
      const lower = searchTerm.toLowerCase();
      setFilteredManagers(
        managers.filter((m) =>
          m.username?.toLowerCase().includes(lower) ||
          m.email?.toLowerCase().includes(lower)
        )
      );
    }
  }, [searchTerm, managers]);

  const [showModal, setShowModal] = useState(false);
  const [newManager, setNewManager] = useState({ username: '', email: '', password: '', type: 'property_manager' });
  const [addError, setAddError] = useState('');
  const [addLoading, setAddLoading] = useState(false);

  const handleAddManager = () => {
    setShowModal(true);
    setAddError('');
    setNewManager({ username: '', email: '', password: '', type: 'property_manager' });
  };

  const handleModalClose = () => {
    setShowModal(false);
    setAddError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewManager((prev) => ({ ...prev, [name]: value }));
  };

  const handleManagerSubmit = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError('');
    try {
      const token = localStorage.getItem("access");
      const res = await axios.post(
        "https://hemanth525.pythonanywhere.com/user/manager/",
        newManager,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (res.status === 201 || res.status === 200) {
        setShowModal(false);
        setNewManager({ username: '', email: '', password: '', type: 'property_manager' });
        setAddError('');
        fetchManagers();
      } else {
        setAddError('Failed to add manager.');
      }
    } catch (err) {
      setAddError(err.response?.data?.message || 'Failed to add manager.');
    } finally {
      setAddLoading(false);
    }
  };

  if (loading) return <div>Loading managers...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="d-flex flex-column gap-3">
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center position-relative">
          <FiSearch className="position-absolute" style={{ fontSize: '1rem', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control form-control-sm"
            placeholder="Search managers..."
            style={{ paddingLeft: '30px' }}
          />
        </div>
        <button className="btn btn-sm d-flex align-items-center" style={{ backgroundColor: '#30314f', color: 'white' }} onClick={handleAddManager}>
          <FiPlus className="me-1" /> Add Manager
        </button>
      </div>

      {/* Add Manager Modal */}
      {showModal && (
        <>
          <div className="modal-backdrop show" style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',backgroundColor:'rgba(0,0,0,0.5)',zIndex:1040}} />
          <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,zIndex:1050,display:'flex',alignItems:'center',justifyContent:'center',overflow:'auto'}}>
            <div className="card shadow-lg" style={{width: '400px', maxWidth: '90%', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
              <div className="card-header d-flex align-items-center justify-content-between">
                <h5 className="mb-0">Add Manager</h5>
                <button type="button" className="btn btn-link text-danger fs-4 p-0 ms-2" aria-label="Close" onClick={handleModalClose}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <form onSubmit={handleManagerSubmit}>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input type="text" name="username" value={newManager.username} onChange={handleInputChange} className="form-control" required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" name="email" value={newManager.email} onChange={handleInputChange} className="form-control" required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input type="password" name="password" value={newManager.password} onChange={handleInputChange} className="form-control" required />
                  </div>
                  {addError && <div className="alert alert-danger py-1">{addError}</div>}
                </div>
                <div className="card-footer d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-secondary" onClick={handleModalClose} disabled={addLoading}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={addLoading}>{addLoading ? 'Adding...' : 'Add Manager'}</button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {filteredManagers.length === 0 ? (
        <div className="text-center py-5">
          <FiUser className="text-secondary" style={{ fontSize: '2.5rem' }} />
          <h6 className="mt-2">
            {searchTerm ? "No matching managers found" : "No managers added yet."}
          </h6>
        </div>
      ) : (
        <div className="bg-light rounded overflow-auto">
          <table className="table bordered-table text-sm">
            <thead>
              <tr>
                <th className="text-center">Username</th>
                <th className="text-center">Email</th>
              </tr>
            </thead>
            <tbody>
              {filteredManagers.map((manager, index) => (
                <tr key={manager.user_id || index}>
                  <td className="text-center">{manager.username || "-"}</td>
                  <td className="text-center">{manager.email || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Managers;
