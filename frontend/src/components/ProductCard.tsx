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

  const handleAddToCart = () => {
    const price = product.prices[selectedType];
    const cartItem: CartItem = {
      productId: product._id,
      name: product.name,
      quantity,
      price,
      type: selectedType,
      image: product.image,
    };
    addItem(cartItem);
    setQuantity(1);
    alert('Added to cart!');
  };

  return (
    <div className="bg-surface2 rounded-3xl overflow-hidden shadow-xl border border-white/10 transition hover:-translate-y-1">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-52 object-cover"
      />
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-semibold text-white">{product.name}</h3>
          <span className="text-sm text-brand font-bold">₹{product.prices.plate}+</span>
        </div>
        <p className="text-gray-400 text-sm mb-5">{product.description}</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Select Size</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as 'plate' | 'kg' | 'halfKg')}
              className="w-full bg-black/60 border border-white/10 rounded px-3 py-2 text-white"
            >
              <option value="plate">Per Plate - ₹{product.prices.plate}</option>
              <option value="halfKg">1.5 KG - ₹{product.prices.halfKg}</option>
              <option value="kg">Per KG - ₹{product.prices.kg}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Quantity</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
              className="w-full bg-black/60 border border-white/10 rounded px-3 py-2 text-white"
            />
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          className="mt-5 w-full btn-primary"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};
