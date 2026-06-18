import { useState } from 'react';
import type { Product, CartItem } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();
  const [selectedType, setSelectedType] = useState<'plate' | 'kg' | 'halfKg'>('plate');
  const [quantity, setQuantity] = useState(1);
  const [imgError, setImgError] = useState(false);

  const handleAddToCart = () => {
    const price = product.prices[selectedType];
    const cartItem: CartItem = {
      productId: product._id,
      name:      product.name,
      quantity,
      price,
      type:  selectedType,
      image: product.image,
    };
    addItem(cartItem);
    setQuantity(1);
    alert('Added to cart!');
  };

  return (
    <div className="bg-surface2 rounded-3xl overflow-hidden shadow-xl border border-white/10 transition-all duration-200 hover:-translate-y-1 hover:border-brand/20 flex flex-col">

      {/* Image */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#1C1814]">
        {!imgError ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          // Fallback if image fails to load
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <span className="text-5xl">🍛</span>
            <span className="text-xs text-gray-500">{product.name}</span>
          </div>
        )}

        {/* Price badge */}
        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-brand text-xs font-bold px-2.5 py-1 rounded-full border border-brand/20">
          ₹{product.prices.plate}+
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-white mb-1 leading-snug">
          {product.name}
        </h3>
        <p className="text-gray-400 text-sm mb-4 leading-relaxed flex-1">
          {product.description}
        </p>

        <div className="space-y-3">
          {/* Size selector */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">
              Size
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as 'plate' | 'kg' | 'halfKg')}
              className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-brand/50 transition-colors"
            >
              <option value="plate">Per Plate — ₹{product.prices.plate}</option>
              <option value="halfKg">1.5 KG — ₹{product.prices.halfKg}</option>
              <option value="kg">Per KG — ₹{product.prices.kg}</option>
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">
              Quantity
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-9 h-9 rounded-xl bg-black/60 border border-white/10 text-white text-lg flex items-center justify-center hover:border-brand/50 transition-colors"
              >
                −
              </button>
              <span className="flex-1 text-center text-white font-semibold text-base">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="w-9 h-9 rounded-xl bg-black/60 border border-white/10 text-white text-lg flex items-center justify-center hover:border-brand/50 transition-colors"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          className="mt-4 w-full btn-primary"
        >
          Add to Cart — ₹{(product.prices[selectedType] * quantity).toFixed(0)}
        </button>
      </div>
    </div>
  );
};