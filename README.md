# 🍛 Biryani Store Website

A full-stack e-commerce website for a small-scale Biryani store with React + Vite frontend and Node.js + Express backend.

## 🚀 Features

### Customer Features
- 🏠 **Home Page** - Welcome page with store information
- 🍽️ **Menu** - Browse biryani with 3 price options (per plate, per KG, 1.5 KG)
- 🛒 **Shopping Cart** - Add/remove items and manage quantities
- 💳 **Checkout** - Enter delivery details and UPI payment
- 📦 **Order Confirmation** - Order confirmation page with reference

### Admin Features
- 🔐 **Admin Login** - Secure admin dashboard login
- 📊 **Dashboard** - View orders, revenue, and statistics
- ✅ **Order Management** - View and update order status
- 💰 **Payment Verification** - Verify payment transaction IDs
- 🍴 **Menu Management** - Add, edit, delete biryani items

## 📋 Project Structure

```
biryani-website/
├── .github/
│   └── copilot-instructions.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   └── Cart.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Menu.tsx
│   │   │   ├── Checkout.tsx
│   │   │   ├── OrderConfirmation.tsx
│   │   │   └── AdminDashboard.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── context/
│   │   │   └── CartContext.tsx
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .env.example
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── Product.ts
│   │   │   ├── Order.ts
│   │   │   └── Admin.ts
│   │   ├── routes/
│   │   │   ├── productRoutes.ts
│   │   │   ├── orderRoutes.ts
│   │   │   └── adminRoutes.ts
│   │   ├── middlewares/
│   │   ├── controllers/
│   │   ├── utils/
│   │   └── server.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
└── README.md
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Context API** - State management

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT auth
- **nodemailer** - Email notifications

## 📦 Installation

### Prerequisites
- Node.js v16 or higher
- npm or yarn
- MongoDB running locally or cloud connection

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file**
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your configuration:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/biryani-store
   NODE_ENV=development
   ```

4. **Start the backend server**
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file**
   ```bash
   cp .env.example .env
   ```
   The default API URL should be:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

## 🔌 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get all orders (Admin)
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/status` - Update order status (Admin)
- `POST /api/orders/:id/verify-payment` - Verify payment (Admin)

### Admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/dashboard` - Get dashboard data

## 📱 Customer Flow

1. **Home Page** - View store information
2. **Menu** - Browse available biryani options
3. **Select Items** - Choose size (plate/1.5KG/KG) and quantity
4. **Add to Cart** - Items added to shopping cart
5. **Checkout** - Enter delivery details (name, phone, address)
6. **Payment** - Scan UPI QR code and enter transaction ID
7. **Order Confirmation** - Order placed successfully

## 🔑 Admin Credentials

Default admin credentials (set these up in your MongoDB):
- **Email:** admin@biryani.com
- **Password:** admin123

⚠️ **Important:** Change these credentials in production!

## 🗄️ Database Models

### Product Schema
```typescript
{
  name: String,
  description: String,
  image: String,
  prices: {
    plate: Number,
    kg: Number,
    halfKg: Number
  },
  available: Boolean,
  timestamps: true
}
```

### Order Schema
```typescript
{
  orderNumber: String (unique),
  customerName: String,
  customerPhone: String,
  deliveryAddress: String,
  items: [{
    productId, name, quantity, price, type
  }],
  totalAmount: Number,
  paymentTransactionId: String,
  paymentStatus: 'pending' | 'completed' | 'failed',
  orderStatus: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled',
  timestamps: true
}
```

## 🚀 Deployment

### Backend (Node.js)
- Deploy to Heroku, Railway, or any Node.js hosting
- Set environment variables in production
- Use MongoDB Atlas for cloud database

### Frontend (React)
- Build: `npm run build`
- Deploy to Vercel, Netlify, or any static hosting
- Update VITE_API_URL to production backend URL

## 🔒 Security Considerations

- Hash admin passwords with bcryptjs
- Use environment variables for sensitive data
- Implement JWT authentication for admin routes
- Validate all user inputs
- Use HTTPS in production
- Add CORS restrictions
- Implement rate limiting

## 📧 Future Enhancements

- [ ] Email notifications for orders
- [ ] SMS notifications
- [ ] Multiple payment options
- [ ] Ratings and reviews
- [ ] Order tracking with map
- [ ] Loyalty/rewards program
- [ ] Mobile app with React Native
- [ ] Advanced analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 📞 Support

For support, email support@biryanistore.com or open an issue on GitHub.

---

Made with ❤️ for biryani lovers 🍛
