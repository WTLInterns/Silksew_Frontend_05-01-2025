// import { useState, useEffect } from "react"
// import { useNavigate } from 'react-router-dom';
// import "./Mens.css"
// import axios from "axios"
// import { toast } from 'react-toastify'
// import FavoriteButton from "../components/common/FavoriteButton"
// import SubcategorySideBar from "./SubcategorySideBar"

// const Mens = () => {
//   const [products, setProducts] = useState([])
//   const [filteredProducts, setFilteredProducts] = useState([])
//   const [subcategories, setSubcategories] = useState([
//     "Traditional Wear",
//     "Casual Wear",
//     "Formal Wear",
//     "Ethnic Wear",
//     "Street Style",
//     "Smart Casuals",
//     "Athleisure",
//     "Summer Wear",
//     "Winter Wear",
//     "Party Wear",
//     "Wedding Wear",
//     "Indo-Western",
//     "Loungewear",
//     "Vacation Wear",
//     "Festive Wear",
//   ])

//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState("")
//   const [selectedSubcategory, setSelectedSubcategory] = useState("All Products")
//   const navigate = useNavigate()

//   // Pagination states
//   const [currentPage, setCurrentPage] = useState(1)
//   const productsPerPage = 8

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await axios.get("http://localhost:5003/api/products")
//         const fetchedProducts = Array.isArray(response.data) ? response.data : response.data.products

//         const menProducts = fetchedProducts.filter((product) => product.category.includes("men"))
//         setProducts(menProducts)
//         setFilteredProducts(menProducts)
//       } catch (error) {
//         console.error("Error fetching products:", error)
//         setError("Failed to load products")
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchProducts()
//   }, [])

//   useEffect(() => {
//     if (selectedSubcategory === "All Products") {
//       setFilteredProducts(products)
//     } else {
//       const filtered = products.filter((product) => {
//         const productSubcategories = Array.isArray(product.subcategory)
//           ? product.subcategory.map((sub) => sub.toLowerCase())
//           : []
//         return productSubcategories.includes(selectedSubcategory.toLowerCase())
//       })
//       setFilteredProducts(filtered)
//     }
//     setCurrentPage(1) // Reset to first page when changing subcategory
//   }, [selectedSubcategory, products])

//   const handleSubcategoryClick = (subcategory) => {
//     setSelectedSubcategory(subcategory)
//   }

//   const shortenName = (name) => (name.length > 25 ? name.substring(0, 25) + "..." : name)

//   const handleViewProduct = (product) => {
//     navigate(`/product/${product._id}`, { state: { product } })
//   }


//   const getImage = (images, availableColors) => {
//     if (images && images.length > 0 && availableColors && availableColors.length > 0) {
//       try {
//         for (const color of availableColors) {
//           const parsedImages = JSON.parse(images[0])
//           if (parsedImages[color.name] && parsedImages[color.name].length > 0) {
//             return parsedImages[color.name][0]
//           }
//         }
//         const parsedImages = JSON.parse(images[0])
//         const firstAvailableColor = Object.keys(parsedImages)[0]
//         if (parsedImages[firstAvailableColor] && parsedImages[firstAvailableColor].length > 0) {
//           return parsedImages[firstAvailableColor][0]
//         }
//       } catch (error) {
//         console.error("Error parsing image JSON:", error)
//       }
//     }
//     return "https://via.placeholder.com/150"
//   }

//   // Pagination logic
//   const indexOfLastProduct = currentPage * productsPerPage
//   const indexOfFirstProduct = indexOfLastProduct - productsPerPage
//   const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
//   const totalPages = Math.ceil(filteredProducts.length / productsPerPage)

//   const paginate = (pageNumber) => setCurrentPage(pageNumber)

//   if (loading) return <div className="loading">Loading...</div>
//   if (error) return <div className="error">{error}</div>

//   return (
//     <div className="container">
//       <div className="subcategories-wrapper">
//         <SubcategorySideBar
//           subcategories={subcategories}
//           selectedSubcategory={selectedSubcategory}
//           onSubcategoryClick={handleSubcategoryClick}
//         />
//       </div>

//       <div className="content">
//         <h1 className="section-title">
//           {selectedSubcategory === "All Products" ? "All Men's Products" : selectedSubcategory}
//         </h1>
//         <hr className="divider" />

