// "use client"

// import { useNavigate } from "react-router-dom"
// import { useCategoryContext } from "../context/CategoryContext"
// import FavoriteButton from "./FavoriteButton"

// const CategoryProducts = () => {
//   const { selectedCategory, categoryProducts, loading } = useCategoryContext()
//   const navigate = useNavigate()

//   // Function to get the first valid image URL from a product
//   const getProductImage = (product) => {
//     const { images } = product
//     if (!images || images.length === 0) return "/placeholder-image.jpg"

//     // Case 1: If it's already a plain string URL
//     if (typeof images[0] === "string") {
//       try {
//         // Try parsing it (in case it's a JSON stringified object)
//         const parsed = JSON.parse(images[0])
//         const firstKey = Object.keys(parsed)[0] // e.g. "Pink"
//         return parsed[firstKey][0] // first image inside that color
//       } catch {
//         return images[0] // not JSON, just a URL string
//       }
//     }

//     // Case 2: If it's an object with .url
//     if (images[0]?.url) {
//       return images[0].url
//     }

//     return "/placeholder-image.jpg"
//   }

//   // Check if product has discount-only offer (no timeline)
//   const hasDiscountOnly = (product) => {
//     return product.discountPercent && product.discountPercent > 0 && !product.offerEndDate
//   }

//   // Check if product has active time-based offer
//   const isWithinOfferWindow = (start, end) => {
//     if (!end) return false
//     const now = new Date()
//     const startDate = start ? new Date(start) : null
//     const endDate = new Date(end)
//     return (startDate ? now >= startDate : true) && now < endDate
//   }

//   // Calculate discounted price
//   const calculateDiscountedPrice = (originalPrice, discountPercent) => {
//     if (!discountPercent || discountPercent <= 0) return originalPrice
//     return Math.round(originalPrice - (originalPrice * discountPercent / 100))
//   }

//   // Get display prices for product
//   const getDisplayPrices = (product) => {
//     const discountOnly = hasDiscountOnly(product)
//     const timeBasedOffer = isWithinOfferWindow(product.offerStartDate, product.offerEndDate)
    
//     if (discountOnly) {
//       const originalPrice = product.oldPrice || product.price
//       const discountedPrice = calculateDiscountedPrice(originalPrice, product.discountPercent)
//       return {
//         currentPrice: discountedPrice,
//         oldPrice: originalPrice,
//         hasDiscount: true,
//         discountPercent: product.discountPercent,
//         isSpecialOffer: true
//       }
//     } else if (timeBasedOffer && product.oldPrice && product.oldPrice > product.price) {
//       return {
//         currentPrice: product.price,
//         oldPrice: product.oldPrice,
//         hasDiscount: true,
//         discountPercent: Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100),
//         isSpecialOffer: false
//       }
//     } else {
//       return {
//         currentPrice: product.price,
//         oldPrice: product.oldPrice,
//         hasDiscount: false,
//         discountPercent: 0,
//         isSpecialOffer: false
//       }
//     }
//   }

//   if (!selectedCategory) return null

//   return (
//     <div
//       style={{
//         backgroundColor: "#f9fafb",
//         padding: "40px 20px",
//         minHeight: "60vh",
//       }}
//     >
//       <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
//         <h2
//           style={{
//             fontSize: "28px",
//             fontWeight: "600",
//             marginBottom: "8px",
//             color: "#374151",
//             textAlign: "center",
//           }}
//         >
//           {selectedCategory}
//         </h2>
//         <p
//           style={{
//             fontSize: "16px",
//             color: "#6b7280",
//             marginBottom: "32px",
//             textAlign: "center",
//           }}
//         >
//           {categoryProducts.length} products found
//         </p>

