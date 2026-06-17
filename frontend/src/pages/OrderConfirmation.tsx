import type { FC } from 'react';
import { Link } from 'react-router-dom';

export const OrderConfirmation: FC = () => {
  return (
    <div className="bg-black min-h-screen text-white">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="rounded-3xl border border-white/10 bg-surface2 p-10 text-center shadow-xl card-border">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-brand mb-3">Order Placed Successfully!</h1>
          <p className="text-gray-300 mb-8">
            Thank you for your order. We've received your payment and will start preparing your biryani.
          </p>

          <div className="rounded-3xl border border-white/10 bg-black/60 p-6 mb-8 text-left">
            <h2 className="font-bold text-lg text-white mb-4">What's Next?</h2>
            <ul className="space-y-2 text-gray-300">
              <li>✓ We've verified your payment</li>
              <li>✓ Your order is being prepared</li>
              <li>✓ You'll receive a call once it's ready for delivery</li>
              <li>✓ Our delivery partner will bring it to your doorstep</li>
            </ul>
          </div>

          <div className="space-y-4">
            <p className="text-gray-300">
              <strong>Order Reference:</strong> Check your email or SMS for order details
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link to="/menu" className="btn-secondary">
                Order More
              </Link>
              <Link to="/" className="btn-primary">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
