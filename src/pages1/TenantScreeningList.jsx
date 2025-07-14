import React, { useEffect, useState } from 'react';
import { Table, Tag, Button } from 'antd';
import { Link } from 'react-router-dom';

export default function TenantScreeningList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
  
      try {
        const token = localStorage.getItem('access');
        if (!token) throw new Error('No access token found');
  
        const response = await fetch('https://hemanth525.pythonanywhere.com/screening/list/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
  
        const result = await response.json();
        console.log('API raw response:', result);
  
        // ✅ Get result.data instead of full result
        const normalized = Array.isArray(result.data) ? result.data : [];
  
        setData(normalized);
      } catch (error) {
        console.error('Fetch error:', error);
        setError(error.message || 'Unknown error occurred');
        setData([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  
  

  const columns = [
    { title: 'Name', dataIndex: 'full_name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Status', dataIndex: 'status', key: 'status',
      render: (status) => <Tag color={status === 'approved' ? 'green' : status === 'rejected' ? 'red' : 'blue'}>{status}</Tag> },
    { title: 'AI Score', dataIndex: 'ai_score', key: 'ai_score' },
    { title: 'Action', key: 'action',
      render: (_, record) => <Button type="link"><Link to={`/tenant-screening/approve/${record.id}`}>Review</Link></Button> },
  ];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24, background: '#fff', borderRadius: 8 }}>
      <h2 style={{ fontWeight: 700, fontSize: 20, marginBottom: 24 }}>Tenant Applications</h2>
      {error && <div style={{color: 'red', marginBottom: 16}}>{error}</div>}
      <Table columns={columns} dataSource={data} loading={loading} rowKey="id" />
    </div>
  );
}
