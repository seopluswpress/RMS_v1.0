import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SubscriptionSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Optionally: verify the session_id from URL with your backend
    // const params = new URLSearchParams(window.location.search);
    // const sessionId = params.get('session_id');
    // You could call your backend here to verify the session

    // Get user info from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      if (user.is_superuser) {
        navigate('/admin/dashboard');
      } else if (user.role === 'property_owner') {
        navigate('/owner/dashboard');
      } else if (user.role === 'tenant') {
        navigate('/tenant/dashboard');
      } else {
        navigate('/dashboard'); // fallback
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div style={{ textAlign: 'center', marginTop: '3rem' }}>
      <h2>Processing your subscription...</h2>
      <p>You will be redirected to your dashboard shortly.</p>
    </div>
  );
};

export default SubscriptionSuccess;