//         {loading ? (
//           <div style={{ textAlign: "center", padding: "60px 20px" }}>
//             <div
//               style={{
//                 display: "inline-block",
//                 width: "40px",
//                 height: "40px",
//                 border: "4px solid #f3f3f3",
//                 borderTop: "4px solid #d97706",
//                 borderRadius: "50%",
//                 animation: "spin 1s linear infinite",
//               }}
//             ></div>
//             <p style={{ marginTop: "20px", color: "#6b7280", fontSize: "18px" }}>Loading products...</p>
//           </div>
//         ) : categoryProducts.length > 0 ? (
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
//               gap: "24px",
//             }}
//           >
//             {categoryProducts.map((product) => {
//               const priceInfo = getDisplayPrices(product)
//               return (
//                 <div
//                   key={product._id}
//                   style={{
//                     backgroundColor: "#fff",
//                     borderRadius: "12px",
//                     padding: "16px",
//                     boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
//                     transition: "all 0.3s ease",
//                     cursor: "pointer",
//                     position: "relative",
//                   }}
//                   onMouseOver={(e) => {
//                     e.currentTarget.style.transform = "translateY(-4px)"
//                     e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.1)"
//                   }}
//                   onMouseOut={(e) => {
//                     e.currentTarget.style.transform = "none"
//                     e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.05)"
//                   }}
//                   onClick={() => navigate(`/product/${product._id}`)}
//                 >
//                   <div style={{ position: "relative" }}>
//                     <img
//                       src={getProductImage(product) || "/placeholder.svg"}
//                       alt={product.name}
//                       style={{
//                         width: "100%",
//                         height: "200px",
//                         objectFit: "cover",
//                         borderRadius: "8px",
//                         marginBottom: "12px",
//                       }}
//                       onError={(e) => {
//                         e.target.src = "/placeholder-image.jpg"
//                       }}
//                     />
//                     {/* Discount Badge */}
//                     {priceInfo.hasDiscount && (
//                       <div 
//                         style={{
//                           position: "absolute",
//                           top: "8px",
//                           left: "8px",
//                           backgroundColor: priceInfo.isSpecialOffer ? "#16a34a" : "#dc2626",
//                           color: "white",
//                           padding: "4px 8px",
//                           borderRadius: "12px",
//                           fontSize: "12px",
//                           fontWeight: "bold",
//                           zIndex: 5
//                         }}
//                       >
//                         {priceInfo.isSpecialOffer ? "Special Offer" : `${priceInfo.discountPercent}% OFF`}
//                       </div>
//                     )}
//                     <div
//                       style={{
//                         position: "absolute",
//                         top: "8px",
//                         right: "8px",
//                         zIndex: 10,
//                       }}
//                       onClick={(e) => e.stopPropagation()}
//                     >
//                       <FavoriteButton productId={product._id} />
//                     </div>
//                   </div>

//                   <div>
//                     <h3
//                       style={{
//                         fontSize: "16px",
//                         fontWeight: "600",
//                         margin: "0 0 8px 0",
//                         color: "#374151",
//                         lineHeight: "1.4",
//                       }}
//                     >
//                       {product.name}
//                     </h3>
//                     <p
//                       style={{
//                         fontSize: "18px",
//                         fontWeight: "700",
//                         color: "#dc2626",
//                         margin: "0",
//                       }}
//                     >
//                       ₹{priceInfo.currentPrice}
//                     </p>
//                     {priceInfo.hasDiscount && priceInfo.oldPrice && (
//                       <p
//                         style={{
//                           fontSize: "14px",
//                           color: "#6b7280",
//                           textDecoration: "line-through",
//                           margin: "4px 0 0 0",
//                         }}
//                       >
//                         ₹{priceInfo.oldPrice}
//                       </p>
//                     )}
//                     {priceInfo.hasDiscount && (
//                       <p
//                         style={{
//                           fontSize: "12px",
//                           color: "#16a34a",
//                           fontWeight: "600",
//                           margin: "4px 0 0 0",
//                         }}
//                       >
//                         You save ₹{priceInfo.oldPrice - priceInfo.currentPrice}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               )
//             })}
//           </div>
//         ) : (
//           <div
//             style={{
//               textAlign: "center",
//               padding: "60px 20px",
//               backgroundColor: "#fff",
//               borderRadius: "12px",
//               boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
//             }}
//           >
//             <p
//               style={{
//                 color: "#6b7280",
//                 fontSize: "18px",
//                 marginBottom: "16px",
//               }}
//             >
//               No products found in {selectedCategory} category.
//             </p>
//             <p
//               style={{
//                 color: "#9ca3af",
//                 fontSize: "14px",
//               }}
//             >
//               Try browsing other categories or check back later for new arrivals.
//             </p>
//           </div>
//         )}
//       </div>

