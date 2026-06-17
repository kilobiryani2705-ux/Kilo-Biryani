<!-- Biryani Store Website - Full Stack Setup Instructions -->

# Biryani Store Website Setup

## Project Overview
A full-stack e-commerce website for a small-scale Biryani store with:
- React + Vite frontend with responsive UI
- Node.js + Express backend API
- MongoDB database
- UPI payment integration
- Admin dashboard for order and menu management

## Development Workflow

### Frontend
- Located in `/frontend`
- Built with React + Vite + TypeScript
- Styled with Tailwind CSS
- Components: Home, Menu, Cart, Checkout, Admin Dashboard

### Backend
- Located in `/backend`
- Built with Node.js + Express
- MongoDB for data persistence
- RESTful API endpoints
- Email notifications for orders

### Database
- MongoDB for storing products, orders, and customers
- Models: Product, Order, Customer, Admin

## Getting Started

### 1. Install Frontend Dependencies
```bash
cd frontend
npm install
npm run dev
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
npm run dev
```

### 3. Environment Variables
Create `.env` files in both frontend and backend directories with required variables.

## API Endpoints

### Products
- `GET /api/products` - Get all biryani items
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get all orders (admin)
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status (admin)

### Admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/dashboard` - Get dashboard data

## Features

### Customer Flow
1. Home page with featured biryani
2. Menu page with 3 pricing options per plate, per KG, 1.5 KG
3. Add items to cart with quantity
4. Checkout with customer details
5. UPI payment with QR code
6. Order confirmation

### Admin Flow
1. Login to admin panel
2. View all incoming orders
3. Manage menu items and prices
4. Update order status
5. Verify payment transaction IDs

## File Structure
```
biryani-website/
├── .github/
│   └── copilot-instructions.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.tsx
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── controllers/
│   │   └── server.ts
│   └── package.json
└── README.md
```

## Next Steps
- Complete frontend scaffolding with Vite
- Complete backend scaffolding with Express
- Set up MongoDB connection
- Create API endpoints
- Build React components
- Set up admin dashboard
