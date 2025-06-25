import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSignUp, useSignIn } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

export default function SignUp() {
  const { signUp, setActive } = useSignUp();
  const { signIn } = useSignIn();
  const navigate = useNavigate();

  const [step, setStep] = useState('form'); // 'form' | 'verify'
  const [form, setForm] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle form input changes
  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Live validation for email and phone
    if (name === 'email') {
      if (!/^\S+@\S+\.\S+$/.test(value)) {
        setEmailError('Enter valid email');
      } else {
        setEmailError('');
      }
    }
    if (name === 'phone') {
      if (!/^\d{10}$/.test(value)) {
        setPhoneError('Enter 10 digit phone number');
      } else {
        setPhoneError('');
      }
    }
  };

  // Step 1: Handle sign up form submit
  const handleSubmit = async e => {
    console.log('handleSubmit called');
    console.log('Form submitted');
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      // Format phone number for Clerk (E.164)
      // Always send phone as +91 + 10 digits if present
      let phoneNumber = form.phone;
      if (phoneNumber && /^\d{10}$/.test(phoneNumber)) {
        phoneNumber = '+91' + phoneNumber;
      } else {
        phoneNumber = undefined;
      }
      // Clerk only accepts emailAddress and password by default. Remove names from payload unless enabled in Clerk dashboard.
const payload = {
  emailAddress: form.email,
  password: form.password
};
      // Do NOT send phoneNumber to Clerk (not E.164)
      console.log('Submitting sign up with:', payload);
      await signUp.create(payload);
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setStep('verify');
    } catch (err) {
      console.error('Sign up error:', err);
      if (err.errors && err.errors.length > 0) {
        setError(err.errors[0].message || 'Sign up failed');
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Sign up failed');
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Handle verification code submit
  const handleVerify = async e => {
    e.preventDefault();
    setError('');
    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      if (result.status === 'complete') {
        // Optionally auto sign in the user
        await setActive({ session: result.createdSessionId });
        navigate('/user-details'); // Redirect after login
      } else {
        setError('Verification incomplete.');
      }
    } catch (err) {
      console.error('Verification error:', err);
      if (err.errors && err.errors.length > 0) {
        setError(err.errors[0].message || 'Verification failed');
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Verification failed');
      }
    }
  };

  return (
    <>
    <Navbar />
    <div className="auth-container">
      <div className="auth-logo-wrapper">
        <img className="auth-logo-img" src="assets/images/favicon.png" alt="RMS Logo" />
      </div>
      <div className="auth-card">
        {step === 'form' ? (
          <form onSubmit={handleSubmit}>
            <h6 className="auth-title">Sign Up</h6>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="firstName" style={{ color: '#96351E', fontWeight: 500, marginBottom: 4 }}>First Name</label>
                <input
                  className="auth-input"
                  style={{ flex: 1 }}
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <label htmlFor="lastName" style={{ color: '#96351E', fontWeight: 500, marginBottom: 4 }}>Last Name</label>
                <input
                  className="auth-input"
                  style={{ flex: 1 }}
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column' }}>
              <label htmlFor="email" style={{ color: '#96351E', fontWeight: 500, marginBottom: 4 }}>
                Email <span style={{ color: 'red', fontWeight: 'bold', fontSize: '1.2em', lineHeight: 1 }}>*</span>
              </label>
              <input
                className="auth-input"
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                onBlur={e => {
                  const value = e.target.value;
                  if (!/^\S+@\S+\.\S+$/.test(value)) {
                    setEmailError('Enter valid email');
                  } else {
                    setEmailError('');
                  }
                }}
              />
              {emailError && <span style={{ color: 'red', fontSize: '0.9em', marginTop: 2 }}>{emailError}</span>}
            </div>
            <div style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column' }}>
              <label htmlFor="phone" style={{ color: '#96351E', fontWeight: 500, marginBottom: 4 }}>
                Phone Number <span style={{ color: 'red', fontWeight: 'bold', fontSize: '1.2em', lineHeight: 1 }}>*</span>
              </label>
              <input
                className="auth-input"
                type="tel"
                id="phone"
                name="phone"
                placeholder="10 digit phone number"
                maxLength={10}
                pattern="\d{10}"
                value={form.phone}
                onChange={e => {
                  // Only allow digits
                  const val = e.target.value.replace(/[^\d]/g, '');
                  setForm({ ...form, phone: val });
                  if (!/^\d{10}$/.test(val)) {
                    setPhoneError('Enter 10 digit phone number');
                  } else {
                    setPhoneError('');
                  }
                }}
                onBlur={e => {
                  const value = e.target.value;
                  if (value && !/^\d{10}$/.test(value)) {
                    setPhoneError('Enter 10 digit phone number');
                  } else {
                    setPhoneError('');
                  }
                }}
              />
              {phoneError && <span style={{ color: 'red', fontSize: '0.9em', marginTop: 2 }}>{phoneError}</span>}
            </div>
            <div style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column' }}>
              <label htmlFor="password" style={{ color: '#96351E', fontWeight: 500, marginBottom: 4 }}>Password</label>
              <input
                className="auth-input"
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <div style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column' }}>
              <label htmlFor="confirmPassword" style={{ color: '#96351E', fontWeight: 500, marginBottom: 4 }}>Confirm Password</label>
              <input
                className="auth-input"
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            {/* Only one Sign Up button, disabled only if email is invalid or empty */}
{(!!emailError || !form.email) && (
  <div style={{ color: 'orange', marginBottom: 8 }}>
    {emailError ? emailError : !form.email ? 'Email is required.' : ''}
  </div>
)}
<button className="auth-btn" type="submit" disabled={!!emailError || !form.email || loading}>
  {loading ? 'Signing up...' : 'Sign Up'}
</button>
            {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
          </form>
        ) : (
          <form onSubmit={handleVerify}>
            <h2 className="auth-title">Verify Email</h2>
            {step === 'verify' && (
              <>
                <div style={{
                  background: '#f8d4cc',
                  color: '#96351E',
                  padding: '1rem',
                  borderRadius: '6px',
                  marginBottom: '1rem',
                  fontWeight: 500,
                  textAlign: 'center',
                  fontSize: '1.05em'
                }}>
                  A verification code has been sent to your email. Please check your inbox and enter the code below.
                </div>
              </>
            )}
            <input
              className="auth-input"
              type="text"
              name="code"
              placeholder="Verification Code"
              value={code}
              onChange={e => setCode(e.target.value)}
              required
            />
            <button className="auth-btn" type="submit">Verify</button>
            {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
          </form>
        )}
      </div>
    </div>
    </>
  );
}