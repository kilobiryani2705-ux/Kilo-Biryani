# 🍛 Biryani Store - Quick Start Guide

## ✅ Project Setup Complete!

Your full-stack Biryani Store website has been successfully scaffolded with:
- ✅ **Frontend**: React + Vite + TypeScript + Tailwind CSS
- ✅ **Backend**: Node.js + Express + TypeScript + MongoDB
- ✅ **Routing**: Client-side routing with React Router
- ✅ **State Management**: React Context API for cart management
- ✅ **Build**: Both frontend and backend compile successfully

## 🚀 Getting Started

### Step 1: Set Up Environment Variables

**Backend (.env)**
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/biryani-store
NODE_ENV=development
ADMIN_EMAIL=admin@biryani.com
ADMIN_PASSWORD=admin123
```

**Frontend (.env)**
```bash
cd ../frontend
cp .env.example .env
```

Frontend `.env` already has the correct API URL:
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 2: Start MongoDB

Make sure MongoDB is running. If you have it installed locally:
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongodb
```

Or use **MongoDB Atlas** (cloud):
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Update `MONGODB_URI` in backend `.env` with your connection string

### Step 3: Start the Backend Server

```bash
cd backend
npm run dev
```

Backend will start at: `http://localhost:5000`

Health check: `http://localhost:5000/api/health`

### Step 4: Start the Frontend Dev Server

In a new terminal:
```bash
cd frontend
npm run dev
```

Frontend will start at: `http://localhost:5173`

### Step 5: Access the Website

- 🏠 **Home**: http://localhost:5173/
- 🍽️ **Menu**: http://localhost:5173/menu
- 🛒 **Cart**: http://localhost:5173/cart
- 💳 **Checkout**: http://localhost:5173/checkout
- 👨‍💼 **Admin**: http://localhost:5173/admin

## 🔐 Admin Login

Default admin credentials:
- **Email**: admin@biryani.com
- **Password**: admin123

⚠️ **Important**: Change these in production!

## 📁 Project Structure

```
biryani-website/
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API service calls
│   │   ├── context/          # React Context (Cart)
│   │   ├── types/            # TypeScript types
│   │   └── App.tsx           # Main app with routing
│   ├── dist/                 # Built files (after npm run build)
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── .env.example
│
├── backend/
│   ├── src/
│   │   ├── models/           # MongoDB schemas
│   │   ├── routes/           # API routes
│   │   ├── middlewares/      # Express middleware
│   │   ├── controllers/      # Route handlers
│   │   ├── utils/            # Helper functions
│   │   └── server.ts         # Express app
│   ├── dist/                 # Compiled JavaScript
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── .github/
│   └── copilot-instructions.md
├── .gitignore
├── README.md
└── QUICK_START.md            # This file
```

## 💻 Development Workflow

### Frontend Development
```bash
cd frontend
npm run dev      # Start dev server with hot reload
npm run build    # Build for production
npm run preview  # Preview production build
```

### Backend Development
```bash
cd backend
npm run dev      # Start with nodemon (auto-reload)
npm run build    # Compile TypeScript
npm start        # Run compiled code
```

## 📊 Database Models

### Product
- `name`: string
- `description`: string
- `image`: string (URL)
- `prices.plate`: number
- `prices.kg`: number
- `prices.halfKg`: number
- `available`: boolean

### Order
- `orderNumber`: string (unique)
- `customerName`: string
- `customerPhone`: string
- `deliveryAddress`: string
- `items`: array of cart items
- `totalAmount`: number
- `paymentTransactionId`: string
- `paymentStatus`: 'pending' | 'completed' | 'failed'
- `orderStatus`: 'pending' | 'preparing' | 'ready' | 'delivered'
- `specialInstructions`: string (optional)

### Admin
- `email`: string (unique)
- `password`: string (hashed)
- `name`: string

## 🧪 Testing the API

You can test API endpoints using Postman, curl, or VS Code REST Client:

### Create a Product
```http
POST http://localhost:5000/api/products
Content-Type: application/json

{
  "name": "Chicken Biryani",
  "description": "Delicious chicken biryani with basmati rice",
  "image": "https://via.placeholder.com/300",
  "prices": {
    "plate": 200,
    "kg": 450,
    "halfKg": 250
  },
  "available": true
}
```

### Get All Products
```http
GET http://localhost:5000/api/products
```

### Create an Order
```http
POST http://localhost:5000/api/orders
Content-Type: application/json

{
  "customerName": "John Doe",
  "customerPhone": "9876543210",
  "deliveryAddress": "123 Main St, City",
  "items": [
    {
      "productId": "PRODUCT_ID",
      "name": "Chicken Biryani",
      "quantity": 2,
      "price": 200,
      "type": "plate",
      "image": "..."
    }
  ],
  "totalAmount": 400,
  "paymentTransactionId": "UPI123456789"
}
```

## 🔧 Configuration

### API URLs
- Development: `http://localhost:5000/api`
- Production: Update `VITE_API_URL` in frontend `.env`

### Port Configuration
- Frontend: 5173 (Vite default)
- Backend: 5000 (configured in `backend/.env`)

### Database
- Local MongoDB: `mongodb://localhost:27017/biryani-store`
- MongoDB Atlas: Use connection string from cluster

## 📦 Building for Production

### Frontend Build
```bash
cd frontend
npm run build
# Output: dist/ folder ready for deployment
```

Deploy to: Vercel, Netlify, Firebase, or any static host

### Backend Build
```bash
cd backend
npm run build
# Output: dist/ folder with compiled code
```

Deploy to: Heroku, Railway, DigitalOcean, AWS, or any Node.js host

## 🐛 Troubleshooting

### Frontend won't connect to backend
- Ensure backend is running on `http://localhost:5000`
- Check `VITE_API_URL` in frontend `.env`
- Check browser console for CORS errors

### MongoDB connection failed
- Ensure MongoDB is running
- Check connection string in `backend/.env`
- For Atlas: Whitelist your IP and create database user

### TypeScript errors on build
- Run `npm install` to ensure all types are installed
- TypeScript versions in frontend/backend should match

### Port already in use
- Frontend: Change port in `vite.config.ts`
- Backend: Change PORT in `.env`

## 🚀 Next Steps

1. **Add real biryani images** - Replace placeholder images
2. **Set up email notifications** - Use Nodemailer with Gmail
3. **Payment gateway** - Integrate real UPI payment API
4. **Authentication** - Implement JWT for admin routes
5. **Database setup** - Add seed data with sample products
6. **Environment-specific configs** - Separate dev/prod settings
7. **Error handling** - Add global error handling middleware
8. **Testing** - Add Jest tests for components and APIs
9. **Deployment** - Set up CI/CD with GitHub Actions
10. **Analytics** - Add order tracking and analytics

## 📞 Support & Resources

- **Frontend**: [React Docs](https://react.dev), [Vite Docs](https://vite.dev), [Tailwind CSS](https://tailwindcss.com)
- **Backend**: [Express Docs](https://expressjs.com), [MongoDB Docs](https://docs.mongodb.com)
- **TypeScript**: [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Happy coding! 🚀** 

Build a great biryani ordering experience for your customers! 🍛
