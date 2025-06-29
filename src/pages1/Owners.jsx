import { useEffect, useState } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiUsers } from 'react-icons/fi';
import { Icon } from '@iconify/react';
import { properties } from '../services/api';  // Adjust path if needed

const Owner = () => {
  const [owners, setOwners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOwners, setFilteredOwners] = useState([]);

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await properties.getowners();
      const data = Array.isArray(response.data) ? response.data : response.data.data;
      setOwners(data || []);
    } catch (err) {
      setError('Failed to fetch owners.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredOwners(owners);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredOwners(
        owners.filter(owner =>
          owner.username?.toLowerCase().includes(term) ||
          owner.email?.toLowerCase().includes(term)
        )
      );
    }
  }, [searchTerm, owners]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="d-flex flex-column gap-2">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <div className="card-header d-flex flex-wrap align-items-center justify-content-between gap-2">
          <div className="d-flex flex-wrap align-items-center gap-3">
            <div className="icon-field">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                className="form-control form-control-sm w-auto"
                placeholder="Search owners..."
              />
              <span className="icon">
                <FiSearch />
              </span>
            </div>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '8rem' }}>
          <span className="spinner-border text-primary" role="status" aria-hidden="true"></span>
          <span className="ms-2">Loading...</span>
        </div>
      ) : filteredOwners.length === 0 ? (
        <div className="bg-light rounded shadow p-4 text-center">
          <FiUsers className="text-secondary" style={{ fontSize: '2.5rem' }} />
          <h3 className="mt-2 h6 fw-medium">No Owners Found</h3>
          <p className="text-muted">Try adjusting your search criteria.</p>
        </div>
      ) : (
        <div className="bg-light rounded overflow-auto">
          <table className="table bordered-table text-sm">
            <thead>
              <tr>
                <th scope="col">Username</th>
                <th scope="col">Email</th>
              </tr>
            </thead>
            <tbody>
  {filteredOwners.map((owner) => (
    <tr key={owner.id}>
      <td className="align-middle text-start px-4 py-2">{owner.username}</td>
      <td className="align-middle text-start px-4 py-2">{owner.email}</td>
    </tr>
  ))}
</tbody>

          </table>
        </div>
      )}
    </div>
  );
};

export default Owner;
