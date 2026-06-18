// // import { Router, Request, Response } from 'express';
// // import path from 'path';
// // import multer from 'multer';
// // import Product from '../models/Product';
// // import { v2 as cloudinary } from 'cloudinary';

// // // Configure cloudinary if credentials or URL provided
// // const cloudName = process.env.CLOUDINARY_CLOUD_NAME || '';
// // const cloudKey = process.env.CLOUDINARY_API_KEY || '';
// // const cloudSecret = process.env.CLOUDINARY_API_SECRET || '';
// // if (process.env.CLOUDINARY_URL) {
// //   cloudinary.config({ secure: true });
// // } else if (cloudName && cloudKey && cloudSecret) {
// //   cloudinary.config({ cloud_name: cloudName, api_key: cloudKey, api_secret: cloudSecret, secure: true });
// // }

// // const router = Router();

// // // Multer setup for image uploads (limit 1MB)
// // const uploadDir = path.join(__dirname, '..', '..', 'public', 'uploads');

// // // If Cloudinary is configured, use memory storage so we can stream to Cloudinary.
// // const useCloudinary = !!(process.env.CLOUDINARY_URL || (cloudName && cloudKey && cloudSecret));
// // console.log('productRoutes env:', { CLOUDINARY_URL: !!process.env.CLOUDINARY_URL, CLOUDINARY_CLOUD_NAME: !!process.env.CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY: !!process.env.CLOUDINARY_API_KEY });
// // console.log('productRoutes: useCloudinary=', useCloudinary);
// // const storage = useCloudinary
// //   ? multer.memoryStorage()
// //   : multer.diskStorage({
// //       destination: (_req: any, _file: any, cb: any) => cb(null, uploadDir),
// //       filename: (_req: any, file: any, cb: any) => {
// //         const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
// //         const ext = path.extname(file.originalname);
// //         cb(null, `${unique}${ext}`);
// //       },
// //     });

// // const upload = multer({
// //   storage,
// //   limits: { fileSize: 1024 * 1024 }, // 1 MB
// //   fileFilter: (_req: any, file: any, cb: any) => {
// //     const allowedExt = ['.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif', '.svg'];
// //     const extName = file.originalname ? path.extname(file.originalname).toLowerCase() : '';
// //     if ((file.mimetype && file.mimetype.startsWith('image/')) || allowedExt.includes(extName)) cb(null, true);
// //     else {
// //       console.warn('Rejected upload - not an image:', file.originalname, 'mimetype:', file.mimetype);
// //       cb(new Error('Only image uploads are allowed'));
// //     }
// //   },
// // });

// // // Upload route (supports local disk or Cloudinary)
// // router.post('/upload', (req: any, res: Response) => {
// //   // run multer and capture errors explicitly
// //   upload.single('image')(req, res, async (multerErr: any) => {
// //     if (multerErr) {
// //       console.error('Multer error during upload:', multerErr);
// //       return res.status(400).json({ error: multerErr.message || 'Upload error' });
// //     }

// //     try {
// //       if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

// //       if (useCloudinary) {
// //         const fileBuffer = req.file.buffer;
// //         const folderName = `kilo-biryani/${new Date().toISOString().slice(0, 10)}`; // dynamic folders by date
// //         const streamUpload = (buffer: Buffer) =>
// //           new Promise<any>((resolve, reject) => {
// //             const stream = cloudinary.uploader.upload_stream({ folder: folderName, resource_type: 'image' }, (error, result) => {
// //               if (error) return reject(error);
// //               resolve(result);
// //             });
// //             stream.end(buffer);
// //           });

// //         const result = await streamUpload(fileBuffer);
// //         return res.json({ url: result.secure_url });
// //       }

// //       // Local disk path
// //       const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
// //       return res.json({ url });
// //     } catch (err: any) {
// //       console.error('Upload error:', err);
// //       return res.status(500).json({ error: err.message || 'Upload failed' });
// //     }
// //   });
// // });

// // // Get all products
// // router.get('/', async (req: Request, res: Response) => {
// //   try {
// //     const products = await Product.find({ available: true });
// //     res.json(products);
// //   } catch (error) {
// //     console.error('Failed to fetch products', error);
// //     res.status(500).json({ error: 'Failed to fetch products' });
// //   }
// // });

// // // Get product by ID
// // router.get('/:id', async (req: Request, res: Response) => {
// //   try {
// //     const product = await Product.findById(req.params.id);
// //     if (!product) {
// //       res.status(404).json({ error: 'Product not found' });
// //       return;
// //     }
// //     res.json(product);
// //   } catch (error) {
// //     res.status(500).json({ error: 'Failed to fetch product' });
// //   }
// // });

