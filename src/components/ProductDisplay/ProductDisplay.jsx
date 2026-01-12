
"use client"

import { useState, useContext, useEffect } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import "./ProductDisplay.css"
import { ShopContext } from "../../context/ShopContext"
import { AuthContext } from "../../context/AuthContext"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import RelatedProducts from "../RelatedProducts/RelatedProducts"
import axios from "axios"
import { BASEURL } from "../../config"
import FavoriteButton from "../common/FavoriteButton"
import StarRating from "./StarRating"
import FeedBack from "./FeedBack"
import { FiShoppingCart } from 'react-icons/fi'

const ProductDisplay = () => {
  const { state } = useLocation()
  const { productId } = useParams()
  const [product, setProduct] = useState(null)
  const [review, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterReview, setFilterReview] = useState([])

  const shopContext = useContext(ShopContext)
  const { addToCart, products, token: shopToken } = shopContext
  const { token: authToken } = useContext(AuthContext)

  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [mainImage, setMainImage] = useState("")
  const [activeTab, setActiveTab] = useState("description")
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [descriptionExpanded, setDescriptionExpanded] = useState(false)
  const [quantity, setQuantity] = useState(1)

  const navigate = useNavigate()
  const [offerCountdown, setOfferCountdown] = useState("")
  const [isOfferActive, setIsOfferActive] = useState(false)

  const getOfferCountdown = (offerEndDate) => {
    if (!offerEndDate) return null

    const now = new Date()
    const end = new Date(offerEndDate)
    const diff = end - now

    if (diff <= 0) return null // offer expired

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
    const minutes = Math.floor((diff / (1000 * 60)) % 60)
    const seconds = Math.floor((diff / 1000) % 60)

    if (days >= 1) {
      return `${days} day${days > 1 ? 's' : ''} left`
    } else {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
  }

  const isWithinOfferWindow = (start, end) => {
    if (!end) return false
    const now = new Date()
    const startDate = start ? new Date(start) : null
    const endDate = new Date(end)
    return (startDate ? now >= startDate : true) && now < endDate
  }

  const calcDiscountPercent = (price, oldPrice, discountPercent) => {
    if (typeof discountPercent === 'number' && discountPercent > 0) return Math.round(discountPercent)
    if (oldPrice && oldPrice > price) {
      const pct = Math.round(((oldPrice - price) / oldPrice) * 100)
      return pct > 0 ? pct : 0
    }
    return 0
  }

  // Check if product has discount-only offer (no timeline)
  const hasDiscountOnly = (product) => {
    return product.discountPercent && product.discountPercent > 0 && !product.offerEndDate
  }

  // Calculate discounted price
  const calculateDiscountedPrice = (originalPrice, discountPercent) => {
    if (!discountPercent || discountPercent <= 0) return originalPrice
    return Math.round(originalPrice - (originalPrice * discountPercent / 100))
  }

  // Function to clean and validate image URLs
  const cleanImageUrl = (url) => {
    if (!url) return "/placeholder.svg"

    // Remove trailing backslashes and clean the URL
    let cleanUrl = url.toString().trim().replace(/\\+$/, "").replace(/\\/g, "")

    // Ensure it's a valid Cloudinary URL
    if (cleanUrl.includes("cloudinary.com")) {
      // Fix any double slashes (except after http:// or https://)
      cleanUrl = cleanUrl.replace(/([^:]\/)\/+/g, "$1")

      // Ensure the URL starts with https://
      if (!cleanUrl.startsWith("http")) {
        cleanUrl = "https://" + cleanUrl
      }

      console.log("Cleaned image URL:", cleanUrl)
      return cleanUrl
    }

    return "/placeholder.svg"
  }

  // Enhanced parsing function for colors and sizes
  const parseProductArray = (data, fieldName = "unknown") => {
    console.log(`Parsing ${fieldName}:`, data)

    if (!data) {
      console.log(`No ${fieldName} data found`)
      return []
    }

    // If it's already an array of strings/objects, return it
    if (Array.isArray(data) && data.length > 0) {
      // Check if first element is a string (direct array)
      if (typeof data[0] === "string") {
        console.log(`${fieldName} is direct string array:`, data)
        return data
      }

      // Check if first element is an array (nested array)
      if (Array.isArray(data[0])) {
        console.log(`${fieldName} is nested array:`, data[0])
        return data[0]
      }

      // Check if first element is an object
      if (typeof data[0] === "object") {
        console.log(`${fieldName} is object array:`, data)
        return data
      }

      // Try to parse if it's a JSON string
      try {
        const parsed = JSON.parse(data[0])
        console.log(`${fieldName} parsed from JSON:`, parsed)
        return Array.isArray(parsed) ? parsed : [parsed]
      } catch (e) {
        console.error(`Error parsing ${fieldName}:`, e)
        return []
      }
    }

    console.log(`${fieldName} format not recognized, returning empty array`)
    return []
  }

  // Handle favorite toggle
  const handleFavoriteClick = (e) => {
    if (!authToken) {
      e.preventDefault();
      toast.warn("Log in to add to favorites.", {
        position: "top-right",
        autoClose: 1000,
      })
      navigate("/login")
    }
  }

  useEffect(() => {
    if (!product) return
    const active = isWithinOfferWindow(product.offerStartDate, product.offerEndDate)
    setIsOfferActive(active)
    if (!active) return

    // initialize immediately
    setOfferCountdown(getOfferCountdown(product.offerEndDate))

    const interval = setInterval(() => {
      setOfferCountdown(getOfferCountdown(product.offerEndDate))
    }, 1000)

    return () => clearInterval(interval)
  }, [product])

  useEffect(() => {
    console.log("ProductDisplay mounted with productId:", productId)
    const fetchProduct = async () => {
      setLoading(true)
      setError(null)
      try {
        console.log("Fetching product data for ID:", productId)
        // First, try to find the product in the context
        let productData = null

        // Check if we have products in the context
        if (products && products.length > 0) {
          console.log("Looking for product in context products array:", products.length, "products")
          productData = products.find((p) => p._id === productId)
          if (productData) {
            console.log("Found product in context:", productData.name)
          }
        }

        // If not found in context, check if it was passed in state
        if (!productData && state?.product) {
          console.log("Found product in route state")
          productData = state.product
        }

        // If still not found, check localStorage
        if (!productData) {
          const storedProduct = localStorage.getItem(`product_${productId}`)
          if (storedProduct) {
            console.log("Found product in localStorage")
            productData = JSON.parse(storedProduct)
          }
        }

        // If still not found, fetch from API
        if (!productData && productId) {
          console.log("Fetching product from API")
          const response = await axios.get(`${BASEURL}/api/products/${productId}`)
          if (response.status === 200) {
            console.log("API response successful:", response.data)
            productData = response.data
            localStorage.setItem(`product_${productId}`, JSON.stringify(productData))
          } else {
            throw new Error("Failed to fetch product data")
          }
        }

        if (productData) {
          console.log("Setting product data:", productData)
          console.log("Raw availableColors:", productData.availableColors)
          console.log("Raw availableSizes:", productData.availableSizes)
          console.log("Raw images:", productData.images)

          setProduct(productData)

          // Handle images properly
          try {
            // Handle images
            let parsedImages = {}
            if (productData.images && Array.isArray(productData.images) && productData.images.length > 0) {
              // Check if it's already a parsed object
              if (typeof productData.images[0] === "object") {
                parsedImages = productData.images[0]
              } else {
                parsedImages = JSON.parse(productData.images[0])
              }
            }

            // Clean all image URLs in the parsed images
            Object.keys(parsedImages).forEach((color) => {
              if (Array.isArray(parsedImages[color])) {
                parsedImages[color] = parsedImages[color].map((url) => cleanImageUrl(url))
              }
            })

            // Handle available colors with enhanced parsing
            const parsedColors = parseProductArray(productData.availableColors, "colors")
            console.log("Parsed colors:", parsedColors)

            // Determine default color - try to get from parsed colors or image keys
            let defaultColor = ""
            if (parsedColors.length > 0) {
              // If colors are objects with name property
              if (typeof parsedColors[0] === "object" && parsedColors[0].name) {
                defaultColor = parsedColors[0].name
              } else if (typeof parsedColors[0] === "string") {
                // If colors are just strings
                defaultColor = parsedColors[0]
              }
            } else {
              // Fallback to first image color key
              defaultColor = Object.keys(parsedImages)[0] || "Black"
            }

            console.log("Default color set to:", defaultColor)
            setSelectedColor(defaultColor)

            // Set main image based on selected color
            if (parsedImages[defaultColor] && parsedImages[defaultColor].length > 0) {
              const cleanedMainImage = cleanImageUrl(parsedImages[defaultColor][0])
              setMainImage(cleanedMainImage)
              console.log("Set main image:", cleanedMainImage)
            } else {
              console.warn("No images found for color:", defaultColor)
              setMainImage("/placeholder.svg")
            }
          } catch (parseError) {
            console.error("Error parsing product data:", parseError)
            setMainImage("/placeholder.svg")
          }
        } else {
          throw new Error("No product data available")
        }
      } catch (error) {
        console.error("Error fetching product:", error)
        setError("Failed to load product details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
    window.scrollTo(0, 0)
  }, [productId, state, products])

  // Update localStorage when product changes
  useEffect(() => {
    if (product) {
      localStorage.setItem(`product_${product._id}`, JSON.stringify(product))
    }
  }, [product])

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${BASEURL}/api/review`)
        console.log("Fetched reviews:", res.data.data.length)
        setReviews(res.data.data)
      } catch (error) {
        console.error("Error fetching reviews:", error)
      }
    }

    fetchReviews()
  }, [])

  // Filter reviews for this product
  useEffect(() => {
    if (productId && review.length > 0) {
      const filterData = review.filter((r) => r.productId === productId)
      console.log("Filtered reviews for product:", filterData.length)
      setFilterReview(filterData)
    }
  }, [review, productId])

  if (loading) {
    return <div className="loading-container">Loading product details...</div>
  }

  if (error) {
    return <div className="error-container">{error}</div>
  }

  if (!product) {
    return <div className="not-found-container">Product not found.</div>
  }

  // Parse product data safely
  const parseProductData = (data, defaultValue = []) => {
    if (!data || !Array.isArray(data) || data.length === 0) return defaultValue

    try {
      if (typeof data[0] === "object") return data[0]
      return JSON.parse(data[0])
    } catch (e) {
      console.error("Error parsing data:", e)
      return defaultValue
    }
  }

  // Parse product data with enhanced parsing
  const rawImages = parseProductData(product.images, {})
  // Clean all image URLs
  const images = {}
  Object.keys(rawImages).forEach((color) => {
    if (Array.isArray(rawImages[color])) {
      images[color] = rawImages[color].map((url) => cleanImageUrl(url))
    }
  })

  // Use enhanced parsing for colors and sizes
  const availableSizes = parseProductArray(product.availableSizes, "sizes")
  const availableColors = parseProductArray(product.availableColors, "colors")

  console.log("Final parsed sizes:", availableSizes)
  console.log("Final parsed colors:", availableColors)

  // Quantity handler functions
  const handleQuantityIncrease = () => {
    setQuantity(prev => Math.min(prev + 1, 10)) // Max 10 items
  }

  const handleQuantityDecrease = () => {
    setQuantity(prev => Math.max(prev - 1, 1)) // Min 1 item
  }

  const handleBuyNow = () => {
    if (!authToken) {
      setShowLoginModal(true)
      return
    }

    if (!selectedSize) {
      toast.error("Select a size.", { position: "top-right", autoClose: 1000 })
      return
    }

    if (!selectedColor) {
      toast.error("Select a color.", {
        position: "top-right",
        autoClose: 1000,
      })
      return
    }

    // Add to cart with quantity and navigate to checkout
    addToCart(product._id, selectedSize, selectedColor, quantity)
    toast.success("Added to cart!", { position: "top-right", autoClose: 1000 })
    setTimeout(() => navigate("/checkout"), 1000)
  }

  const handleAddToCart = () => {
    if (!authToken) {
      setShowLoginModal(true)
      return
    }

    if (!selectedSize) {
      toast.error("Select a size.", { position: "top-right", autoClose: 1000 })
      return
    }

    if (!selectedColor) {
      toast.error("Select a color.", {
        position: "top-right",
        autoClose: 1000,
      })
      return
    }

    console.log("Adding to cart:", {
      productId: product._id,
      size: selectedSize,
      color: selectedColor,
      quantity: quantity
    })

    addToCart(product._id, selectedSize, selectedColor, quantity)
    toast.success("Added to cart!", { position: "top-right", autoClose: 1000 })
    setTimeout(() => navigate("/cart"), 1000)
  }

  const handleColorChange = (color) => {
    console.log("Changing color to:", color)
    setSelectedColor(color)
    if (images[color] && images[color].length > 0) {
      const cleanedImage = cleanImageUrl(images[color][0])
      setMainImage(cleanedImage)
      console.log("Changed main image to:", cleanedImage)
    }
  }

  const handleNewFeedback = (newFeedback) => {
    setFilterReview((prevReviews) => [...prevReviews, newFeedback])
  }

  // Handle image load error
  const handleImageError = (e) => {
    console.error("Image failed to load:", e.target.src)
    e.target.src = "/placeholder.svg"
  }

  // Function to get color name from color data
  const getColorName = (colorData) => {
    if (typeof colorData === "string") {
      return colorData
    }
    if (typeof colorData === "object" && colorData.name) {
      return colorData.name
    }
    return colorData
  }

  // Function to truncate description
  const truncateDescription = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  return (
    <>
      <div className="productdisplay">
        <ToastContainer />

        {/* Main Product Display */}
        <div className="productdisplay-main">
          {/* Left Side - Images */}
          <div className="productdisplay-left">
            <div className="favorite-button-container">
              <FavoriteButton 
                productId={product._id} 
                onFavoriteClick={handleFavoriteClick}
              />
            </div>
            
            {/* Thumbnail Images */}
            <div className="productdisplay-img-list">
              {images[selectedColor]?.map((img, index) => (
                <img
                  key={index}
                  src={cleanImageUrl(img) || "/placeholder.svg"}
                  alt={`${product.name} ${index + 1}`}
                  onClick={() => setMainImage(cleanImageUrl(img))}
                  onError={handleImageError}
                  className={mainImage === cleanImageUrl(img) ? "active" : ""}
                />
              ))}
            </div>

            {/* Main Image */}
            <div className="productdisplay-main-img-container">
              <img
                src={cleanImageUrl(mainImage) || "/placeholder.svg"}
                alt={product.name}
                onError={handleImageError}
                className="productdisplay-main-img"
              />
            </div>
          </div>

          {/* Right Side - Product Details */}
          <div className="productdisplay-right">
            <h2>{product.name}</h2>

            {/* Description with Read More */}
            <div className="description-container">
              <p className="description">
                {descriptionExpanded
                  ? product.description
                  : truncateDescription(product.description)}
              </p>
              {product.description.length > 150 && (
                <button
                  onClick={() => setDescriptionExpanded(!descriptionExpanded)}
                  className="read-more-btn"
                >
                  {descriptionExpanded ? "Read Less" : "Read More"}
                </button>
              )}
            </div>

            {/* Price Section */}
            {(() => {
              const active = isOfferActive
              const discountOnly = hasDiscountOnly(product)
              const pct = calcDiscountPercent(
                product.price,
                product.oldPrice,
                product.discountPercent
              )

              let displayPrice, displayOldPrice, savings = 0

              if (discountOnly) {
                const originalPrice = product.oldPrice || product.price
                displayPrice = calculateDiscountedPrice(originalPrice, product.discountPercent)
                displayOldPrice = Math.round(originalPrice)
                savings = displayOldPrice - displayPrice
              } else if (active) {
                displayPrice = product.price
                  ? Math.round(product.price)
                  : Math.round(product.oldPrice || product.price)
                displayOldPrice =
                  active && product.oldPrice && product.oldPrice > product.price
                    ? Math.round(product.oldPrice)
                    : null
                savings = displayOldPrice ? displayOldPrice - displayPrice : 0
              } else {
                displayPrice = Math.round(product.price)
                displayOldPrice = null
              }

              return (
                <div className="productdisplay-right-prices">
                  {/* Offer / Discount Badges */}
                  {(discountOnly || (active && (pct > 0 || offerCountdown))) && (
                    <div className="deal-banner">
                      {discountOnly && (
                        <span className="special-offer-badge">Special Offer</span>
                      )}
                      {pct > 0 && (
                        <span className="discount-badge">{pct}% OFF</span>
                      )}
                      {offerCountdown && offerCountdown !== "0" && (
                        <span className="countdown">{offerCountdown}</span>
                      )}
                    </div>
                  )}

                  <div className="price-container">
                    <div className="productdisplay-right-price-new">
                      Rs {displayPrice}
                    </div>
                    {displayOldPrice && displayOldPrice !== displayPrice && (
                      <div className="productdisplay-right-price-old">
                        Rs {displayOldPrice}
                      </div>
                    )}
                  </div>
                </div>
              )
            })()}

            {/* Color and Quantity Selection */}
            <div className="productdisplay-right-colors-quantity">
              <div className="color-section">
                <h3>Color</h3>
                <div className="color-options">
                  {availableColors?.length > 0 ? (
                    availableColors.map((colorData, index) => {
                      const colorName = getColorName(colorData)
                      return (
                        <div
                          key={index}
                          className={`color-circle ${selectedColor === colorName ? "selected" : ""}`}
                          style={{ backgroundColor: colorName.toLowerCase() }}
                          onClick={() => handleColorChange(colorName)}
                          title={colorName}
                        />
                      )
                    })
                  ) : (
                    <p className="no-options">No colors available</p>
                  )}
                </div>
              </div>

              <div className="quantity-section">
                <h3>Quantity</h3>
                <div className="quantity-selector">
                  <button 
                    onClick={handleQuantityDecrease}
                    className="quantity-btn decrease"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="quantity-value">{quantity}</span>
                  <button 
                    onClick={handleQuantityIncrease}
                    className="quantity-btn increase"
                    disabled={quantity >= 10}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Size Selection */}
            <div className="productdisplay-right-sizes">
              <h3>Select Size</h3>
              <div className="size-options">
                {availableSizes?.length > 0 ? (
                  availableSizes.map((size, index) => (
                    <div
                      key={index}
                      className={`size-box ${selectedSize === size ? "selected" : ""}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </div>
                  ))
                ) : (
                  <p className="no-options">No sizes available</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button
                onClick={handleAddToCart}
                className="add-to-cart-btn small"
              >
                <FiShoppingCart className="cart-icon" />
                ADD TO CART
              </button>
              <button
                onClick={handleBuyNow}
                className="buy-now-btn"
              >
                BUY NOW
              </button>
            </div>
          </div>
        </div>

        {/* Description and Reviews Section */}
        <div className="descriptionbox">
          <div className="descriptionbox-navigator">
            <div 
              className={`descriptionbox-nav-box ${activeTab === "description" ? "active" : ""}`}
              onClick={() => setActiveTab("description")}
            >
              Description
            </div>
            <div 
              className={`descriptionbox-nav-box ${activeTab === "reviews" ? "active" : ""}`}
              onClick={() => setActiveTab("reviews")}
            >
              Reviews
            </div>
          </div>

          <div className="descriptionbox-description">
            {activeTab === "description" ? (
              <p>{product.description}</p>
            ) : (
              <div className="review-content">
                {/* Feedback Form */}
                <div className="feedback-section">
                  <FeedBack productId={productId} onNewFeedback={handleNewFeedback} />
                </div>

                {/* Reviews List */}
                <div className="review-section">
                  <h3 className="customer-reviews-title">Customer Reviews</h3>
                  
                  <div className="review-list-container">
                    {filterReview.length > 0 ? (
                      <ul className="review-list">
                        {filterReview.map((review) => (
                          <li key={review._id} className="review-item">
                            <div className="review-header">
                              <h4 className="review-name">{review.name}</h4>
                              <StarRating star={review.rating} />
                            </div>
                            <p className="review-text">{review.review}</p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="no-reviews">No reviews yet. Be the first to review!</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Glassy Login Modal */}
      {showLoginModal && (
        <div className="modal-overlay">
          <div className="glass-modal">
            <div className="modal-header">
              <h3>Login Required</h3>
              <button
                className="modal-close-btn"
                onClick={() => setShowLoginModal(false)}
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <p>You need to login first to add items to your cart.</p>
            </div>
            <div className="modal-footer">
              <button
                className="modal-btn modal-btn-login"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
              <button
                className="modal-btn modal-btn-signup"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}

      <RelatedProducts 
        subcategory={product.subcategory} 
        currentProductId={product._id} 
      />
    </>
  )
}

export default ProductDisplay