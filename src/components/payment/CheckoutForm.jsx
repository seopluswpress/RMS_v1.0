// CheckoutForm.jsx
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useState } from 'react';

export default function CheckoutForm({ invoice }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await stripe.confirmPayment({
  elements,
  confirmParams: {
  return_url: `http://localhost:3000/payment-success/${invoice.invoice_id}`,
}
});

    if (error) {
      alert(error.message);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Invoice: {invoice.invoice_id}</h3>
      <p>Amount: ${invoice.amount}</p>

      <PaymentElement />

      <button type="submit" disabled={!stripe || loading}>
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
}
