import React, { useState } from 'react';
import { Steps, Button, Result, Alert } from 'antd';
import TenantScreeningForm from './TenantScreeningForm';
import TenantDocumentUpload from './TenantDocumentUpload';
import useUser  from '../hooks/useUser'; // Assume a hook for user/role
import { Link } from 'react-router-dom';

const { Step } = Steps;

export default function TenantScreening() {
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState({});
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useUser(); // { role: 'tenant' | 'property_owner' | ... }

  const steps = [
    {
      title: 'Tenant Info',
      content: <TenantScreeningForm onNext={(data) => { setFormData(data); setCurrent(1); }} />,
    },
    {
      title: 'Upload Documents',
      content: <TenantDocumentUpload formData={formData} onBack={() => setCurrent(0)} onComplete={() => setCompleted(true)} setError={setError} />,
    },
  ];

  if (completed) {
    return <Result status="success" title="Application Submitted!" subTitle="Your tenant screening application has been received."/>;
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24, background: '#fff', borderRadius: 8 }}>
      
      <p style={{ color: '#888', marginBottom: 24 }}>Screen potential tenants with a professional background check.</p>
      <Steps current={current} style={{ marginBottom: 32 }}>
        {steps.map((item, idx) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />}
      <div>{steps[current].content}</div>
      {user?.role === 'property_owner' && (
        <div style={{ marginTop: 40 }}>
          <h3 style={{ fontWeight: 500 }}>Owner Tools</h3>
          <Button type="link"><Link to="/tenant-screening/list">View All Applications</Link></Button>
        </div>
      )}
    </div>
  );
}
