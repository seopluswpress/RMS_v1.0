// SignUp.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

export default function SignUp() {

  const GOOGLE_CLIENT_ID = "230293164062-d9soskfk1uqflleoo88k7q1djkrdk2av.apps.googleusercontent.com";

  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://hemanth525.pythonanywhere.com/user/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, type: 'property_owner' })
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/');
      } else {
        setError(data?.email?.[0] || data?.password?.[0] || 'Registration failed');
      }
    } catch (err) {
      setError('Registration error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className='auth d-flex' style={{ minHeight: '100vh' }}>
      <div className='auth-left d-none d-lg-block' style={{ flex: 1 }}>
        <img src='assets/images/auth/auth-img.jpg' alt='' style={{ width: '100%', height: '100vh', objectFit: 'cover' }} />
      </div>
      <div className='auth-right d-flex align-items-center justify-content-center' style={{ flex: 1 }}>
        <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 420, background: '#fff', padding: 30, borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.05)' }}>
          <div className='text-center mb-4'>
            <img src='assets/images/logo.png' alt='RMS' style={{ maxWidth: 140 }} />
            <h4 className='mt-3'>Register Now</h4>
          </div>
          <div className="mb-3">
            <label>Username</label>
            <input name="username" required className="form-control" value={form.username} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label>Email</label>
            <input name="email" type="email" required className="form-control" value={form.email} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input name="password" type="password" required className="form-control" value={form.password} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label>Confirm Password</label>
            <input name="confirmPassword" type="password" required className="form-control" value={form.confirmPassword} onChange={handleChange} />
          </div>
          {error && <div className="text-danger text-center mb-2">{error}</div>}
          <button type="submit" className="btn btn-primary w-100">{loading ? 'Signing up...' : 'Sign Up'}</button>
          <div className="mt-4 text-center">
          <div className='text-center my-3' style={{ fontWeight: 500, color: '#888' }}>
            or
          </div>
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <GoogleLogin
              onSuccess={async ({ credential }) => {
                try {
                  const response = await fetch("https://hemanth525.pythonanywhere.com/user/api/google-auth/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_token: credential })
          });

          const data = await response.json();
          if (response.ok) {
            localStorage.setItem("access", data.access);
            localStorage.setItem("refresh", data.refresh);
            localStorage.setItem("user", JSON.stringify(data.user));
            navigate("/dashboard");
          } else {
            setError(data.detail || "Google login failed");
          }
        } catch (err) {
          setError("Google login error");
        }
      }}
      onError={() => setError("Google login failed")}
    />
  </GoogleOAuthProvider>
</div>

        </form>
      </div>
    </section>
  );
}
