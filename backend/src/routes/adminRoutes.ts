import { Router, Request, Response } from 'express';
import Admin from '../models/Admin';
import Order from '../models/Order';
import Product from '../models/Product';

const router = Router();

// Admin login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (admin) {
      if (admin.password !== password) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      res.json({ message: 'Login successful', admin: { id: admin._id, email: admin.email, name: admin.name } });
      return;
    }

    // Fallback to environment credentials if no admin account exists yet
    const envEmail = process.env.ADMIN_EMAIL;
    const envPassword = process.env.ADMIN_PASSWORD;
    if (email === envEmail && password === envPassword) {
      const name = process.env.ADMIN_NAME || 'Admin';

      const createdAdmin = await Admin.findOneAndUpdate(
        { email },
        { email, password, name },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      res.json({ message: 'Login successful', admin: { id: createdAdmin._id, email: createdAdmin.email, name: createdAdmin.name } });
      return;
    }

    res.status(401).json({ error: 'Invalid credentials' });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get dashboard data
router.get('/dashboard', async (req: Request, res: Response) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' });
    const completedOrders = await Order.countDocuments({ orderStatus: 'delivered' });
    const totalProducts = await Product.countDocuments();
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);

    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    res.json({
      totalOrders,
      pendingOrders,
      completedOrders,
      totalProducts,
      totalRevenue: totalRevenue[0]?.total || 0,
      recentOrders,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

export default router;
