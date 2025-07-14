import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';

export default function ResetPasswordForm() {
  const { uid, token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const res = await fetch(`https://hemanth525.pythonanywhere.com/user/reset-password/${uid}/${token}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMessage('✅ Password reset successful. Redirecting to login...');
        setTimeout(() => navigate('/'), 3000);
      } else {
        setError(data.error || '❌ Password reset failed');
      }
    } catch (err) {
      setError('❌ Network error');
    }
  };

  return (
    <div
      className="position-relative"
      style={{
        minHeight: '100vh',
        backgroundImage: "url('/assets/images/auth/auth-img.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 5%',
      }}
    >
      <div
        style={{
          maxWidth: 380,
          width: '100%',
          background: '#fff',
          padding: 36,
          borderRadius: 18,
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          textAlign: 'center',
        }}
      >
        <div>
          <Link to='/'>
            <img src='/assets/images/logo.png' alt='RMS Logo' style={{ maxWidth: 120, marginBottom: 12 }} />
          </Link>
          <h2 style={{ fontSize: 35,fontWeight:'bold', color: '#1a237e' }}>Reset Password</h2>
          <p style={{ fontSize: 15, color: '#6c757d' }}>Set your new password below.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ textAlign: 'center' }}>
          <div className='mb-3'>
            <label style={{ fontWeight: 600, color: '#1a237e', display: 'block', textAlign: 'left' }}>New Password</label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                borderRadius: 6,
                border: '1px solid #b0bec5',
                padding: '0.4em 0.8em',
                fontSize: '0.95rem',
                marginBottom: '1em',
                width: '100%',
                background: '#e3f2fd',
                transition: 'border 0.2s',
              }}
              placeholder='Enter new password'
              required
            />
          </div>

          <div className='mb-3'>
            <label style={{ fontWeight: 600, color: '#1a237e', display: 'block', textAlign: 'left' }}>Confirm Password</label>
            <input
              type='password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{
                borderRadius: 6,
                border: '1px solid #b0bec5',
                padding: '0.4em 0.8em',
                fontSize: '0.95rem',
                marginBottom: '1em',
                width: '100%',
                background: '#e3f2fd',
                transition: 'border 0.2s',
              }}
              placeholder='Confirm new password'
              required
            />
          </div>

          {error && <div className='text-danger mb-2' style={{ fontSize: 14 }}>{error}</div>}
          {successMessage && <div className='text-success mb-2' style={{ fontSize: 14 }}>{successMessage}</div>}

          <div>
            <button
              type='submit'
              style={{
                background: '#f4a261',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                fontWeight: 'bold',
                fontSize: '1.2rem',
                width: '50%',
                padding: '0.6em 0',
                marginBottom: '0.6em',
                transition: 'background 0.2s',
              }}
            >
              Reset 
            </button>
          </div>

          <div className='mt-2'>
            <Link to='/' style={{ color: '#1976d2', fontWeight: 600, textDecoration: 'underline' }}>
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}