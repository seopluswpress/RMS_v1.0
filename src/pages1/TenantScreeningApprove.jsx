import React, { useEffect, useState } from 'react';
import { Card, Button, Descriptions, Result, Spin, Alert } from 'antd';
import { useParams } from 'react-router-dom';

export default function   TenantScreeningApprove() {
  const { id } = useParams();
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [approved, setApproved] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTenant = async () => {
      setError(null);
      setLoading(true);
      try {
        const token = localStorage.getItem('access');
        if (!token) throw new Error('No access token found');
        const response = await fetch(`https://hemanth525.pythonanywhere.com/screening/detail/${id}/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const result = await response.json();
        console.log('Tenant detail API response:', result);
        if (!response.ok) throw new Error(result.detail || 'Failed to fetch tenant details');
        // If result.data is an array, use the first element
        let tenantObj = Array.isArray(result.data) ? result.data[0] : (result.data || result.tenant || result);
        setTenant(tenantObj);
      } catch (err) {
        setError(err.message || 'Could not fetch tenant details');
        setTenant(null);
      } finally {
        setLoading(false);
      }
    };
    fetchTenant();
  }, [id]);

  const handleApprove = async () => {
    setError(null);
    setLoading(true);
    try {
      const token = localStorage.getItem('access');
      if (!token) throw new Error('No access token found');
      const response = await fetch(`https://hemanth525.pythonanywhere.com/screening/approve/${id}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to approve tenant');
      setApproved(true);
      setTenant((prev) => prev ? { ...prev, status: 'approved' } : prev);
    } catch (err) {
      setError(err.message || 'Could not approve tenant');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setError(null);
    setLoading(true);
    try {
      const token = localStorage.getItem('access');
      if (!token) throw new Error('No access token found');
      const response = await fetch(`https://hemanth525.pythonanywhere.com/screening/reject/${id}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to reject tenant');
      setApproved(false);
      setTenant((prev) => prev ? { ...prev, status: 'rejected' } : prev);
    } catch (err) {
      setError(err.message || 'Could not reject tenant');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spin />;
  if (approved && tenant?.status === 'approved') return <Result status="success" title="Tenant Approved" />;
  if (approved === false && tenant?.status === 'rejected') return <Result status="error" title="Tenant Rejected" />;
  if (!tenant) return <Alert type="error" message="Tenant not found" />;

  return (
    <Card style={{ maxWidth: 600, margin: '0 auto', marginTop: 32 }}>
      <Descriptions title="Tenant Details" bordered column={1}>
        <Descriptions.Item label="Name">{tenant.full_name}</Descriptions.Item>
        <Descriptions.Item label="Email">{tenant.email}</Descriptions.Item>
        <Descriptions.Item label="Phone">{tenant.phone}</Descriptions.Item>
        <Descriptions.Item label="Date of Birth">{tenant.dob}</Descriptions.Item>
        <Descriptions.Item label="Address">{tenant.address}</Descriptions.Item>
        <Descriptions.Item label="Credit Score">{tenant.credit_score}</Descriptions.Item>
        <Descriptions.Item label="Eviction History">{tenant.eviction_history ? 'Yes' : 'No'}</Descriptions.Item>
        <Descriptions.Item label="Criminal Record">{tenant.criminal_record ? 'Yes' : 'No'}</Descriptions.Item>
        <Descriptions.Item label="Employment Status">{tenant.employment_status}</Descriptions.Item>
        <Descriptions.Item label="Monthly Income">{tenant.monthly_income}</Descriptions.Item>
        <Descriptions.Item label="Documents">{tenant.documents ? <a href={`https://hemanth525.pythonanywhere.com${tenant.documents}`} target="_blank" rel="noopener noreferrer">View Document</a> : 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="AI Score">{tenant.ai_score}</Descriptions.Item>
        <Descriptions.Item label="AI Recommendation">{tenant.recommendation}</Descriptions.Item>
        <Descriptions.Item label="AI Summary">{tenant.ai_summary}</Descriptions.Item>
        <Descriptions.Item label="AI Risks">{tenant.ai_risks}</Descriptions.Item>
        <Descriptions.Item label="Status">{tenant.status}</Descriptions.Item>
        <Descriptions.Item label="Created At">{tenant.created_at}</Descriptions.Item>
      </Descriptions>
      {error && <Alert type="error" message={error} style={{marginTop: 16}} />}
      <div style={{ marginTop: 24, display: 'flex', gap: 16 }}>
        <Button type="primary" onClick={handleApprove} disabled={loading || tenant.status === 'approved'}>Approve</Button>
        <Button danger onClick={handleReject} disabled={loading || tenant.status === 'rejected'}>Reject</Button>
      </div>
    </Card>
  );
}