// // // Create product (Admin)
// // router.post('/', async (req: Request, res: Response) => {
// //   try {
// //     const body = req.body || {};
// //     const prices = body.prices || {};
// //     const sanitized = {
// //       name: (body.name || '').toString(),
// //       description: (typeof body.description === 'string' && body.description.trim()) ? body.description.trim() : 'No description',
// //       image: body.image || '',
// //       prices: {
// //         plate: Number(prices.plate) || 0,
// //         halfKg: Number(prices.halfKg) || 0,
// //         kg: Number(prices.kg) || 0,
// //       },
// //       available: typeof body.available === 'boolean' ? body.available : true,
// //     };

// //     const product = new Product(sanitized);
// //     await product.save();
// //     res.status(201).json(product);
// //   } catch (error) {
// //     console.error('Create product error:', error);
// //     res.status(500).json({ error: 'Failed to create product' });
// //   }
// // });

// // // Update product (Admin)
// // router.put('/:id', async (req: Request, res: Response) => {
// //   try {
// //     const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
// //     res.json(product);
// //   } catch (error) {
// //     res.status(500).json({ error: 'Failed to update product' });
// //   }
// // });

// // // Delete product (Admin)
// // router.delete('/:id', async (req: Request, res: Response) => {
// //   try {
// //     await Product.findByIdAndDelete(req.params.id);
// //     res.json({ message: 'Product deleted' });
// //   } catch (error) {
// //     res.status(500).json({ error: 'Failed to delete product' });
// //   }
// // });

// // export default router;


// import { Router, Request, Response } from 'express';
// import path from 'path';
// import multer from 'multer';
// import Product from '../models/Product';
// import { v2 as cloudinary } from 'cloudinary';

// const cloudName = process.env.CLOUDINARY_CLOUD_NAME || '';
// const cloudKey = process.env.CLOUDINARY_API_KEY || '';
// const cloudSecret = process.env.CLOUDINARY_API_SECRET || '';

// if (process.env.CLOUDINARY_URL) {
//   cloudinary.config({ secure: true });
// } else if (cloudName && cloudKey && cloudSecret) {
//   cloudinary.config({ cloud_name: cloudName, api_key: cloudKey, api_secret: cloudSecret, secure: true });
// }

// const router = Router();

// const uploadDir = path.join(__dirname, '..', '..', 'public', 'uploads');

// const useCloudinary = !!(process.env.CLOUDINARY_URL || (cloudName && cloudKey && cloudSecret));
// console.log('productRoutes env:', {
//   CLOUDINARY_URL: !!process.env.CLOUDINARY_URL,
//   CLOUDINARY_CLOUD_NAME: !!process.env.CLOUDINARY_CLOUD_NAME,
//   CLOUDINARY_API_KEY: !!process.env.CLOUDINARY_API_KEY,
// });
// console.log('productRoutes: useCloudinary=', useCloudinary);

// const storage = useCloudinary
//   ? multer.memoryStorage()
//   : multer.diskStorage({
//       destination: (_req: any, _file: any, cb: any) => cb(null, uploadDir),
//       filename: (_req: any, file: any, cb: any) => {
//         const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
//         const ext = path.extname(file.originalname);
//         cb(null, `${unique}${ext}`);
//       },
//     });

// const upload = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
//   fileFilter: (_req: any, file: any, cb: any) => {
//     const allowedExt = ['.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif', '.svg'];
//     const extName = file.originalname ? path.extname(file.originalname).toLowerCase() : '';
//     if ((file.mimetype && file.mimetype.startsWith('image/')) || allowedExt.includes(extName)) cb(null, true);
//     else {
//       console.warn('Rejected upload - not an image:', file.originalname, 'mimetype:', file.mimetype);
//       cb(new Error('Only image uploads are allowed'));
//     }
//   },
// });

// // Upload route
// router.post('/upload', (req: any, res: Response) => {
//   upload.single('image')(req, res, async (multerErr: any) => {
//     if (multerErr) {
//       console.error('Multer error during upload:', multerErr);
//       return res.status(400).json({ error: multerErr.message || 'Upload error' });
//     }

//     try {
//       if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

//       console.log('📁 File received:', req.file.originalname, '| size:', req.file.size, '| has buffer:', !!req.file.buffer);
//       console.log('☁️  useCloudinary at upload time:', useCloudinary);

//       if (useCloudinary) {
//         console.log('📤 Uploading to Cloudinary...');
//         const fileBuffer = req.file.buffer;

//         if (!fileBuffer) {
//           console.error('❌ No buffer found — multer may not be using memoryStorage');
//           return res.status(500).json({ error: 'File buffer missing' });
//         }

