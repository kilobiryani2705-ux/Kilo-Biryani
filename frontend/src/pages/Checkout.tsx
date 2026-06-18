import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/api';

const UPI_ID   = '8830845733@ybl';
const UPI_NAME = 'Kilo Biryani';

const getUpiLink = (amount: number, orderId: string) =>
  `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(`Order #${orderId}`)}`;

const getQrUrl = (amount: number, orderId: string) => {
  const upiLink = getUpiLink(amount, orderId);
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`;
};

const generateOrderId = () =>
  'KB' + Date.now().toString().slice(-6);

export const Checkout: FC = () => {
  const navigate = useNavigate();
  const { items, getTotalAmount, clearCart } = useCart();
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    deliveryAddress: '',
    specialInstructions: '',
  });
  const [transactionId, setTransactionId]   = useState('');
  const [loading, setLoading]               = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [orderId] = useState(generateOrderId);
  const [isMobile, setIsMobile]             = useState(false);
  const [qrLoaded, setQrLoaded]             = useState(false);

  const totalAmount = getTotalAmount();

  // Detect mobile device
  useEffect(() => {
    setIsMobile(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.customerName.trim()) {
      alert('Please enter your name'); return false;
    }
    if (!formData.customerPhone.trim() || formData.customerPhone.length < 10) {
      alert('Please enter a valid 10-digit mobile number'); return false;
    }
    if (!formData.deliveryAddress.trim()) {
      alert('Please enter your delivery address'); return false;
    }
    return true;
  };

  const handleProceedToPayment = () => {
    if (validateForm()) setShowPaymentForm(true);
  };

  const handlePlaceOrder = async () => {
    if (!transactionId.trim()) {
      alert('Please enter the UPI transaction ID after payment'); return;
    }
    setLoading(true);
    try {
      await orderService.create({
        customerName:        formData.customerName,
        customerPhone:       formData.customerPhone,
        deliveryAddress:     formData.deliveryAddress,
        items,
        totalAmount,
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
            <button onClick={() => navigate('/menu')} className="btn-primary">Continue Shopping</button>
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

            {/* ── Step 1: Delivery Details ── */}
            {!showPaymentForm ? (
              <div className="rounded-3xl border border-white/10 bg-surface2 p-8 shadow-xl card-border">
                <h2 className="text-2xl font-bold mb-6">Delivery Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                    <input type="text" name="customerName" value={formData.customerName}
                      onChange={handleInputChange}
                      className="w-full rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-white"
                      placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Mobile Number</label>
                    <input type="tel" name="customerPhone" value={formData.customerPhone}
                      onChange={handleInputChange}
                      className="w-full rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-white"
                      placeholder="10-digit mobile number" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Delivery Address</label>
                    <textarea name="deliveryAddress" value={formData.deliveryAddress}
                      onChange={handleInputChange}
                      className="w-full rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-white"
                      placeholder="Your full delivery address" rows={3} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Special Instructions (Optional)</label>
                    <textarea name="specialInstructions" value={formData.specialInstructions}
                      onChange={handleInputChange}
                      className="w-full rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-white"
                      placeholder="Any special requests?" rows={2} />
                  </div>
                </div>
                <button onClick={handleProceedToPayment} className="w-full btn-primary mt-6">
                  Proceed to Payment
                </button>
              </div>

            ) : (
              /* ── Step 2: Payment ── */
              <div className="rounded-3xl border border-white/10 bg-surface2 p-8 shadow-xl card-border">
                <h2 className="text-2xl font-bold mb-2">Payment</h2>
                <p className="text-gray-400 text-sm mb-6">
                  Pay via UPI and enter the transaction ID to confirm your order.
                </p>

                {/* Amount banner */}
                <div className="rounded-2xl bg-brand/10 border border-brand/20 px-5 py-4 mb-6 flex items-center justify-between">
                  <span className="text-gray-300 text-sm font-medium">Amount to Pay</span>
                  <span className="text-brand text-2xl font-bold">₹{totalAmount.toFixed(2)}</span>
                </div>

                {/* Mobile: Pay Now button */}
                {isMobile && (
                  <a
                    href={getUpiLink(totalAmount, orderId)}
                    className="btn-primary w-full text-center block mb-4 text-base py-4"
                  >
                    📲 Pay ₹{totalAmount.toFixed(2)} with UPI
                  </a>
                )}

                {/* QR Code */}
                <div className="flex flex-col items-center my-6">
                  <p className="text-sm text-gray-400 mb-4">
                    {isMobile
                      ? 'Or scan this QR code from another phone:'
                      : 'Scan this QR code with any UPI app (GPay, PhonePe, Paytm):'}
                  </p>

                  <div className="rounded-2xl bg-white p-3 shadow-lg">
                    {!qrLoaded && (
                      <div className="w-48 h-48 flex items-center justify-center">
                        <span className="text-gray-400 text-sm">Loading QR...</span>
                      </div>
                    )}
                    <img
                      src={getQrUrl(totalAmount, orderId)}
                      alt="UPI QR Code"
                      width={200}
                      height={200}
                      className={qrLoaded ? 'block rounded-lg' : 'hidden'}
                      onLoad={() => setQrLoaded(true)}
                    />
                  </div>

                  <div className="mt-3 text-center">
                    <p className="text-xs text-gray-500">UPI ID</p>
                    <p className="text-sm font-mono text-brand mt-0.5">{UPI_ID}</p>
                  </div>
                </div>

                {/* UPI apps hint */}
                <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 mb-6 text-center">
                  <p className="text-xs text-gray-400">Works with GPay · PhonePe · Paytm · BHIM · Any UPI app</p>
                </div>

                {/* Transaction ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    UPI Transaction ID <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-white"
                    placeholder="e.g. 407154321234"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Find the transaction ID in your UPI app after payment.
                  </p>
                </div>

                <div className="flex flex-col gap-3 mt-6 sm:flex-row">
                  <button onClick={() => setShowPaymentForm(false)} className="flex-1 btn-secondary">
                    ← Back
                  </button>
                  <button onClick={handlePlaceOrder} disabled={loading} className="flex-1 btn-primary disabled:opacity-50">
                    {loading ? 'Placing Order...' : 'Confirm Order'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="rounded-3xl border border-white/10 bg-surface2 p-8 shadow-xl card-border h-fit">
            <h3 className="text-xl font-bold mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={`${item.productId}-${item.type}`} className="flex justify-between text-sm text-gray-300">
                  <span>{item.name} ({item.type}) × {item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 pt-4">
              <div className="flex justify-between font-bold text-lg text-white">
                <span>Total:</span>
                <span className="text-brand">₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Order ID */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-xs text-gray-500">Order Reference</p>
              <p className="text-sm font-mono text-gray-300 mt-0.5">{orderId}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};