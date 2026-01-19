"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "./NewCollections.css"
import axios from "axios"
import FavoriteButton from "../common/FavoriteButton"

const NewCollections = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [hoveredProduct, setHoveredProduct] = useState(null)
  const navigate = useNavigate()

  const shortenName = (name) => (name && name.length > 25 ? name.substring(0, 25) + "..." : name || '')

  const hasDiscountOnly = (product) => {
    return product?.discountPercent && product.discountPercent > 0 && !product.offerEndDate
  }


  const calculateDiscountedPrice = (originalPrice, discountPercent) => {
    if (!discountPercent || discountPercent <= 0) return originalPrice || 0
    return Math.round((originalPrice || 0) - ((originalPrice || 0) * discountPercent / 100))
  }

  // Enhanced parsing function for product arrays (colors, sizes, etc.)
  const parseProductArray = (data, fieldName = "unknown") => {
    console.log(`Parsing ${fieldName}:`, data);

    if (!data) {
      console.log(`No ${fieldName} data found`);
      return [];
    }

    // If it's already an array of strings/objects, return it
    if (Array.isArray(data) && data.length > 0) {
      // Check if first element is a string (direct array)
      if (typeof data[0] === "string") {
        console.log(`${fieldName} is direct string array:`, data);
        return data;
      }

      // Check if first element is an array (nested array)
      if (Array.isArray(data[0])) {
        console.log(`${fieldName} is nested array:`, data[0]);
        return data[0];
      }

      // Check if first element is an object
      if (typeof data[0] === "object") {
        console.log(`${fieldName} is object array:`, data);
        return data;
      }

      // Try to parse if it's a JSON string
      try {
        const parsed = JSON.parse(data[0]);
        console.log(`${fieldName} parsed from JSON:`, parsed);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch (e) {
        console.error(`Error parsing ${fieldName}:`, e);
        return [];
      }
    }

    console.log(`${fieldName} format not recognized, returning empty array`);
    return [];
  };

  // Function to get available sizes from product
  const getAvailableSizes = (product) => {
    if (!product) return [];
    
    // Use the same parsing logic as in ProductDisplay
    const availableSizes = parseProductArray(product.availableSizes, "sizes");
    
    // If no sizes found in availableSizes, try variants as fallback
    if (availableSizes.length === 0 && product.variants && Array.isArray(product.variants)) {
      const sizeSet = new Set();
      product.variants.forEach(variant => {
        if (variant.size) sizeSet.add(variant.size);
      });
      return Array.from(sizeSet);
    }
    
    console.log("Available sizes:", availableSizes);
    return availableSizes;
  };

  // Function to check if offer is active
  const isWithinOfferWindow = (start, end) => {
    if (!end) return false;
    try {
      const now = new Date();
      const startDate = start ? new Date(start) : null;
      const endDate = new Date(end);
      return (startDate ? now >= startDate : true) && now < endDate;
    } catch (e) {
      console.error("Error parsing dates:", e);
      return false;
    }
  };

  // Function to format remaining time (for initial render)
  const getRemainingTime = (endDate) => {
    if (!endDate) return null;
    try {
      const now = new Date();
      const end = new Date(endDate);
      const diff = end - now;
      
      if (diff <= 0) return '00:00:00';
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      return [
        hours.toString().padStart(2, '0'),
        minutes.toString().padStart(2, '0'),
        seconds.toString().padStart(2, '0')
      ].join(':');
    } catch (e) {
      console.error("Error calculating remaining time:", e);
      return null;
    }
  };

  const getDisplayPrices = (product) => {
    if (!product) return {
      currentPrice: 0,
      oldPrice: 0,
      hasDiscount: false,
      discountPercent: 0,
      isSpecialOffer: false,
      offerText: '',
      savings: 0,
      offerActive: false
    };
    
    const offerActive = isWithinOfferWindow(product.offerStartDate, product.offerEndDate);
    const discountOnly = hasDiscountOnly(product);
    const timeBasedOffer = isWithinOfferWindow(product.offerStartDate, product.offerEndDate);
    
    if (discountOnly) {
      const originalPrice = product.oldPrice || product.price || 0;
      const discountedPrice = calculateDiscountedPrice(originalPrice, product.discountPercent);
      return {
        currentPrice: discountedPrice,
        oldPrice: originalPrice,
        hasDiscount: true,
        discountPercent: product.discountPercent,
        isSpecialOffer: true,
        savings: originalPrice - discountedPrice,
        offerActive
      };
    } else if (timeBasedOffer && product.oldPrice && product.oldPrice > (product.price || 0)) {
      const discountPercent = Math.round(((product.oldPrice - (product.price || 0)) / product.oldPrice) * 100);
      return {
        currentPrice: product.price || 0,
        oldPrice: product.oldPrice,
        hasDiscount: true,
        discountPercent,
        isSpecialOffer: false,
        savings: product.oldPrice - (product.price || 0),
        offerActive
      };
    }
    
    return {
      currentPrice: product.price || 0,
      oldPrice: product.oldPrice,
      hasDiscount: false,
      discountPercent: 0,
      isSpecialOffer: false,
      savings: 0,
      offerActive: false
    };
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5003/api/products/list")
        const fetchedProducts = Array.isArray(response?.data) 
          ? response.data 
          : (response?.data?.products || [])
        setProducts(fetchedProducts)
      } catch (err) {
        console.error("Error fetching products:", err)
        setError("Failed to load products. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const getImage = (images, availableColors, imageIndex = 0) => {
    try {
      if (!images || !images.length) return "/logo.png";
      
      const parsedImages = typeof images[0] === 'string' ? JSON.parse(images[0]) : images[0];
      
      if (availableColors?.length > 0) {
        // Try to get images for the first available color
        const colorWithImage = availableColors.find(color => 
          parsedImages?.[color.name]?.length > 0
        );

        if (colorWithImage && parsedImages[colorWithImage.name]?.[imageIndex]) {
          return parsedImages[colorWithImage.name][imageIndex];
        }
      }
      
      // Fallback to any available image
      const allImages = [];
      Object.values(parsedImages || {}).forEach(imgArr => {
        if (Array.isArray(imgArr)) {
          allImages.push(...imgArr);
        }
      });
      
      if (allImages[imageIndex]) {
        return allImages[imageIndex];
      }
      
      // If no image found at the requested index, return the first available image or logo
      return allImages[0] || "/logo.png";
      
    } catch (error) {
      console.error("Error parsing image:", error);
      return "/logo.png";
    }
  }

  const handleViewProduct = (product) => {
    if (product?._id) {
      navigate(`/product/${product._id}`, { state: { product } })
    }
  }

  if (loading) {
    return (
      <section className="nc-container">
        <div className="nc-loading">Loading...</div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="nc-container">
        <div className="nc-error">{error}</div>
      </section>
    )
  }

  // Use a separate component for the product card to manage its own countdown state
  const ProductCard = ({ product }) => {
    const priceInfo = getDisplayPrices(product);
    const availableSizes = getAvailableSizes(product);
    const [isHovered, setIsHovered] = useState(false);
    const [countdown, setCountdown] = useState('');
    
    // Handle countdown timer
    useEffect(() => {
      if (!priceInfo.offerActive || !product.offerEndDate) return;
      
      // Initial update
      const updateCountdown = () => {
        const remaining = getRemainingTime(product.offerEndDate);
        setCountdown(remaining);
      };
      
      updateCountdown();
      
      // Update every second
      const timer = setInterval(updateCountdown, 1000);
      
      // Cleanup
      return () => clearInterval(timer);
    }, [priceInfo.offerActive, product.offerEndDate]);
    
    return (
      <article 
        className="nc-product-card"
        onClick={() => handleViewProduct(product)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="nc-product-image-container">
          <img
            src={getImage(product.images, product.availableColors, 0)}
            alt={product.name || 'Product'}
            className={`nc-product-image ${isHovered ? 'nc-product-image-hidden' : ''}`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/logo.png";
            }}
          />
          <img
            src={getImage(product.images, product.availableColors, 1) || getImage(product.images, product.availableColors, 0)}
            alt={product.name || 'Product'}
            className={`nc-product-image ${isHovered ? 'nc-product-image-visible' : 'nc-product-image-hidden'}`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/logo.png";
            }}
          />
          
          <div className="nc-like-button" onClick={(e) => e.stopPropagation()}>
            <FavoriteButton productId={product._id} size={20} />
          </div>
          
          {priceInfo.hasDiscount && (
            <div className="discount-badge" style={{
              background: priceInfo.isSpecialOffer 
                ? 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)' 
                : 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '10px',
              fontWeight: '600',
              zIndex: 3,
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              textTransform: 'uppercase',
              letterSpacing: '0.3px',
              position: 'absolute',
              top: '8px',
              left: '8px'
            }}>
              {priceInfo.isSpecialOffer && <span>✨</span>}
              <span>{priceInfo.discountPercent}% OFF</span>
            </div>
          )}
        </div>
        
        <div className="nc-product-details">
          <h3 className="nc-product-name" style={{ marginBottom: '12px' }}>
            {shortenName(product.name || 'Unnamed Product')}
          </h3>
          
          <div className="nc-price-section">
            <div className="nc-price-row">
              <div className="nc-price-container">
                <span className="nc-current-price">
                  ₹{priceInfo.currentPrice.toLocaleString()}
                </span>
                {priceInfo.hasDiscount && priceInfo.oldPrice > 0 && (
                  <span className="nc-original-price">
                    ₹{priceInfo.oldPrice.toLocaleString()}
                  </span>
                )}
              </div>
              {availableSizes.length > 0 && (
                <div className="nc-sizes-display">
                  {availableSizes.slice(0, 3).map((size, idx) => (
                    <span key={idx} className="nc-size-badge">
                      {size}
                    </span>
                  ))}
                  {availableSizes.length > 3 && (
                    <span className="nc-size-more">+{availableSizes.length - 3} more</span>
                  )}
                </div>
              )}
            </div>
            
            {/* Savings and Countdown */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginTop: '8px',
              paddingTop: '8px',
              borderTop: '1px solid #f0f0f0'
            }}>
              {priceInfo.hasDiscount && priceInfo.savings > 0 && (
                <span style={{
                  fontSize: '12px',
                  background: '#ecfdf5',
                  color: '#065f46',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  💰 Save ₹{priceInfo.savings}
                </span>
              )}
              
              {priceInfo.offerActive && countdown && (
                <span style={{
                  fontSize: '10px',
                  background: 'white',
                  color: '#dc2626',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  border: '1px solid #fecaca',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}>
                  ⏰ {countdown}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <button 
          className="nc-view-product-button"
          onClick={(e) => {
            e.stopPropagation();
            handleViewProduct(product);
          }}
        >
          View Product
        </button>
      </article>
    );
  };

  return (
    <section className="nc-container">
      <h2 className="nc-title">Featured Collection</h2>
      <h6 className="ncc-title">
        Handpicked pieces that embody timeless elegance and contemporary style.
      </h6>
      <h6 className="ncc-title">
        Each garment tells a story of craftsmanship and sophistication.
      </h6>
      <br />

      <div className="nc-gradient-line"></div>
      
      <div className="nc-products-grid">
        {Array.isArray(products) && products.length > 0 ? (
          products.map((item) => (
            item ? <ProductCard key={item._id} product={item} /> : null
          ))
        ) : (
          <div className="nc-no-products">No products found</div>
        )}
      </div>
    </section>
  )
}

export default NewCollections
