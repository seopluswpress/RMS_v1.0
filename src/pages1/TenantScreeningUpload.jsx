import React, { useState } from 'react';
import { Upload, Button, Form, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

export default function TenantScreeningUpload({ onFinish }) {
  const [form] = Form.useForm();
  const [submitted, setSubmitted] = useState(false);

  const handleFinish = (values) => {
    // You can handle upload logic here or pass to parent
    onFinish?.(values);
    setSubmitted(true);
  };

  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f7f9fb',
      padding: 24
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        padding: '32px 28px',
        maxWidth: 420,
        width: '100%',
        margin: '0 auto',
        textAlign: 'center',
      }}>
        {submitted ? (
          <div style={{ padding: '32px 0' }}>
            <h2 style={{ color: '#22a06b', fontWeight: 700, marginBottom: 12 }}>Tenant Screening Completed</h2>
            <div style={{ color: '#444', fontSize: 16 }}>
              Thank you for submitting your documents.<br />
              We will get back to you in <b>5-7 days</b> after reviewing your screening.
            </div>
          </div>
        ) : (
          <>
            <div style={{textAlign: 'center', marginBottom: 16}}>
              <h6 style={{margin: 0, fontWeight: 700, fontSize: 22, color: '#222'}}>Upload Required Documents</h6>
              <div style={{color: '#666', fontSize: 15, marginTop: 4, marginBottom: 12}}>
                Please upload your credit report, eviction report, and any other required screening documents.
              </div>
            </div>
            <Form form={form} layout="vertical" onFinish={handleFinish}>
              <Form.Item label={<b>Credit Report</b>} name="credit_report" rules={[{ required: true, message: 'Credit report required' }]}> 
                <Upload beforeUpload={() => false} maxCount={1} accept=".pdf,.jpg,.png">
                  <Button icon={<UploadOutlined />}>Select Credit Report</Button>
                </Upload>
              </Form.Item>
              <Form.Item label={<b>Eviction Report</b>} name="eviction_report" rules={[{ required: true, message: 'Eviction report required' }]}> 
                <Upload beforeUpload={() => false} maxCount={1} accept=".pdf,.jpg,.png">
                  <Button icon={<UploadOutlined />}>Select Eviction Report</Button>
                </Upload>
              </Form.Item>
              <Form.Item label={<b>Other Screening Documents</b>} name="other_docs"> 
                <Upload beforeUpload={() => false} multiple accept=".pdf,.jpg,.png">
                  <Button icon={<UploadOutlined />}>Select Other Documents</Button>
                </Upload>
              </Form.Item>
              <Form.Item style={{marginTop: 18}}>
                <Button type="primary" htmlType="submit" block size="large">Submit Documents</Button>
              </Form.Item>
            </Form>
          </>
        )}
      </div>
    </div>
  );
}