//         <div className="product-grid">
//           {currentProducts.length > 0 ? (
//             currentProducts.map((item) => (
//               <div key={item._id} className="product-card">
//                 <div className="image-container" style={{ position: 'relative' }}>
//                   <img
//                     src={getImage(item.images, item.availableColors) || "/placeholder.svg"}
//                     alt={item.name}
//                     className="product-image"
//                   />
//                   {/* Favorite heart icon */}
//                   <div 
//                     className="absolute top-3 right-3 z-10"
//                     onClick={(e) => e.stopPropagation()}
//                   >
//                     <FavoriteButton productId={item._id} size="sm" />
//                   </div>
//                 </div>
//                 <div className="product-details">
//                   <h4 className="product-name">{shortenName(item.name)}</h4>
//                   <div className="price-container">
//                     <span className="new-price">Rs.{item.price.toFixed(2)}</span>
//                     {item.oldPrice && <span className="old-price">Rs.{item.oldPrice.toFixed(2)}</span>}
//                   </div>
//                   <button onClick={() => handleViewProduct(item)} className="view-product-btn">
//                     VIEW PRODUCT
//                   </button>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="no-products">No products available for this subcategory.</div>
//           )}
//         </div>

//         {filteredProducts.length > productsPerPage && (
//           <div className="pagination">
//             {Array.from({ length: totalPages }, (_, i) => (
//               <button
//                 key={i + 1}
//                 onClick={() => paginate(i + 1)}
//                 className={`pagination-button ${currentPage === i + 1 ? "active" : ""}`}
//               >
//                 {i + 1}
//               </button>
//             ))}
//           </div>
//         )}
//       </div>

//       <style jsx>{`
//         .container {
//           max-width: 1400px;
//           margin: 0 auto;
//           padding: 2rem;
//         }

//         .subcategories-wrapper {
//           margin-bottom: 2rem;
//           background-color: #f3f4f6;
//           border-radius: 0.5rem;
//           box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
//         }

//         .section-title {
//           font-size: 1.875rem;
//           font-weight: 700;
//           margin-bottom: 1rem;
//           color: #1f2937;
//         }

//         .divider {
//           border: none;
//           height: 2px;
//           background-color: #e5e7eb;
//           margin: 1rem 0 2rem 0;
//         }

//         .product-grid {
//           display: grid;
//           grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
//           gap: 2rem;
//         }

//         .product-card {
//           border: 1px solid #e5e7eb;
//           border-radius: 0.75rem;
//           overflow: hidden;
//           transition: all 0.3s ease;
//           background-color: #ffffff;
//           box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
//         }

//         .product-card:hover {
//           transform: translateY(-5px);
//           box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
//         }

//         .image-container {
//           position: relative;
//           height: 250px;
//           overflow: hidden;
//         }

//         .product-image {
//           width: 100%;
//           height: 100%;
//           object-fit: cover;
//           transition: transform 0.3s ease;
//         }

//         .product-card:hover .product-image {
//           transform: scale(1.05);
//         }

//         .product-details {
//           padding: 1rem;
//         }

//         .product-name {
//           font-size: 1rem;
//           font-weight: 600;
//           margin-bottom: 0.5rem;
//           color: #1f2937;
//           line-height: 1.4;
//         }

//         .price-container {
//           display: flex;
//           gap: 0.5rem;
//           align-items: center;
//           margin-bottom: 1rem;
//         }

//         .new-price {
//           font-size: 1.125rem;
//           font-weight: 700;
//           color: #059669;
//         }

//         .old-price {
//           font-size: 0.875rem;
//           color: #6b7280;
//           text-decoration: line-through;
//         }

//         .view-product-btn {
//           width: 100%;
//           padding: 0.75rem;
//           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//           color: white;
//           border: none;
//           border-radius: 0.5rem;
//           font-weight: 600;
//           cursor: pointer;
//           transition: all 0.3s ease;
//         }

//         .view-product-btn:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
//         }

//         .no-products {
//           grid-column: 1 / -1;
//           text-align: center;
//           padding: 2rem;
//           color: #6b7280;
//           font-size: 1.125rem;
//         }

//         .pagination {
//           display: flex;
//           justify-content: center;
//           gap: 0.5rem;
//           margin-top: 2rem;
//         }

//         .pagination-button {
//           padding: 0.5rem 1rem;
//           border: 1px solid #d1d5db;
//           background-color: white;
//           color: #374151;
//           border-radius: 0.375rem;
//           cursor: pointer;
//           transition: all 0.2s ease;
//         }

//         .pagination-button:hover {
//           background-color: #f3f4f6;
//         }

//         .pagination-button.active {
//           background-color: #667eea;
//           color: white;
//           border-color: #667eea;
//         }

//         @media (max-width: 768px) {
//           .container {
//             padding: 1rem;
//           }

//           .product-grid {
//             grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
//             gap: 1rem;
//           }

