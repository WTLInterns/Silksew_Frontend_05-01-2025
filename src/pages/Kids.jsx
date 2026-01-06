import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../pages/CSS/card.css";
import axios from "axios";
import FavoriteButton from "../components/common/FavoriteButton";

function Kids() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch products and filter only those in the 'Kids' category
        const response = await axios.get("https://api.silksew.com/api/products");
        const fetchedProducts = Array.isArray(response.data)
          ? response.data
          : response.data.products;

        // Filter products that belong to the 'Kids' category
        const kidsProducts = fetchedProducts.filter((product) =>
          product.category.includes("kid")
        );

        setProducts(kidsProducts);
      } catch (error) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Shorten product names if they exceed 25 characters
  const shortenName = (name) =>
    name.length > 25 ? name.substring(0, 25) + "..." : name;

  const handleViewProduct = (product) => {
    navigate(`/product/${product._id}`, { state: { product } });
  };


  // Function to get the first image URL from the images array
  const getImage = (images, availableColors) => {
    if (images && images.length > 0 && availableColors && availableColors.length > 0) {
      try {
        // Iterate over the available colors to find the first color with images
        for (const color of availableColors) {
          // Parse the image data for the current color
          const parsedImages = JSON.parse(images[0]);
          if (parsedImages[color.name] && parsedImages[color.name].length > 0) {
            // Return the first image of the available color
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
      <hr />
      <div className="popular-item">
        {products.length > 0 ? (
          products.map((item) => {
            const imageUrl = getImage(item.images, item.availableColors); // Get the image URL
            return (
              <div key={item._id} className="item-container">
                <div style={{ position: 'relative' }}>
                  <img
                    src={imageUrl || item.images[0]} // Show image URL or fallback to original
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
            );
          })
        ) : (
          <div>No products available.</div>
        )}
      </div>
    </div>
  );
}

export default Kids;
