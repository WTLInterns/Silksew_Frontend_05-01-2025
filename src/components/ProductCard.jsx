
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { isFavorited, toggleFavorite, favoritesLoading } = useFavorites();

  if (!product) {
    return null;
  }

  const handleFavoriteClick = async (e) => {
    e.stopPropagation(); // Prevent navigation when clicking the heart
    if (favoritesLoading[product._id]) return; // Prevent multiple clicks while processing

    try {
      await toggleFavorite(product._id);
      if (isFavorited(product._id)) {
        toast.info('Removed from favorites');
      } else {
        toast.success('Added to favorites!');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update favorites.');
    }
  };

  const getProductImage = (product) => {
    if (!product || !product.images || product.images.length === 0) {
      return "/logo.png";
    }
    try {
      // This logic seems specific to your data structure
      const imagesByColor = JSON.parse(product.images[0]);
      const firstColor = Object.keys(imagesByColor)[0];
      if (firstColor && imagesByColor[firstColor].length > 0) {
        return imagesByColor[firstColor][0];
      }
    } catch (e) {
      if (Array.isArray(product.images) && typeof product.images[0] === 'string') {
        return product.images[0];
      }
    }
    return "/logo.png";
  };

  const imageSrc = getProductImage(product);
  const isProductFavorited = isFavorited(product._id);

  return (
    <div 
      className="border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 group cursor-pointer"
      onClick={() => navigate(`/product/${product._id}`)}
    >
      <div className="relative pt-[125%] overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={imageSrc}
            alt={product.name}
            className="w-full h-full object-contain p-2"
            style={{
              maxHeight: '100%',
              maxWidth: '100%',
              objectFit: 'contain',
              objectPosition: 'center'
            }}
          />
        </div>
        <button
          onClick={handleFavoriteClick}
          disabled={favoritesLoading[product._id]}
          className="absolute top-2 right-2 bg-white rounded-full p-2 transition-transform duration-200 transform hover:scale-110 z-10"
        >
          <Heart 
            className={`w-6 h-6 ${isProductFavorited ? 'text-red-500 fill-current' : 'text-gray-500'}`} 
          />
        </button>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold truncate">{product.name}</h3>
        <p className="text-gray-600 mt-1">Rs {product.price?.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default ProductCard;




