// StripeWrapper.jsx
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe("pk_test_51R1kxKKoXpRZrhi2mmwIprNPKdUFHCN5oR7noYByteNpNcnVHvLxXaGsk7onUpR9G0AzArmtDMVKl6fd4n8uD7mM003piboMP2");

export default function StripeWrapper({ clientSecret, invoice }) {
  const options = {
    clientSecret, // ✅ FIXED: use the prop passed to this component
    appearance: { theme: 'stripe' },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm invoice={invoice} />
    </Elements>
  );
}
