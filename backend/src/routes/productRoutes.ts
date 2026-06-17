import { Router, Request, Response } from 'express';
import Product from '../models/Product';

const router = Router();

const defaultProducts = [
  {
    name: 'Hyderabadi Chicken Biryani',
    description: 'Rich chicken biryani cooked with saffron rice and signature spices.',
    image: 'https://images.unsplash.com/photo-1559628236-0f5e4caa1623?auto=format&fit=crop&w=800&q=80',
    prices: { plate: 220, halfKg: 450, kg: 850 },
    available: true,
  },
  {
    name: 'Mutton Biryani',
    description: 'Slow-cooked mutton layered with fragrant biryani rice.',
    image: 'https://images.unsplash.com/photo-1512058564366-c9c8ea0f085a?auto=format&fit=crop&w=800&q=80',
    prices: { plate: 260, halfKg: 520, kg: 980 },
    available: true,
  },
  {
    name: 'Veg Biryani',
    description: 'Aromatic vegetables and basmati rice with spicy biryani masala.',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
    prices: { plate: 180, halfKg: 360, kg: 680 },
    available: true,
  },
];

// Get all products
router.get('/', async (req: Request, res: Response) => {
  try {
    const products = await Product.find({ available: true });
    if (!products || products.length === 0) {
      return res.json(defaultProducts);
    }
    res.json(products);
  } catch (error) {
    return res.json(defaultProducts);
  }
});

// Get product by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Create product (Admin)
router.post('/', async (req: Request, res: Response) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product (Admin)
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product (Admin)
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;
