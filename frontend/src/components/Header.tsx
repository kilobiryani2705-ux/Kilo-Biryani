// import type { FC } from 'react';
// import { Link } from 'react-router-dom';
// import { useCart } from '../context/CartContext';

// export const Header: FC = () => {
//   const { getTotalItems } = useCart();

//   return (
//     <header className="bg-black border-b border-brand/40">
//       <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
//         <Link to="/" className="text-2xl font-bold tracking-tight">
//           <span className="text-brand">Kilo</span>{' '}
//           <span className="text-white">Biryani</span>
//         </Link>
//         <div className="flex gap-6 items-center text-white">
//           <Link to="/" className="hover:text-brand transition">
//             Home
//           </Link>
//           <Link to="/menu" className="hover:text-brand transition">
//             Menu
//           </Link>
//           <Link to="/cart" className="hover:text-brand transition relative">
//             Cart
//             {getTotalItems() > 0 && (
//               <span className="absolute -top-2 -right-2 bg-brand text-black rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
//                 {getTotalItems()}
//               </span>
//             )}
//           </Link>
//           <Link to="/admin" className="hover:text-brand transition">
//             Admin
//           </Link>
//         </div>
//       </nav>
//     </header>
//   );
// };


import type { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const displayFont = { fontFamily: 'var(--font-display)' } as const;

export const Header: FC = () => {
  const { getTotalItems } = useCart();
  const { pathname } = useLocation();
  const count = getTotalItems();

  return (
    <header className="sticky top-0 z-50 bg-[#0C0A08]/90 backdrop-blur-sm border-b border-white/[0.06]">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-baseline gap-1 shrink-0">
          <span style={displayFont} className="text-xl font-bold text-brand leading-none tracking-tight">
            Kilo
          </span>
          <span style={displayFont} className="text-xl font-bold text-white leading-none tracking-tight">
            Biryani
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-7">
          {[
            { to: '/',      label: 'Home'  },
            { to: '/menu',  label: 'Menu'  },
            { to: '/admin', label: 'Admin' },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`nav-link ${pathname === to ? 'active' : ''}`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Cart */}
        <Link
          to="/cart"
          className="relative flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors duration-150"
          aria-label={`Cart${count > 0 ? `, ${count} items` : ''}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.75}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75M7.5 14.25H5.106l-1.355-5.08A1.125 1.125 0 014.84 7.5H20.25L18 14.25H7.5z"
            />
          </svg>
          <span className="hidden sm:inline">Cart</span>
          {count > 0 && (
            <span className="absolute -top-2 -right-2 bg-brand text-black text-[10px] font-bold rounded-full w-[18px] h-[18px] flex items-center justify-center leading-none">
              {count > 9 ? '9+' : count}
            </span>
          )}
        </Link>

        {/* Mobile nav */}
        <div className="flex sm:hidden items-center gap-5">
          {[
            { to: '/',      label: 'Home'  },
            { to: '/menu',  label: 'Menu'  },
            { to: '/admin', label: 'Admin' },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`nav-link text-xs ${pathname === to ? 'active' : ''}`}
            >
              {label}
            </Link>
          ))}
        </div>

      </nav>
    </header>
  );
};