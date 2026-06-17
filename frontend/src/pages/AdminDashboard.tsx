import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { adminService } from '../services/api';
import type { DashboardData } from '../types';

export const AdminDashboard: FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      alert('Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      await adminService.login(email, password);
      setIsLoggedIn(true);
      fetchDashboardData();
    } catch (error) {
      console.error('Login failed:', error);
      alert('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const data = await adminService.getDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      const interval = setInterval(fetchDashboardData, 10000); // Refresh every 10 seconds
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="bg-black min-h-screen text-white">
        <div className="max-w-md mx-auto px-4 py-16">
          <div className="rounded-3xl border border-white/10 bg-surface2 p-8 shadow-xl card-border">
            <h1 className="text-3xl font-bold text-center mb-8">Admin Login</h1>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/60 px-3 py-3 text-white"
                  placeholder="admin@biryani.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/60 px-3 py-3 text-white"
                  placeholder="••••••••"
                />
              </div>
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full btn-primary"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-4 text-center">
              Default: admin@biryani.com / admin123
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="bg-black min-h-screen text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <p className="text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
      <div className="bg-black min-h-screen text-white">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <button
              onClick={() => {
                setIsLoggedIn(false);
                setEmail('');
                setPassword('');
              }}
              className="btn-secondary"
            >
              Logout
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className="rounded-3xl border border-white/10 bg-surface2 p-6 shadow-xl card-border">
              <p className="text-gray-400 text-sm">Total Orders</p>
              <p className="text-3xl font-bold text-brand">{dashboardData.totalOrders}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-surface2 p-6 shadow-xl card-border">
              <p className="text-gray-400 text-sm">Pending Orders</p>
              <p className="text-3xl font-bold text-brand">{dashboardData.pendingOrders}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-surface2 p-6 shadow-xl card-border">
              <p className="text-gray-400 text-sm">Completed Orders</p>
              <p className="text-3xl font-bold text-brand">{dashboardData.completedOrders}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-surface2 p-6 shadow-xl card-border">
              <p className="text-gray-400 text-sm">Total Products</p>
              <p className="text-3xl font-bold text-brand">{dashboardData.totalProducts}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-surface2 p-6 shadow-xl card-border">
              <p className="text-gray-400 text-sm">Total Revenue</p>
              <p className="text-3xl font-bold text-brand">₹{dashboardData.totalRevenue}</p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-surface2 shadow-xl overflow-hidden card-border">
            <div className="px-6 py-4 border-b border-white/10">
              <h2 className="text-xl font-bold">Recent Orders</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-black/50 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm text-gray-400">Order #</th>
                    <th className="px-6 py-3 text-left text-sm text-gray-400">Customer</th>
                    <th className="px-6 py-3 text-left text-sm text-gray-400">Amount</th>
                    <th className="px-6 py-3 text-left text-sm text-gray-400">Payment</th>
                    <th className="px-6 py-3 text-left text-sm text-gray-400">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.recentOrders.map((order) => (
                    <tr key={order._id} className="border-b border-white/10 hover:bg-white/5">
                      <td className="px-6 py-3 text-gray-200">{order.orderNumber}</td>
                      <td className="px-6 py-3 text-gray-200">{order.customerName}</td>
                      <td className="px-6 py-3 text-gray-200">₹{order.totalAmount}</td>
                      <td className="px-6 py-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            order.paymentStatus === 'completed'
                              ? 'bg-yellow-100 text-black'
                              : order.paymentStatus === 'pending'
                              ? 'bg-white/10 text-white'
                              : 'bg-red-100 text-red-900'
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            order.orderStatus === 'delivered'
                              ? 'bg-white/10 text-white'
                              : order.orderStatus === 'pending'
                              ? 'bg-brand text-black'
                              : order.orderStatus === 'preparing'
                              ? 'bg-white/10 text-white'
                              : 'bg-white/10 text-white'
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
  );
};
