import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useSubscriptionProperties(userId) {
  const [limit, setLimit] = useState(null); // { max_properties, max_units }
  const [current, setCurrent] = useState({ properties: 0, units: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    axios
      .get(`https://hemanth525.pythonanywhere.com/accounts/api/subscribe/?user_id=${userId}`)
      .then(res => {
        const props = res.data?.properties || [];
        const plan = res.data?.plan || {};
        // Plan limit extraction logic - adjust keys as needed
        setLimit({
          max_properties: plan.max_properties ?? plan.property_limit ?? 1,
          max_units: plan.max_units ?? plan.unit_limit ?? 1,
        });
        let propertyCount = props.length;
        let unitCount = props.reduce((acc, p) => acc + (p.units ? p.units.length : 0), 0);
        setCurrent({ properties: propertyCount, units: unitCount });
      })
      .catch(err => {
        setError('Failed to fetch subscription properties');
        setLimit(null);
        setCurrent({ properties: 0, units: 0 });
      })
      .finally(() => setLoading(false));
  }, [userId]);

  return { limit, current, loading, error };
}
