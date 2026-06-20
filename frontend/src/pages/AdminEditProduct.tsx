import type { FC } from 'react';
import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../services/api';
import type { Product } from '../types';

export const AdminEditProduct: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [plate, setPlate] = useState(0);
  const [halfKg, setHalfKg] = useState(0);
  const [kg, setKg] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setSaving(true);
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
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-black min-h-screen text-white flex items-center justify-center">
        <p className="text-gray-300">Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-black min-h-screen text-white flex items-center justify-center">
        <p className="text-red-400">Product not found</p>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-10">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Edit Product</h1>

        <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-surface2 p-4 sm:p-6 shadow-xl card-border">

          {/* Image upload — full width, contained, never overflows */}
          <div className="mb-5">
            <label className="block text-sm text-gray-300 mb-2">Product Image</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer w-full max-w-full border-2 border-dashed border-white/20 rounded-2xl h-44 sm:h-52 overflow-hidden hover:border-brand/50 transition-colors"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="preview"
                  className="w-full h-full object-cover block"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                  <span className="text-3xl">📷</span>
                  <span className="text-gray-400 text-sm">Click to select an image</span>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            {imageFile && (
              <p className="text-xs text-gray-400 mt-1.5 truncate">
                Selected: {imageFile.name} ({(imageFile.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </div>

          {/* Name + Description */}
          <div className="space-y-4 mb-5">
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-white text-base"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-white text-base resize-none"
                rows={4}
              />
            </div>
          </div>

          {/* Prices — stack on mobile, 3 cols on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">Plate price (₹)</label>
              <input
                type="number"
                value={plate}
                onChange={(e) => setPlate(Number(e.target.value))}
                className="w-full rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-white text-base"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">1.5 KG price (₹)</label>
              <input
                type="number"
                value={halfKg}
                onChange={(e) => setHalfKg(Number(e.target.value))}
                className="w-full rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-white text-base"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">1 KG price (₹)</label>
              <input
                type="number"
                value={kg}
                onChange={(e) => setKg(Number(e.target.value))}
                className="w-full rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-white text-base"
              />
            </div>
          </div>

          {/* Actions — stack on mobile, inline on desktop */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary flex-1 sm:flex-none disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => navigate('/admin/products')}
              className="btn-secondary flex-1 sm:flex-none"
            >
              Cancel
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminEditProduct;