import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./FilterProduct.css";
import FavoriteButton from "../common/FavoriteButton";

const FilterProduct = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://api.silksew.com/api/products");
  
        // Ensure API response is an array
        const fetchedProducts = Array.isArray(response.data.products)
          ? response.data.products
          : [];
  
        // Filter products based on category directly
        const filteredProducts = fetchedProducts.filter((pro) =>
          pro?.name?.toLowerCase().includes(category?.toLowerCase())
        );
  
        console.log("Filtered Products:", filteredProducts);
  
        setProducts(filteredProducts); // Store the filtered products in state
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
  
    fetchProducts();
  }, [category]); 
  
  const shortenName = (name) => (name.length > 25 ? name.substring(0, 25) + "..." : name)

  const handleViewProduct = (product) => {
    navigate(`/product/${product._id}`, { state: { product } })
  }

  
  const getImage = (images, availableColors) => {
    if (images && images.length > 0 && availableColors && availableColors.length > 0) {
      try {
        for (const color of availableColors) {
          const parsedImages = JSON.parse(images[0])
          if (parsedImages[color.name] && parsedImages[color.name].length > 0) {
            return parsedImages[color.name][0]
          }
        }
        const parsedImages = JSON.parse(images[0])
        const firstAvailableColor = Object.keys(parsedImages)[0]
        if (parsedImages[firstAvailableColor] && parsedImages[firstAvailableColor].length > 0) {
          return parsedImages[firstAvailableColor][0]
        }
      } catch (error) {
        console.error("Error parsing image JSON:", error)
      }
    }
    return "https://via.placeholder.com/150"
  }


  return (
    <div className="container">
      <h1 className="title">{category} Products</h1>
      <div>
      <div className="product-grid">
          {products.length > 0 ? (
            products.map((item) => (
              <div key={item._id} className="product-card">
                <div className="image-container" style={{ position: 'relative' }}>
                  <img
                    src={getImage(item.images, item.availableColors) || "/logo.png"}
                    alt={item.name}
                    className="product-image"
                  />
                  {/* Favorite heart icon */}
                  <div 
                    className="absolute top-3 right-3 z-10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FavoriteButton productId={item._id} size="sm" />
                  </div>
                </div>
                <div className="product-details">
                  <h4 className="product-name">{shortenName(item.name)}</h4>
                  <div className="price-container">
                    <span className="new-price">Rs.{item.price.toFixed(2)}</span>
                    {item.oldPrice && <span className="old-price">Rs.{item.oldPrice.toFixed(2)}</span>}
                  </div>
                  <button onClick={() => handleViewProduct(item)} className="view-product-btn" >
                    VIEW PRODUCT
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-products">No products available for this subcategory.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterProduct;
