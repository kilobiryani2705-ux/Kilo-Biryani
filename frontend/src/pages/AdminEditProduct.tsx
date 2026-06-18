import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../services/api';
import type { Product } from '../types';

export const AdminEditProduct: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [plate, setPlate] = useState(0);
  const [halfKg, setHalfKg] = useState(0);
  const [kg, setKg] = useState(0);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      try {
        const p = await productService.getById(id);
        setProduct(p);
        setName(p.name);
        setDescription(p.description);
        setImagePreview(p.image || '');
        setPlate(p.prices?.plate || 0);
        setHalfKg(p.prices?.halfKg || 0);
        setKg(p.prices?.kg || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleSave = async () => {
    try {
      let imageUrl = imagePreview;
      if (imageFile) {
        const res = await productService.uploadImage(imageFile);
        imageUrl = res.url;
      }
      await productService.update(id as string, {
        name,
        description,
        image: imageUrl,
        prices: { plate, halfKg, kg },
      });
      navigate('/admin/products');
    } catch (err) {
      console.error('Update failed', err);
    }
  };

  if (loading) return <div className="p-8 text-gray-300">Loading...</div>;
  if (!product) return <div className="p-8 text-red-400">Product not found</div>;

  return (
    <div className="bg-black min-h-screen text-white">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
        <div className="rounded-3xl border border-white/10 bg-surface2 p-6 shadow-xl card-border">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded px-3 py-2 bg-black/60" />
              <label className="block text-sm text-gray-300 mb-1 mt-4">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded px-3 py-2 bg-black/60" rows={4} />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Image</label>
              {imagePreview && <img src={imagePreview} alt="preview" className="w-full h-48 object-cover rounded mb-2" />}
              <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-3 mt-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Plate price</label>
              <input type="number" value={plate} onChange={(e) => setPlate(Number(e.target.value))} className="w-full rounded px-3 py-2 bg-black/60" />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">One and Half Kg price</label>
              <input type="number" value={halfKg} onChange={(e) => setHalfKg(Number(e.target.value))} className="w-full rounded px-3 py-2 bg-black/60" />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Kg price</label>
              <input type="number" value={kg} onChange={(e) => setKg(Number(e.target.value))} className="w-full rounded px-3 py-2 bg-black/60" />
            </div>
          </div>
          <div className="mt-4">
            <button onClick={handleSave} className="btn-primary">Save</button>
            <button onClick={() => navigate('/admin/products')} className="btn-secondary ml-3">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEditProduct;
