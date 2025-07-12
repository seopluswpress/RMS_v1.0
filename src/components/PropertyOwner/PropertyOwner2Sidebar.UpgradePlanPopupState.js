// Extracted logic for subscription status, daysLeft, planDetails for reuse
import { useState, useEffect } from 'react';
import axios from 'axios';

export function useUpgradePlanPopupState() {
  const [status, setStatus] = useState('loading');
  const [daysLeft, setDaysLeft] = useState(null);
  const [planDetails, setPlanDetails] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('access');

    if (!user || !token) {
      setStatus('no_user');
      return;
    }

    axios.get(`/accounts/api/subscribe/?user_id=${user.user_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.data.status === 'success') {
          const { end_date, plan, price, start_date } = res.data.subscription;
          setPlanDetails({ plan, price, start_date, end_date });
          const endDate = new Date(end_date);
          const now = new Date();
          const diff = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
          if (diff > 0) {
            setStatus('trial');
            setDaysLeft(diff);
          } else {
            setStatus('expired');
            setDaysLeft(0);
          }
        } else {
          setStatus('expired');
        }
      })
      .catch(() => setStatus('expired'));
  }, []);

  return { status, daysLeft, planDetails };
}