//         const folderName = `kilo-biryani/${new Date().toISOString().slice(0, 10)}`;
//         const streamUpload = (buffer: Buffer) =>
//           new Promise<any>((resolve, reject) => {
//             const stream = cloudinary.uploader.upload_stream(
//               { folder: folderName, resource_type: 'image' },
//               (error, result) => {
//                 if (error) {
//                   console.error('❌ Cloudinary stream error:', error);
//                   return reject(error);
//                 }
//                 resolve(result);
//               }
//             );
//             stream.end(buffer);
//           });

//         const result = await streamUpload(fileBuffer);
//         console.log('✅ Cloudinary upload success:', result.secure_url);
//         return res.json({ url: result.secure_url });
//       }

//       // Fallback: local disk
//       console.log('⚠️  Fell through to local storage — Cloudinary not used');
//       const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
//       return res.json({ url });

//     } catch (err: any) {
//       console.error('❌ Upload error:', err);
//       return res.status(500).json({ error: err.message || 'Upload failed' });
//     }
//   });
// });

// // Get all products
// router.get('/', async (req: Request, res: Response) => {
//   try {
//     const products = await Product.find({ available: true });
//     res.json(products);
//   } catch (error) {
//     console.error('Failed to fetch products', error);
//     res.status(500).json({ error: 'Failed to fetch products' });
//   }
// });

// // Get product by ID
// router.get('/:id', async (req: Request, res: Response) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) {
//       res.status(404).json({ error: 'Product not found' });
//       return;
//     }
//     res.json(product);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch product' });
//   }
// });

// // Create product
// router.post('/', async (req: Request, res: Response) => {
//   try {
//     const body = req.body || {};
//     const prices = body.prices || {};
//     const sanitized = {
//       name: (body.name || '').toString(),
//       description: (typeof body.description === 'string' && body.description.trim()) ? body.description.trim() : 'No description',
//       image: body.image || '',
//       prices: {
//         plate: Number(prices.plate) || 0,
//         halfKg: Number(prices.halfKg) || 0,
//         kg: Number(prices.kg) || 0,
//       },
//       available: typeof body.available === 'boolean' ? body.available : true,
//     };

//     const product = new Product(sanitized);
//     await product.save();
//     res.status(201).json(product);
//   } catch (error) {
//     console.error('Create product error:', error);
//     res.status(500).json({ error: 'Failed to create product' });
//   }
// });

// // Update product
// router.put('/:id', async (req: Request, res: Response) => {
//   try {
//     const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.json(product);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to update product' });
//   }
// });

// // Delete product
// router.delete('/:id', async (req: Request, res: Response) => {
//   try {
//     await Product.findByIdAndDelete(req.params.id);
//     res.json({ message: 'Product deleted' });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to delete product' });
//   }
// });

// export default router;

import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import Product from '../models/Product';
import { v2 as cloudinary } from 'cloudinary';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req: any, file: any, cb: any) => {
    if (file.mimetype && file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
});

router.post('/upload', upload.single('image'), async (req: any, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const cloudName   = process.env.CLOUDINARY_CLOUD_NAME;
    const cloudKey    = process.env.CLOUDINARY_API_KEY;
    const cloudSecret = process.env.CLOUDINARY_API_SECRET;

    console.log('📁 File received:', req.file.originalname, '| size:', req.file.size);
    console.log('☁️  Cloudinary env:', { cloudName: !!cloudName, cloudKey: !!cloudKey, cloudSecret: !!cloudSecret });

    if (cloudName && cloudKey && cloudSecret) {
      cloudinary.config({ cloud_name: cloudName, api_key: cloudKey, api_secret: cloudSecret, secure: true });
      console.log('📤 Uploading to Cloudinary...');

      const result = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'kilo-biryani/menu', resource_type: 'image' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(req.file!.buffer);
      });

      console.log('✅ Cloudinary URL:', result.secure_url);
      return res.json({ url: result.secure_url });
    }

    console.log('⚠️  Cloudinary env missing — saving locally');
    const uploadDir = path.join(__dirname, '..', '..', 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    const filename = `${Date.now()}${path.extname(req.file.originalname)}`;
    fs.writeFileSync(path.join(uploadDir, filename), req.file.buffer);
    return res.json({ url: `${req.protocol}://${req.get('host')}/uploads/${filename}` });

  } catch (err: any) {
    console.error('❌ Upload error:', err);
    return res.status(500).json({ error: err.message || 'Upload failed' });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const products = await Product.find({ available: true });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const body = req.body || {};
    const prices = body.prices || {};
    const product = new Product({
      name:        (body.name || '').toString(),
      description: (body.description || '').toString().trim() || 'No description',
      image:       body.image || '',
      prices: {
        plate:  Number(prices.plate)  || 0,
        halfKg: Number(prices.halfKg) || 0,
        kg:     Number(prices.kg)     || 0,
      },
      available: typeof body.available === 'boolean' ? body.available : true,
    });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;