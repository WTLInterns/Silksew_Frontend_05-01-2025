import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../pages/CSS/card.css";
import axios from 'axios';
import FavoriteButton from "../components/common/FavoriteButton";

function Women() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch all products (same as Shop Women's Collection button)
        const response = await axios.get('http://localhost:5003/api/products');
        const fetchedProducts = Array.isArray(response.data) ? response.data : response.data.products;
        
        // Show all products (no filtering) - same as "Shop Women's Collection"
        setProducts(fetchedProducts);
      } catch (error) {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Shorten product names if they exceed 25 characters
  const shortenName = (name) => (name.length > 25 ? name.substring(0, 25) + '...' : name);

  const handleViewProduct = (product) => {
    navigate(`/product/${product._id}`, { state: { product } });
  };


  // Function to fetch an image (similar to previous examples)
  const getImage = (images, availableColors) => {
    if (images && images.length > 0 && availableColors && availableColors.length > 0) {
      try {
        // Iterate over the available colors to find the first color with images
        for (const color of availableColors) {
          // Parse the image data for the current color
          const parsedImages = JSON.parse(images[0]);
          if (parsedImages[color.name] && parsedImages[color.name].length > 0) {
            // Return the first image of the current color
            return parsedImages[color.name][0];
          }
        }

        // If no specific images found for any color, return the first available image
        const parsedImages = JSON.parse(images[0]);
        const firstAvailableColor = Object.keys(parsedImages)[0];
        if (parsedImages[firstAvailableColor] && parsedImages[firstAvailableColor].length > 0) {
          return parsedImages[firstAvailableColor][0];
        }
      } catch (error) {
        console.error('Error parsing image JSON:', error);
      }
    }
    return 'https://via.placeholder.com/150'; // Default placeholder image if no valid image found
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="popular">
      <h1>POPULAR IN WOMEN</h1>
      <hr />
      <div className="popular-item">
        {products.length > 0 ? (
          products.map((item) => (
            <div key={item._id} className="item-container">
              {/* Display the product image based on the available images */}
              <div style={{ position: 'relative' }}>
                <img
                  src={getImage(item.images, item.availableColors)} // Use the updated getImage function
                  alt={item.name}
                />
                <div 
                  className="absolute top-3 right-3 z-10" 
                  onClick={(e) => e.stopPropagation()}
                >
                  <FavoriteButton productId={item._id} />
                </div>
              </div>
              <h4>{shortenName(item.name)}</h4>
              <div className="prices">
                <span className="new-price">Rs.{item.price.toFixed(2)}</span>
                {item.oldPrice && (
                  <span className="old-price">Rs.{item.oldPrice.toFixed(2)}</span>
                )}
              </div>
              <button
                onClick={() => handleViewProduct(item)}
                className="add-to-cart-btn"
              >
                View Product
              </button>
            </div>
          ))
        ) : (
          <div>No products available.</div>
        )}
      </div>
    </div>
  );
}

export default Women;
