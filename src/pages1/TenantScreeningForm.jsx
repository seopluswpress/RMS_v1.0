import React, { useState } from 'react';
import { Form, Input, DatePicker, Button, Radio, Select } from 'antd';
import TenantScreeningUpload from './TenantScreeningUpload';

export default function TenantScreeningForm({ onNext }) {
  const [form] = Form.useForm();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    try {
      setLoading(true);
      console.log('Raw form values:', values);
      
      // Convert AntD values for backend compatibility
      const data = {
        ...values,
        dob: values.dob ? values.dob.format('YYYY-MM-DD') : undefined,
        eviction_history: values.eviction_history === 'yes',
        criminal_record: values.criminal_record === 'yes',
        credit_score: values.credit_score ? Number(values.credit_score) : undefined,
        monthly_income: values.monthly_income ? Number(values.monthly_income) : undefined,
      };
      
      console.log('Processed form data:', data);
      setFormData(data);
      setStep(2); // Go to upload step
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Form validation failed:', errorInfo);
    // Scroll to first error field
    const firstErrorField = errorInfo.errorFields[0];
    if (firstErrorField) {
      form.scrollToField(firstErrorField.name);
    }
  };

  if (step === 2) {
    return <TenantScreeningUpload onFinish={(uploadData) => {
      // You can combine formData + uploadData and send to backend here
      console.log('All data:', { ...formData, ...uploadData });
      // Optionally show a thank you message or redirect
      if (onNext) {
        onNext({ ...formData, ...uploadData });
      }
    }} />;
  }

  return (
    <div style={{
      minHeight: '100vh',
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
      }}>
        {/* Logo (optional) */}
        <div style={{textAlign: 'center', marginBottom: 16}}>
          <img src="/favicon.png" alt="Logo" style={{ width: 48, height: 48, marginBottom: 8, borderRadius: 8 }} />
          <h6 style={{margin: 0, fontWeight: 700, fontSize: 26, color: '#222'}}>Tenant Screening Form</h6>
          <div style={{color: '#666', fontSize: 15, marginTop: 4, marginBottom: 12}}>Please fill out your details for the rental application</div>
        </div>
        
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          style={{ marginTop: 12 }}
          validateTrigger="onSubmit"
        >
          {/* Basic Info */}
          <Form.Item 
            label={<b>Full Name</b>} 
            name="full_name" 
            rules={[{ 
              required: true, 
              message: 'Full Name is required',
              whitespace: true 
            }]}
          > 
            <Input size="large" placeholder="Enter your full name" /> 
          </Form.Item>
          
          <Form.Item 
            label={<b>Email</b>} 
            name="email" 
            rules={[{ 
              required: true, 
              type: 'email', 
              message: 'Please enter a valid email address' 
            }]}
          > 
            <Input size="large" placeholder="Enter your email" /> 
          </Form.Item>
          
          <Form.Item 
            label={<b>Phone</b>} 
            name="phone" 
            rules={[{ 
              required: true, 
              message: 'Phone number is required',
              whitespace: true 
            }]}
          > 
            <Input size="large" placeholder="Enter your phone number" /> 
          </Form.Item>
          
          <Form.Item 
            label={<b>Date of Birth</b>} 
            name="dob" 
            rules={[{ 
              required: true, 
              message: 'Date of birth is required' 
            }]}
          > 
            <DatePicker 
              style={{ width: '100%' }} 
              size="large" 
              placeholder="Select date"
              format="YYYY-MM-DD"
            /> 
          </Form.Item>
          
          <Form.Item 
            label={<b>Current Address</b>} 
            name="address" 
            rules={[{ 
              required: true, 
              message: 'Current address is required',
              whitespace: true 
            }]}
          > 
            <Input.TextArea 
              rows={2} 
              placeholder="Enter your current address" 
              size="large" 
            /> 
          </Form.Item>

          {/* Screening Details Section */}
          <div style={{margin: '24px 0 8px 0', fontWeight: 600, fontSize: 17, color: '#2e7dff'}}>
            Screening Details
          </div>
          
          <Form.Item 
            label={<b>Credit Score</b>} 
            name="credit_score" 
            rules={[{ 
              required: true, 
              message: 'Credit score is required' 
            }, {
              pattern: /^[0-9]+$/,
              message: 'Please enter a valid credit score'
            }]}
          > 
            <Input 
              type="number" 
              size="large" 
              placeholder="e.g. 700" 
              min={300} 
              max={850} 
            /> 
          </Form.Item>
          
          <Form.Item 
            label={<b>Eviction History</b>} 
            name="eviction_history" 
            rules={[{ 
              required: true, 
              message: 'Please select eviction history' 
            }]}
          > 
            <Radio.Group>
              <Radio value="yes">Yes</Radio>
              <Radio value="no">No</Radio>
            </Radio.Group>
          </Form.Item>
          
          <Form.Item 
            label={<b>Criminal Record</b>} 
            name="criminal_record" 
            rules={[{ 
              required: true, 
              message: 'Please select criminal record status' 
            }]}
          > 
            <Radio.Group>
              <Radio value="yes">Yes</Radio>
              <Radio value="no">No</Radio>
            </Radio.Group>
          </Form.Item>
          
          <Form.Item 
            label={<b>Employment Status</b>} 
            name="employment_status" 
            rules={[{ 
              required: true, 
              message: 'Employment status is required' 
            }]}
          > 
            <Select size="large" placeholder="Select employment status">
              <Select.Option value="Employed">Employed</Select.Option>
              <Select.Option value="Self-employed">Self-employed</Select.Option>
              <Select.Option value="Unemployed">Unemployed</Select.Option>
              <Select.Option value="Student">Student</Select.Option>
              <Select.Option value="Retired">Retired</Select.Option>
              <Select.Option value="Other">Other</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item 
            label={<b>Monthly Income</b>} 
            name="monthly_income" 
            rules={[{ 
              required: true, 
              message: 'Monthly income is required' 
            }, {
              pattern: /^[0-9]+$/,
              message: 'Please enter a valid income amount'
            }]}
          > 
            <Input 
              type="number" 
              size="large" 
              placeholder="e.g. 50000" 
              min={0} 
              prefix="$" 
            />
          </Form.Item>

          <Form.Item style={{marginTop: 18}}>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              size="large" 
              loading={loading}
              style={{
                fontWeight: 600, 
                letterSpacing: 1, 
                background: '#2e7dff', 
                border: 'none'
              }}
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}