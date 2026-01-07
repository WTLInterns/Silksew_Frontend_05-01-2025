"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "./NewCollections.css"
import axios from "axios"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import FavoriteButton from "../common/FavoriteButton"

const NewCollections = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const navigate = useNavigate()

  const breakpoints = {
    1400: {
      slidesPerView: 5,
      spaceBetween: 20,
    },
    1024: {
      slidesPerView: 4,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 15,
    },
    0: {
      slidesPerView: 2,
      spaceBetween: 10,
    },
  }

  const shortenName = (name) => (name.length > 25 ? name.substring(0, 25) + "..." : name)

  // Check if product has discount-only offer (no timeline)
  const hasDiscountOnly = (product) => {
    return product.discountPercent && product.discountPercent > 0 && !product.offerEndDate
  }

  // Check if product has active time-based offer
  const isWithinOfferWindow = (start, end) => {
    if (!end) return false
    const now = new Date()
    const startDate = start ? new Date(start) : null
    const endDate = new Date(end)
    return (startDate ? now >= startDate : true) && now < endDate
  }

  // Calculate discounted price
  const calculateDiscountedPrice = (originalPrice, discountPercent) => {
    if (!discountPercent || discountPercent <= 0) return originalPrice
    return Math.round(originalPrice - (originalPrice * discountPercent / 100))
  }

  // Get display prices for product
  const getDisplayPrices = (product) => {
    const discountOnly = hasDiscountOnly(product)
    const timeBasedOffer = isWithinOfferWindow(product.offerStartDate, product.offerEndDate)
    
    if (discountOnly) {
      const originalPrice = product.oldPrice || product.price
      const discountedPrice = calculateDiscountedPrice(originalPrice, product.discountPercent)
      return {
        currentPrice: discountedPrice,
        oldPrice: originalPrice,
        hasDiscount: true,
        discountPercent: product.discountPercent,
        isSpecialOffer: true
      }
    } else if (timeBasedOffer && product.oldPrice && product.oldPrice > product.price) {
      return {
        currentPrice: product.price,
        oldPrice: product.oldPrice,
        hasDiscount: true,
        discountPercent: Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100),
        isSpecialOffer: false
      }
    } else {
      return {
        currentPrice: product.price,
        oldPrice: product.oldPrice,
        hasDiscount: false,
        discountPercent: 0,
        isSpecialOffer: false
      }
    }
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://api.silksew.com/api/products/list")
        const fetchedProducts = Array.isArray(response.data) ? response.data : response.data.products
        setProducts(fetchedProducts)
      } catch (err) {
        setError("Failed to load products.")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

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

  if (loading) return <div className="nc-loading">Loading...</div>
  if (error) return <div className="nc-error">{error}</div>

  const handleViewProduct = (product) => {
    navigate(`/product/${product._id}`, { state: { product } })
  }

  return (
    <section className="nc-container">
      <h2 className="nc-title" style={{}}>
        Featured Collection
      </h2>
      <h6 className="ncc-title" style={{}}>
        Handpicked pieces that embody timeless elegance and contemporary style.
      </h6>
      <h6 className="ncc-title" style={{}}>
        Each garment tells a story of craftsmanship and sophistication.
      </h6>
      <br></br>

      <div className="nc-gradient-line"></div>
      <div className="nc-carousel-container" >
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={4}
          breakpoints={breakpoints}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          className="nc-carousel"
        >
          {products.map((item, i) => {
            const priceInfo = getDisplayPrices(item)
            return (
              <SwiperSlide key={i} className="nc-carousel-item">
                <article className="nc-product-card" onClick={() => handleViewProduct(item)}  >
                  <div className="nc-product-image-container" style={{ position: "relative" }}>
                    <img
                      src={getImage(item.images, item.availableColors) || "/logo.png"}
                      alt={item.name}
                      className="nc-product-image"
                    />
                    {/* Discount Badge */}
                    {priceInfo.hasDiscount && (
                      <div 
                        style={{
                          position: "absolute",
                          top: "8px",
                          left: "8px",
                          backgroundColor: priceInfo.isSpecialOffer ? "#16a34a" : "#dc2626",
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: "bold",
                          zIndex: 5
                        }}
                      >
                        {priceInfo.isSpecialOffer ? "Special Offer" : `${priceInfo.discountPercent}% OFF`}
                      </div>
                    )}
                    <div className="absolute top-3 right-3 z-10" onClick={(e) => e.stopPropagation()}>
                      <FavoriteButton productId={item._id} />
                    </div>
                  </div>
                  <div className="nc-product-details">
                    <h3 className="nc-brand-name">{item.brand || "BRAND"}</h3>
                    <p className="nc-product-name">{shortenName(item.name)}</p>
                    <div className="nc-price-container">
                      <span className="nc-current-price">₹ {priceInfo.currentPrice}</span>
                      {priceInfo.hasDiscount && priceInfo.oldPrice && (
                        <span className="nc-original-price">₹ {priceInfo.oldPrice}</span>
                      )}
                       {priceInfo.hasDiscount && (
                      <div style={{ fontSize: "12px", color: "#16a34a", fontWeight: "600", marginTop: "4px" }}>
                       save ₹{priceInfo.oldPrice - priceInfo.currentPrice}
                      </div>
                    )}
                    </div>
                   
                    <button onClick={() => handleViewProduct(item)} className="view-product-btn">
                      View Product
                    </button>
                  </div>
                </article>
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>
    </section>
  )
}

export default NewCollections
