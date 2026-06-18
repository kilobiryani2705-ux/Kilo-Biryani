// import type { FC } from 'react';
// import { useState, useEffect, useRef } from 'react';
// import { adminService, productService, orderService } from '../services/api';
// import { Link } from 'react-router-dom';
// import type { DashboardData } from '../types';

// export const AdminDashboard: FC = () => {
//   const [isLoggedIn, setIsLoggedIn]       = useState(false);
//   const [email, setEmail]                 = useState('');
//   const [password, setPassword]           = useState('');
//   const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
//   const [loading, setLoading]             = useState(false);
//   const [errorMessage, setErrorMessage]   = useState('');

//   // Product form
//   const [productName, setProductName]               = useState('');
//   const [productDescription, setProductDescription] = useState('');
//   const [imageFile, setImageFile]                   = useState<File | null>(null);
//   const [imagePreview, setImagePreview]             = useState<string | null>(null);
//   const [pricePlate, setPricePlate]                 = useState(0);
//   const [priceHalfKg, setPriceHalfKg]               = useState(0);
//   const [priceKg, setPriceKg]                       = useState(0);
//   const [productLoading, setProductLoading]         = useState(false);
//   const [productMessage, setProductMessage]         = useState('');
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const handleLogin = async () => {
//     if (!email.trim() || !password.trim()) { alert('Please enter email and password'); return; }
//     setLoading(true);
//     setErrorMessage('');
//     try {
//       await adminService.login(email, password);
//       setIsLoggedIn(true);
//       fetchDashboardData();
//     } catch (error) {
//       setErrorMessage((error as Error).message || 'Invalid credentials');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchDashboardData = async () => {
//     try {
//       const data = await adminService.getDashboard();
//       setDashboardData(data);
//     } catch (error) {
//       setErrorMessage('Unable to load dashboard data.');
//     }
//   };

//   useEffect(() => {
//     if (isLoggedIn) {
//       const interval = setInterval(fetchDashboardData, 10000);
//       return () => clearInterval(interval);
//     }
//   }, [isLoggedIn]);

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setImageFile(file);
//     setImagePreview(URL.createObjectURL(file));
//   };

//   const handleCreateProduct = async () => {
//     if (!productName || !productDescription || !imageFile || pricePlate <= 0 || priceHalfKg <= 0 || priceKg <= 0) {
//       setProductMessage('Please fill all fields and select an image.');
//       return;
//     }

//     setProductLoading(true);
//     setProductMessage('Uploading image...');

//     try {
//       // Step 1: upload image to Cloudinary via backend
//       console.log('📤 Uploading image:', imageFile.name);
//       const uploadRes = await productService.uploadImage(imageFile);
//       console.log('✅ Image URL:', uploadRes.url);

//       // Step 2: create product with the Cloudinary URL
//       setProductMessage('Saving product...');
//       await productService.create({
//         name:        productName,
//         description: productDescription,
//         image:       uploadRes.url,
//         prices:      { plate: pricePlate, halfKg: priceHalfKg, kg: priceKg },
//         available:   true,
//       });

//       setProductMessage('✅ Product added successfully!');
//       setProductName('');
//       setProductDescription('');
//       setImageFile(null);
//       setImagePreview(null);
//       setPricePlate(0);
//       setPriceHalfKg(0);
//       setPriceKg(0);
//       if (fileInputRef.current) fileInputRef.current.value = '';
//       fetchDashboardData();
//     } catch (error) {
//       console.error('Failed to create product:', error);
//       setProductMessage('❌ Failed to add product: ' + (error as Error).message);
//     } finally {
//       setProductLoading(false);
//     }
//   };

//   if (!isLoggedIn) {
//     return (
//       <div className="bg-black min-h-screen text-white">
//         <div className="max-w-md mx-auto px-4 py-16">
//           <div className="rounded-3xl border border-white/10 bg-surface2 p-8 shadow-xl card-border">
//             <h1 className="text-3xl font-bold text-center mb-8">Admin Login</h1>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
//                 <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
//                   className="w-full rounded-2xl border border-white/10 bg-black/60 px-3 py-3 text-white"
//                   placeholder="admin@biryani.com" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
//                 <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
//                   className="w-full rounded-2xl border border-white/10 bg-black/60 px-3 py-3 text-white"
//                   placeholder="••••••••" />
//               </div>
//               <button onClick={handleLogin} disabled={loading} className="w-full btn-primary">
//                 {loading ? 'Logging in...' : 'Login'}
//               </button>
//             </div>
//             {errorMessage && <p className="text-sm text-red-400 mt-4 text-center">{errorMessage}</p>}
//             <p className="text-sm text-gray-500 mt-4 text-center">Default: admin@biryani.com / admin123</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!dashboardData) {
//     return (
//       <div className="bg-black min-h-screen text-white">
//         <div className="max-w-7xl mx-auto px-4 py-16 text-center">
//           <p className="text-gray-300">Loading dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-black min-h-screen text-white">
//       <div className="max-w-7xl mx-auto px-4 py-10">
//         <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8">
//           <h1 className="text-3xl font-bold">Admin Dashboard</h1>
//           <div className="flex gap-3 items-center">
//             <Link to="/admin/products" className="btn-secondary">Manage Products</Link>
//             <button onClick={() => { setIsLoggedIn(false); setEmail(''); setPassword(''); }} className="btn-secondary">
//               Logout
//             </button>
//           </div>
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
//           {[
//             { label: 'Total Orders',     value: dashboardData.totalOrders },
//             { label: 'Pending Orders',   value: dashboardData.pendingOrders },
//             { label: 'Completed Orders', value: dashboardData.completedOrders },
//             { label: 'Total Products',   value: dashboardData.totalProducts },
//             { label: 'Total Revenue',    value: `₹${dashboardData.totalRevenue}` },
//           ].map((stat) => (
//             <div key={stat.label} className="rounded-3xl border border-white/10 bg-surface2 p-6 shadow-xl card-border">
//               <p className="text-gray-400 text-sm">{stat.label}</p>
//               <p className="text-3xl font-bold text-brand">{stat.value}</p>
//             </div>
//           ))}
//         </div>

//         {/* Recent Orders */}
//         <div className="rounded-3xl border border-white/10 bg-surface2 shadow-xl overflow-hidden card-border mb-8">
//           <div className="px-6 py-4 border-b border-white/10">
//             <h2 className="text-xl font-bold">Recent Orders</h2>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-black/50 border-b border-white/10">
//                 <tr>
//                   {['Order #', 'Customer', 'Amount', 'Payment', 'Status'].map(h => (
//                     <th key={h} className="px-6 py-3 text-left text-sm text-gray-400">{h}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {dashboardData.recentOrders.map((order) => (
//                   <tr key={order._id} className="border-b border-white/10 hover:bg-white/5">
//                     <td className="px-6 py-3 text-gray-200">{order.orderNumber}</td>
//                     <td className="px-6 py-3 text-gray-200">{order.customerName}</td>
//                     <td className="px-6 py-3 text-gray-200">₹{order.totalAmount}</td>
//                     <td className="px-6 py-3">
//                       <span className={`px-2 py-1 rounded text-xs font-semibold ${
//                         order.paymentStatus === 'completed' ? 'bg-yellow-100 text-black'
//                         : order.paymentStatus === 'pending' ? 'bg-white/10 text-white'
//                         : 'bg-red-100 text-red-900'}`}>
//                         {order.paymentStatus}
//                       </span>
//                     </td>
//                     <td className="px-6 py-3">
//                       <select value={order.orderStatus}
//                         onChange={async (e) => {
//                           try { await orderService.updateStatus(order._id, e.target.value); fetchDashboardData(); }
//                           catch (err) { console.error('Failed to update status', err); }
//                         }}
//                         className="rounded bg-black/50 text-white px-2 py-1">
//                         {['pending','preparing','ready','delivered','cancelled'].map(s => (
//                           <option key={s} value={s}>{s}</option>
//                         ))}
//                       </select>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Add Product */}
//         <div className="rounded-3xl border border-white/10 bg-surface2 p-6 shadow-xl card-border">
//           <div className="mb-6">
//             <h2 className="text-xl font-bold mb-1">Add New Product</h2>
//             <p className="text-gray-400 text-sm">Upload a photo and fill in the details to add a menu item.</p>
//           </div>

//           <div className="grid gap-4 md:grid-cols-2">
//             {/* Image upload */}
//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium text-gray-300 mb-2">Product Image</label>
//               <div
//                 onClick={() => fileInputRef.current?.click()}
//                 className="cursor-pointer border-2 border-dashed border-white/20 rounded-2xl h-48 flex items-center justify-center overflow-hidden hover:border-brand/50 transition-colors"
//               >
//                 {imagePreview
//                   ? <img src={imagePreview} alt="preview" className="h-full w-full object-cover rounded-2xl" />
//                   : <div className="text-center">
//                       <p className="text-3xl mb-2">📷</p>
//                       <p className="text-gray-400 text-sm">Click to select an image</p>
//                       <p className="text-gray-600 text-xs mt-1">JPG, PNG, WEBP, AVIF up to 5MB</p>
//                     </div>
//                 }
//               </div>
//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className="hidden"
//               />
//               {imageFile && (
//                 <p className="text-xs text-gray-400 mt-1">Selected: {imageFile.name} ({(imageFile.size / 1024).toFixed(1)} KB)</p>
//               )}
//             </div>

//             <input value={productName} onChange={(e) => setProductName(e.target.value)}
//               className="rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-white"
//               placeholder="Product name" />

//             <textarea value={productDescription} onChange={(e) => setProductDescription(e.target.value)}
//               className="rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-white resize-none"
//               placeholder="Product description" rows={1} />

//             <input type="number" value={pricePlate || ''} onChange={(e) => setPricePlate(Number(e.target.value))}
//               className="rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-white"
//               placeholder="Plate price (₹)" />

//             <input type="number" value={priceHalfKg || ''} onChange={(e) => setPriceHalfKg(Number(e.target.value))}
//               className="rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-white"
//               placeholder="1.5 KG price (₹)" />

//             <input type="number" value={priceKg || ''} onChange={(e) => setPriceKg(Number(e.target.value))}
//               className="rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-white"
//               placeholder="1 KG price (₹)" />
//           </div>

//           {productMessage && (
//             <p className={`mt-4 text-sm ${productMessage.startsWith('❌') ? 'text-red-400' : 'text-brand'}`}>
//               {productMessage}
//             </p>
//           )}

//           <button onClick={handleCreateProduct} disabled={productLoading} className="btn-primary mt-6 disabled:opacity-50">
//             {productLoading ? productMessage || 'Adding product...' : 'Add Product'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { adminService, orderService } from '../services/api';
import { Link } from 'react-router-dom';
import type { DashboardData } from '../types';

const ADMIN_AUTH_KEY      = 'kb_admin_auth';
const ADMIN_TIMESTAMP_KEY = 'kb_admin_auth_timestamp';
const TWELVE_HOURS        = 12 * 60 * 60 * 1000;

export const AdminDashboard: FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const auth      = localStorage.getItem(ADMIN_AUTH_KEY);
    const timestamp = localStorage.getItem(ADMIN_TIMESTAMP_KEY);

    if (auth === 'true' && timestamp) {
      if (Date.now() - Number(timestamp) < TWELVE_HOURS) {
        return true; // still valid
      }
      // Expired — clean up
      localStorage.removeItem(ADMIN_AUTH_KEY);
      localStorage.removeItem(ADMIN_TIMESTAMP_KEY);
    }
    return false;
  });

  const [email, setEmail]                 = useState('');
  const [password, setPassword]           = useState('');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading]             = useState(false);
  const [errorMessage, setErrorMessage]   = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) { alert('Please enter email and password'); return; }
    setLoading(true);
    setErrorMessage('');
    try {
      await adminService.login(email, password);
      localStorage.setItem(ADMIN_AUTH_KEY, 'true');
      localStorage.setItem(ADMIN_TIMESTAMP_KEY, Date.now().toString());
      setIsLoggedIn(true);
      fetchDashboardData();
    } catch (error) {
      setErrorMessage((error as Error).message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_AUTH_KEY);
    localStorage.removeItem(ADMIN_TIMESTAMP_KEY);
    setIsLoggedIn(false);
    setEmail('');
    setPassword('');
    setDashboardData(null);
  };

  const fetchDashboardData = async () => {
    try {
      const data = await adminService.getDashboard();
      setDashboardData(data);
    } catch (error) {
      setErrorMessage('Unable to load dashboard data.');
    }
  };

  // Fetch on mount if already logged in (e.g. after refresh)
  useEffect(() => {
    if (isLoggedIn) {
      fetchDashboardData();
    }
  }, []);

  // Poll every 10 seconds while logged in
  useEffect(() => {
    if (isLoggedIn) {
      const interval = setInterval(fetchDashboardData, 10000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  // ── Login screen ──
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
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
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
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  className="w-full rounded-2xl border border-white/10 bg-black/60 px-3 py-3 text-white"
                  placeholder="••••••••"
                />
              </div>
              <button onClick={handleLogin} disabled={loading} className="w-full btn-primary">
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
            {errorMessage && <p className="text-sm text-red-400 mt-4 text-center">{errorMessage}</p>}
            {/* <p className="text-sm text-gray-500 mt-4 text-center">Default: admin@biryani.com / admin123</p> */}
          </div>
        </div>
      </div>
    );
  }

  // ── Loading screen ──
  if (!dashboardData) {
    return (
      <div className="bg-black min-h-screen text-white flex items-center justify-center">
        <p className="text-gray-300">Loading dashboard...</p>
      </div>
    );
  }

  // ── Dashboard ──
  return (
    <div className="bg-black min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-3 items-center">
            <Link to="/admin/products" className="btn-secondary">Manage Products</Link>
            <button onClick={handleLogout} className="btn-secondary">Logout</button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Orders',     value: dashboardData.totalOrders },
            { label: 'Pending Orders',   value: dashboardData.pendingOrders },
            { label: 'Completed Orders', value: dashboardData.completedOrders },
            { label: 'Total Products',   value: dashboardData.totalProducts },
            { label: 'Total Revenue',    value: `₹${dashboardData.totalRevenue}` },
          ].map((stat) => (
            <div key={stat.label} className="rounded-3xl border border-white/10 bg-surface2 p-6 shadow-xl card-border">
              <p className="text-gray-400 text-sm">{stat.label}</p>
              <p className="text-3xl font-bold text-brand">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="rounded-3xl border border-white/10 bg-surface2 shadow-xl overflow-hidden card-border mb-8">
          <div className="px-6 py-4 border-b border-white/10">
            <h2 className="text-xl font-bold">Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black/50 border-b border-white/10">
                <tr>
                  {['Order #', 'Customer', 'Amount', 'Payment', 'Status'].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-sm text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dashboardData.recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500 text-sm">
                      No orders yet.
                    </td>
                  </tr>
                ) : (
                  dashboardData.recentOrders.map((order) => (
                    <tr key={order._id} className="border-b border-white/10 hover:bg-white/5">
                      <td className="px-6 py-3 text-gray-200">{order.orderNumber}</td>
                      <td className="px-6 py-3 text-gray-200">{order.customerName}</td>
                      <td className="px-6 py-3 text-gray-200">₹{order.totalAmount}</td>
                      <td className="px-6 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          order.paymentStatus === 'completed' ? 'bg-yellow-100 text-black'
                          : order.paymentStatus === 'pending' ? 'bg-white/10 text-white'
                          : 'bg-red-100 text-red-900'
                        }`}>
                          {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <select
                          value={order.orderStatus}
                          onChange={async (e) => {
                            try {
                              await orderService.updateStatus(order._id, e.target.value);
                              fetchDashboardData();
                            } catch (err) {
                              console.error('Failed to update status', err);
                            }
                          }}
                          className="rounded bg-black/50 text-white px-2 py-1"
                        >
                          {['pending','preparing','ready','delivered','cancelled'].map(s => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Manage Products CTA */}
        <div className="rounded-3xl border border-white/10 bg-surface2 p-8 shadow-xl card-border text-center">
          <p className="text-3xl mb-3">🍛</p>
          <h2 className="text-xl font-bold mb-2">Manage Menu Items</h2>
          <p className="text-gray-400 text-sm mb-6">
            Add new biryani items, update prices, change photos, or remove items from your menu.
          </p>
          <Link to="/admin/products" className="btn-primary">
            Go to Products →
          </Link>
        </div>

      </div>
    </div>
  );
};