//           .section-title {
//             font-size: 1.5rem;
//           }
//         }
//       `}</style>
//     </div>
//   )
// }

// export default Mens



"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "./Mens.css"
import axios from "axios"
import FavoriteButton from "../components/common/FavoriteButton"

const Mens = () => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedSubcategory, setSelectedSubcategory] = useState("All Products")
  const navigate = useNavigate()

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 8

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5003/api/products")
        const fetchedProducts = Array.isArray(response.data) ? response.data : response.data.products

        const menProducts = fetchedProducts.filter((product) => product.category.includes("men"))
        setProducts(menProducts)
        setFilteredProducts(menProducts)
      } catch (error) {
        console.error("Error fetching products:", error)
        setError("Failed to load products")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    if (selectedSubcategory === "All Products") {
      setFilteredProducts(products)
    } else {
      const filtered = products.filter((product) => {
        const productSubcategories = Array.isArray(product.subcategory)
          ? product.subcategory.map((sub) => sub.toLowerCase())
          : []
        return productSubcategories.includes(selectedSubcategory.toLowerCase())
      })
      setFilteredProducts(filtered)
    }
    setCurrentPage(1) // Reset to first page when changing subcategory
  }, [selectedSubcategory, products])

  const handleSubcategoryClick = (subcategory) => {
    setSelectedSubcategory(subcategory)
  }

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

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  if (loading) return <div className="loading">Loading...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <div className="container">
      <div className="content">
        <h1 className="section-title">
          {selectedSubcategory === "All Products" ? "All Men's Products" : selectedSubcategory}
        </h1>
        <hr className="divider" />

        <div className="product-grid">
          {currentProducts.length > 0 ? (
            currentProducts.map((item) => (
              <div key={item._id} className="product-card">
                <div className="image-container" style={{ position: "relative" }}>
                  <img
                    src={getImage(item.images, item.availableColors) || "/placeholder.svg"}
                    alt={item.name}
                    className="product-image"
                  />
                  {/* Favorite heart icon */}
                  <div className="absolute top-3 right-3 z-10" onClick={(e) => e.stopPropagation()}>
                    <FavoriteButton productId={item._id} size="sm" />
                  </div>
                </div>
                <div className="product-details">
                  <h4 className="product-name">{shortenName(item.name)}</h4>
                  <div className="price-container">
                    <span className="new-price">Rs.{item.price.toFixed(2)}</span>
                    {item.oldPrice && <span className="old-price">Rs.{item.oldPrice.toFixed(2)}</span>}
                  </div>
                  <button onClick={() => handleViewProduct(item)} className="view-product-btn">
                    VIEW PRODUCT
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-products">No products available for this subcategory.</div>
          )}
        </div>

        {filteredProducts.length > productsPerPage && (
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={`pagination-button ${currentPage === i + 1 ? "active" : ""}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
        }

        .section-title {
          font-size: 1.875rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #1f2937;
        }

        .divider {
          border: none;
          height: 2px;
          background-color: #e5e7eb;
          margin: 1rem 0 2rem 0;
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 2rem;
        }

        .product-card {
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          overflow: hidden;
          transition: all 0.3s ease;
          background-color: #ffffff;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
        }

        .image-container {
          position: relative;
          height: 280px; /* Increased card height from 250px to 280px for better product display */
          overflow: hidden;
        }

        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .product-card:hover .product-image {
          transform: scale(1.05);
        }

        .product-details {
          padding: 1rem;
        }

        .product-name {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #1f2937;
          line-height: 1.4;
        }

        .price-container {
          display: flex;
          gap: 0.5rem;
          align-items: center;
          margin-bottom: 1rem;
        }

        .new-price {
          font-size: 1.125rem;
          font-weight: 700;
          color: #059669;
        }

        .old-price {
          font-size: 0.875rem;
          color: #6b7280;
          text-decoration: line-through;
        }

        .view-product-btn {
          width: 100%;
          padding: 0.75rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .view-product-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .no-products {
          grid-column: 1 / -1;
          text-align: center;
          padding: 2rem;
          color: #6b7280;
          font-size: 1.125rem;
        }

        .pagination {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 2rem;
        }

        .pagination-button {
          padding: 0.5rem 1rem;
          border: 1px solid #d1d5db;
          background-color: white;
          color: #374151;
          border-radius: 0.375rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .pagination-button:hover {
          background-color: #f3f4f6;
        }

        .pagination-button.active {
          background-color: #667eea;
          color: white;
          border-color: #667eea;
        }

        @media (max-width: 768px) {
          .container {
            padding: 1rem;
          }

          .product-grid {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 1rem;
          }

          .section-title {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  )
}

export default Mens

