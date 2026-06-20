import type { FC } from 'react';

// ── Replace these with your actual shop details ──
const OUTLETS = [
  {
    name: 'Outlet 1',
    address: 'Behind MSEB Office, Bengali Camp, Chandrapur, Maharashtra, 442401',
  },
  {
    name: 'Outlet 2',
    address: 'Ambedkar Chowk, Near Nyra Petrol Pump, Babupeth, Chandrapur, Maharashtra, 442403',
  },
];

const OWNER_PHONE = '+91 88308 45733'; // replace with actual owner number

export const Footer: FC = () => {
  const phoneDigits = OWNER_PHONE.replace(/\D/g, '');

  return (
    <footer className="bg-surface2 border-t border-white/10 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">

          {/* Brand */}
          <div>
            <h3 className="font-display text-base font-bold text-brand mb-1">
              Kilo <span className="text-white">Biryani</span>
            </h3>
            <p className="text-gray-500 text-xs leading-relaxed">
              Authentic dum-cooked biryani, delivered hot.
            </p>
          </div>

          {/* Outlets */}
          <div>
            <h4 className="text-white font-semibold text-[11px] uppercase tracking-wide mb-2">
              Our Outlets
            </h4>
            <div className="space-y-2.5">
              {OUTLETS.map((outlet) => (
                <div key={outlet.name} className="flex items-start gap-1.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3.5 h-3.5 text-brand shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  <div className="min-w-0">
                    <p className="text-white text-xs font-medium">{outlet.name}</p>
                    <p className="text-gray-500 text-[11px] mt-0.5 leading-snug">{outlet.address}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-[11px] uppercase tracking-wide mb-2">
              Contact
            </h4>
            <a
              href={`tel:${phoneDigits}`}
              className="flex items-center gap-1.5 text-gray-300 hover:text-brand transition-colors text-xs w-fit"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3.5 h-3.5 text-brand shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a1.5 1.5 0 001.5-1.5v-3.379a1.5 1.5 0 00-1.06-1.06l-4.039-4.04a1.5 1.5 0 00-1.062-1.06H12.75a48.667 48.667 0 00-1.5-12.75H8.25" />
              </svg>
              {OWNER_PHONE}
            </a>
            <p className="text-gray-500 text-[11px] mt-1.5">
              Call for bulk orders or queries.
            </p>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-5 pt-3 text-center">
          <p className="text-gray-600 text-[11px]">
            &copy; {new Date().getFullYear()} Kilo Biryani. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};