//       <style jsx>{`
//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }
//       `}</style>
//     </div>
//   )
// }

// export default CategoryProducts




"use client"

import { useNavigate } from "react-router-dom"
import { useCategoryContext } from "../context/CategoryContext"
import FavoriteButton from "./FavoriteButton"

const CategoryProducts = () => {
  const { selectedCategory, categoryProducts, loading } = useCategoryContext()
  const navigate = useNavigate()

  // Function to get the first valid image URL from a product
  const getProductImage = (product) => {
    const { images } = product
    if (!images || images.length === 0) return "/placeholder-image.jpg"

    // Case 1: If it's already a plain string URL
    if (typeof images[0] === "string") {
      try {
        // Try parsing it (in case it's a JSON stringified object)
        const parsed = JSON.parse(images[0])
        const firstKey = Object.keys(parsed)[0] // e.g. "Pink"
        return parsed[firstKey][0] // first image inside that color
      } catch {
        return images[0] // not JSON, just a URL string
      }
    }

    // Case 2: If it's an object with .url
    if (images[0]?.url) {
      return images[0].url
    }

    return "/placeholder-image.jpg"
  }

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

  if (!selectedCategory) return null

  return (
    <div
      style={{
        backgroundColor: "#f9fafb",
        padding: "40px 20px",
        minHeight: "60vh",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h2
          style={{
            fontSize: "28px",
            fontWeight: "600",
            marginBottom: "8px",
            color: "#374151",
            textAlign: "center",
          }}
        >
          {selectedCategory}
        </h2>
        <p
          style={{
            fontSize: "16px",
            color: "#6b7280",
            marginBottom: "32px",
            textAlign: "center",
          }}
        >
          {categoryProducts.length} products found
        </p>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div
              style={{
                display: "inline-block",
                width: "40px",
                height: "40px",
                border: "4px solid #f3f3f3",
                borderTop: "4px solid #d97706",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            ></div>
            <p style={{ marginTop: "20px", color: "#6b7280", fontSize: "18px" }}>Loading products...</p>
          </div>
        ) : categoryProducts.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "24px",
            }}
          >
            {categoryProducts.map((product) => {
              const priceInfo = getDisplayPrices(product)
              return (
                <div
                  key={product._id}
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: "12px",
                    padding: "16px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    position: "relative",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)"
                    e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.1)"
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "none"
                    e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.05)"
                  }}
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  <div style={{ position: "relative" }}>
                    <img
                      src={getProductImage(product) || "/placeholder.svg"}
                      alt={product.name}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        marginBottom: "12px",
                      }}
                      onError={(e) => {
                        e.target.src = "/placeholder-image.jpg"
                      }}
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
                    <div
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        zIndex: 10,
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FavoriteButton productId={product._id} />
                    </div>
                  </div>

                  <div>
                    <h3
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        margin: "0 0 8px 0",
                        color: "#374151",
                        lineHeight: "1.4",
                      }}
                    >
                      {product.name}
                    </h3>
                    <p
                      style={{
                        fontSize: "18px",
                        fontWeight: "700",
                        color: "#dc2626",
                        margin: "0",
                      }}
                    >
                      ₹{priceInfo.currentPrice}
                    </p>
                    {priceInfo.hasDiscount && priceInfo.oldPrice && (
                      <p
                        style={{
                          fontSize: "14px",
                          color: "#6b7280",
                          textDecoration: "line-through",
                          margin: "4px 0 0 0",
                        }}
                      >
                        ₹{priceInfo.oldPrice}
                      </p>
                    )}
                    {priceInfo.hasDiscount && (
                      <p
                        style={{
                          fontSize: "12px",
                          color: "#16a34a",
                          fontWeight: "600",
                          margin: "4px 0 0 0",
                        }}
                      >
                        You save ₹{priceInfo.oldPrice - priceInfo.currentPrice}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              backgroundColor: "#fff",
              borderRadius: "12px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
            }}
          >
            <p
              style={{
                color: "#6b7280",
                fontSize: "18px",
                marginBottom: "16px",
              }}
            >
              No products found in {selectedCategory} category.
            </p>
            <p
              style={{
                color: "#9ca3af",
                fontSize: "14px",
              }}
            >
              Try browsing other categories or check back later for new arrivals.
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default CategoryProducts