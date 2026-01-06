
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./RelatedProducts.css";
import FavoriteButton from "../common/FavoriteButton";

const RelatedProducts = ({ subcategory, currentProductId }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadingImages, setLoadingImages] = useState({});
  const navigate = useNavigate();
  const MAX_DESCRIPTION_LENGTH = 80; // Reduced for better consistency

  useEffect(() => {
    if (!subcategory || !currentProductId) return;

    const fetchRelatedProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5003/api/products", {
          params: { exclude: currentProductId },
        });

        if (response.data && Array.isArray(response.data.products)) {
          const normalizedSubcategory = Array.isArray(subcategory)
            ? subcategory[0]
            : subcategory;
          const filteredProducts = response.data.products.filter(
            (product) =>
              product.subcategory &&
              Array.isArray(product.subcategory) &&
              product.subcategory[0].toLowerCase() ===
                normalizedSubcategory.toLowerCase()
          );

          setRelatedProducts(filteredProducts);
          
          // Initialize loading state for all images
          const initialLoadingState = {};
          filteredProducts.forEach(product => {
            initialLoadingState[product._id] = true;
          });
          setLoadingImages(initialLoadingState);
        } else {
          setError("Error: Expected products array but got something else.");
        }
      } catch (error) {
        setError("Error fetching related products.");
      }
    };

    fetchRelatedProducts();
  }, [subcategory, currentProductId]);

  // Handle image load complete
  const handleImageLoaded = (productId) => {
    setLoadingImages(prev => ({
      ...prev,
      [productId]: false
    }));
  };

  // Handle image error
  const handleImageError = (productId) => {
    setLoadingImages(prev => ({
      ...prev,
      [productId]: false
    }));
  };

  // Handle Next Slide
  const nextSlide = () => {
    if (currentIndex + 4 < relatedProducts.length) {
      setCurrentIndex(currentIndex + 4);
    }
  };

  const truncateDescription = (description) => {
    if (description && description.length > MAX_DESCRIPTION_LENGTH) {
      return description.substring(0, MAX_DESCRIPTION_LENGTH) + "...";
    }
    return description || "";
  };

  const truncateProductName = (name) => {
    const MAX_NAME_LENGTH = 50;
    if (name && name.length > MAX_NAME_LENGTH) {
      return name.substring(0, MAX_NAME_LENGTH) + "...";
    }
    return name || "";
  };

  // Handle Previous Slide
  const prevSlide = () => {
    if (currentIndex - 4 >= 0) {
      setCurrentIndex(currentIndex - 4);
    }
  };

  const onProductClick = (item) => {
    navigate(`/product/${item._id}`, { state: { product: item } });
  };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="related-products-container">
      <hr />
      <div className="carousel-container">
        {currentIndex > 0 && (
          <button className="carousel-btn left" onClick={prevSlide}>
            &#10094;
          </button>
        )}

        <div className="product-grid">
          {relatedProducts.slice(currentIndex, currentIndex + 4).map((item) => {
            let imageUrl = "";
            try {
              const imageObj = JSON.parse(item.images[0]);
              imageUrl = imageObj
                ? Object.values(imageObj)[0][0]
                : "https://via.placeholder.com/300x400?text=Product+Image";
            } catch (e) {
              imageUrl = "https://via.placeholder.com/300x400?text=Image+Error";
            }

            return (
              <div key={item._id} className="product-card">
                <div className="image-container" style={{ position: 'relative' }}>
                  {loadingImages[item._id] && (
                    <div className="image-skeleton"></div>
                  )}
                  <img 
                    src={imageUrl} 
                    alt={item.name} 
                    className={`product-image ${loadingImages[item._id] ? 'loading' : 'loaded'}`}
                    onLoad={() => handleImageLoaded(item._id)}
                    onError={() => handleImageError(item._id)}
                  />
                  <div 
                    className="absolute top-3 right-3 z-10" 
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FavoriteButton productId={item._id} />
                  </div>
                  <div className="image-overlay">
                    <button
                      className="quick-view-button"
                      onClick={() => onProductClick(item)}
                    >
                      Quick View
                    </button>
                  </div>
                </div>
                <div className="product-details">
                  <div className="product-content">
                    <h2 className="product-name" title={item.name}>
                      {truncateProductName(item.name)}
                    </h2>
                    <p className="product-description" title={item.description}>
                      {truncateDescription(item.description)}
                    </p>
                    <div className="product-price">
                      <span className="new-price">{`Rs.${item.price}`}</span>
                      {item.oldPrice && (
                        <span className="old-price">{`Rs.${item.oldPrice}`}</span>
                      )}
                    </div>
                  </div>
                  {/* <div className="button-container">
                    <button
                      className="view-product-button"
                      onClick={() => onProductClick(item)}
                      style={{backgroundColor: "#4d0000"}}
                    >
                      View Product
                    </button>
                  </div> */}
                </div>
              </div>
            );
          })}
        </div>

        {currentIndex + 4 < relatedProducts.length && (
          <button className="carousel-btn right" onClick={nextSlide}>
            &#10095;
          </button>
        )}
      </div>
    </div>
  );
};

export default RelatedProducts;