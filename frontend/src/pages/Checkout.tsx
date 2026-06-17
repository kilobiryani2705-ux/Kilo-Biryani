import type { FC } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/api';

export const Checkout: FC = () => {
  const navigate = useNavigate();
  const { items, getTotalAmount, clearCart } = useCart();
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    deliveryAddress: '',
    specialInstructions: '',
  });
  const [transactionId, setTransactionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.customerName.trim()) {
      alert('Please enter your name');
      return false;
    }
    if (!formData.customerPhone.trim() || formData.customerPhone.length < 10) {
      alert('Please enter a valid mobile number');
      return false;
    }
    if (!formData.deliveryAddress.trim()) {
      alert('Please enter your delivery address');
      return false;
    }
    return true;
  };

  const handleProceedToPayment = () => {
    if (validateForm()) {
      setShowPaymentForm(true);
    }
  };

  const handlePlaceOrder = async () => {
    if (!transactionId.trim()) {
      alert('Please enter the UPI transaction ID');
      return;
    }

    setLoading(true);
    try {
      await orderService.create({
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        deliveryAddress: formData.deliveryAddress,
        items,
        totalAmount: getTotalAmount(),
        paymentTransactionId: transactionId,
        specialInstructions: formData.specialInstructions,
      });

      clearCart();
      navigate('/order-confirmation');
    } catch (error) {
      console.error('Failed to place order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && !showPaymentForm) {
    return (
      <div className="bg-black min-h-screen text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="rounded-3xl border border-white/10 bg-surface2 p-10 shadow-xl card-border text-center">
            <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-gray-400 mb-6">Add a delicious biryani to your cart and continue with checkout.</p>
            <button
              onClick={() => navigate('/menu')}
              className="btn-primary"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {!showPaymentForm ? (
              <div className="rounded-3xl border border-white/10 bg-surface2 p-8 shadow-xl card-border">
                <h2 className="text-2xl font-bold mb-6">Delivery Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      className="w-full rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-white"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Mobile Number</label>
                    <input
                      type="tel"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleInputChange}
                      className="w-full rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-white"
                      placeholder="Your mobile number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Delivery Address</label>
                    <textarea
                      name="deliveryAddress"
                      value={formData.deliveryAddress}
                      onChange={handleInputChange}
                      className="w-full rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-white"
                      placeholder="Your delivery address"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Special Instructions (Optional)</label>
                    <textarea
                      name="specialInstructions"
                      value={formData.specialInstructions}
                      onChange={handleInputChange}
                      className="w-full rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-white"
                      placeholder="Any special requests?"
                      rows={2}
                    />
                  </div>
                </div>
                <button
                  onClick={handleProceedToPayment}
                  className="w-full btn-primary mt-6"
                >
                  Proceed to Payment
                </button>
              </div>
            ) : (
              <div className="rounded-3xl border border-white/10 bg-surface2 p-8 shadow-xl card-border">
                <h2 className="text-2xl font-bold mb-6">Payment Details</h2>
                <div className="rounded-3xl border border-brand/20 bg-white/5 p-5 mb-6">
                  <p className="text-sm text-gray-300">
                    Scan the QR code with any UPI app (Google Pay, PhonePe, Paytm, etc.) and send the payment.
                  </p>
                </div>

                <div className="flex justify-center my-8">
                  <div className="rounded-3xl border border-white/10 bg-black/60 p-6">
                    <div className="w-48 h-48 bg-white/10 flex items-center justify-center rounded-3xl">
                      <span className="text-gray-400">QR Code Placeholder</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-black/60 p-5 mb-6">
                  <p className="text-sm text-gray-300 mb-2">
                    <strong>Amount to Pay:</strong> <span className="text-brand">₹{getTotalAmount().toFixed(2)}</span>
                  </p>
                  <p className="text-sm text-gray-300">
                    <strong>Recipient:</strong> Kilo Biryani
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Enter UPI Transaction ID
                  </label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-white"
                    placeholder="Transaction ID (e.g., UPI123456789)"
                  />
                </div>

                <div className="flex flex-col gap-4 mt-6 sm:flex-row">
                  <button
                    onClick={() => setShowPaymentForm(false)}
                    className="flex-1 btn-secondary"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="flex-1 btn-primary"
                  >
                    {loading ? 'Placing Order...' : 'Place Order'}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-white/10 bg-surface2 p-8 shadow-xl card-border">
            <h3 className="text-xl font-bold mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={`${item.productId}-${item.type}`} className="flex justify-between text-sm text-gray-300">
                  <span>
                    {item.name} ({item.type}) x {item.quantity}
                  </span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 pt-4">
              <div className="flex justify-between font-bold text-lg text-white">
                <span>Total:</span>
                <span className="text-brand">₹{getTotalAmount().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
