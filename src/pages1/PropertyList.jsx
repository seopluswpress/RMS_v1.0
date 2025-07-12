import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function PropertyList() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const token = localStorage.getItem('access');
        const res = await axios.get(
          'https://hemanth525.pythonanywhere.com/properties/property_list/',
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const props = Array.isArray(res.data)
          ? res.data
          : res.data?.data || [];

        setProperties(props);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('Failed to fetch properties.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) return <p className="text-center mt-4">Loading properties...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-4">

      {properties.length === 0 ? (
        <p>No properties available.</p>
      ) : (
        <div className="bg-light rounded shadow overflow-auto">
           <div className="table-responsive">
        <table className="table bordered-table mb-0">
          <thead>
          <tr className="bg-primary-600 text-white">
              <th scope="col">Property Name</th>
              <th scope="col" className="text-center">Property Address</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((prop) => (
              <tr key={prop.property_id}>
                <td>{prop.property_name}</td>
                <td className="text-center">{prop.property_address}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        </div>
      )}
    </div>
  );
}
