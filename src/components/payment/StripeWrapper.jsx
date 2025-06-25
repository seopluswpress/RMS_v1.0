// StripeWrapper.jsx
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe("pk_test_51RJCfb4JYgndTz0JNfAdqffcCtIcH0uc1dOlFgwxWMmJvsm2lt6GJloFXp9ukTkVM4504Kn720zmBKxrEZYDbFVt00tz3ftxHi");

export default function StripeWrapper({ clientSecret, invoice }) {
  const options = {
    clientSecret,
    appearance: { theme: 'stripe' },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm invoice={invoice} />
    </Elements>
  );
}
