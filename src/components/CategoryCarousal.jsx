"use client"
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import axios from "axios"

// Function to get the first valid image URL from a product (exact same as navbar)
const getProductImage = (product) => {
  const { images } = product;
  if (!images || images.length === 0) return "/placeholder-image.jpg";

  // Case 1: If it's already a plain string URL
  if (typeof images[0] === "string") {
    try {
      // Try parsing it (in case it's a JSON stringified object)
      const parsed = JSON.parse(images[0]);
      const firstKey = Object.keys(parsed)[0]; // e.g. "Pink"
      return parsed[firstKey][0]; // first image inside that color
    } catch {
      return images[0]; // not JSON, just a URL string
    }
  }

  // Case 2: If it's an object with .url
  if (images[0]?.url) {
    return images[0].url;
  }

  return "/placeholder-image.jpg";
};

// Product Card Component
const ProductCard = ({ product }) => {
  const navigate = useNavigate()
  
  console.log('Product data:', product) // Debug: Log product data
  console.log('Product images array:', product.images) // Debug: Log images array
  
  const imageUrl = getProductImage(product);
  console.log('Final image URL:', imageUrl) // Debug: Log final URL
  
  const handleProductClick = () => {
    console.log('Navigating to product:', product._id)
    navigate(`/product/${product._id}`)
  }
  
  // Get subcategory display
  const getSubcategoryDisplay = (product) => {
    if (product.subcategory) {
      if (Array.isArray(product.subcategory)) {
        return product.subcategory[0]; // Show first subcategory if array
      }
      return product.subcategory; // Show subcategory if string
    }
    return null;
  }
  
  const subcategoryDisplay = getSubcategoryDisplay(product);
  
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer" onClick={handleProductClick}>
      <div className="relative h-[400px] bg-gray-100">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          onLoad={() => console.log('Image loaded successfully:', imageUrl)}
          onError={(e) => {
            console.log('Image failed to load:', imageUrl)
            console.log('Error object:', e)
            // Try multiple fallback options
            if (!e.currentTarget.src.includes('placeholder')) {
              e.currentTarget.src = "/placeholder-image.jpg"
            }
          }}
        />
        {product.discount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {product.discount}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-800 mb-1 line-clamp-2">{product.name}</h3>
        {subcategoryDisplay && (
          <p className="text-xs text-purple-600 font-medium mb-2 uppercase tracking-wide">
            {subcategoryDisplay}
          </p>
        )}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through ml-2">₹{product.originalPrice}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Category Banner Component
const CategoryBanner = ({ category, onCategoryClick }) => {
  return (
    <div 
      className="relative h-48 rounded-xl overflow-hidden cursor-pointer group transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
      onClick={() => onCategoryClick(category)}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400"></div>
      
      {/* Glassy overlay */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm border border-white/20"></div>
      
      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform rotate-45 translate-x-full"></div>
      </div>
      
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center z-10 px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 uppercase tracking-wider drop-shadow-lg">
            {category.name}
          </h2>
          <div className="flex items-center justify-center gap-2">
            <span className="text-white/90 text-sm font-medium">Explore Collection</span>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
          <p className="text-white/80 text-xs mt-2">
            {category.products?.length || 0} Products Available
          </p>
        </div>
      </div>
      
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Decorative corner */}
      <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-white/30 transform rotate-45"></div>
    </div>
  )
}

// Products Carousel Component
const ProductsCarousel = ({ products, categoryName }) => {
  const breakpoints = {
    1400: {
      slidesPerView: 4,
      spaceBetween: 20,
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 15,
    },
    0: {
      slidesPerView: 1,
      spaceBetween: 10,
    },
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No products available in {categoryName}</p>
      </div>
    )
  }

  return (
    <div className="relative px-8">
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={1}
        navigation={{
          nextEl: `.swiper-next-${categoryName.replace(/\s+/g, '-')}`,
          prevEl: `.swiper-prev-${categoryName.replace(/\s+/g, '-')}`,
        }}
        pagination={{
          clickable: true,
          el: `.swiper-pagination-${categoryName.replace(/\s+/g, '-')}`,
          bulletClass: 'swiper-pagination-bullet',
          bulletActiveClass: 'swiper-pagination-bullet-active',
        }}
        breakpoints={breakpoints}
        className="category-swiper !pb-12"
        style={{
          padding: '0 20px',
        }}
      >
        {products.map((product, index) => (
          <SwiperSlide key={index}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Custom Navigation Buttons */}
      <button 
        className={`swiper-prev-${categoryName.replace(/\s+/g, '-')} absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-all duration-200 flex items-center justify-center border border-gray-200`}
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} className="text-gray-700" />
      </button>
      <button 
        className={`swiper-next-${categoryName.replace(/\s+/g, '-')} absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-all duration-200 flex items-center justify-center border border-gray-200`}
        aria-label="Next slide"
      >
        <ChevronRight size={20} className="text-gray-700" />
      </button>
      
      {/* Custom Pagination */}
      <div className={`swiper-pagination-${categoryName.replace(/\s+/g, '-')} !relative !mt-6 !flex !justify-center !gap-2`}></div>
      
      {/* Custom styles for pagination dots */}
      <style jsx>{`
        .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: #d1d5db;
          opacity: 1;
          transition: all 0.3s ease;
        }
        .swiper-pagination-bullet-active {
          background: #9333ea;
          transform: scale(1.2);
        }
      `}</style>
    </div>
  )
}

const CategoriesPage = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(null)

  // Fetch categories dynamically from backend using product routes
  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      try {
        setLoading(true)
        
        // Fetch categories from backend - using same endpoint as navbar
        const categoriesResponse = await axios.get('https://api.silksew.com/api/products/categories-subcategories')
        console.log('Categories response:', categoriesResponse.data)
        
        if (categoriesResponse.data.success && categoriesResponse.data.categories) {
          // Build navigation menu like navbar does
          const navigationMenu = {}
          
          // Process categories
          if (Array.isArray(categoriesResponse.data.categories)) {
            categoriesResponse.data.categories.forEach(category => {
              if (category) {
                const cat = String(category).trim()
                if (cat && !navigationMenu[cat]) {
                  navigationMenu[cat] = []
                }
              }
            })
          }

          // Process subcategories
          if (Array.isArray(categoriesResponse.data.subcategories)) {
            categoriesResponse.data.subcategories.forEach(item => {
              if (item && item.category && item.subcategory) {
                const category = String(item.category).trim()
                const subcategory = String(item.subcategory).trim()
                if (category && subcategory && navigationMenu[category]) {
                  if (!navigationMenu[category].includes(subcategory)) {
                    navigationMenu[category].push(subcategory)
                  }
                }
              }
            })
          }

          console.log('Navigation menu:', navigationMenu)

          // Fetch products for each category using exact same logic as navbar
          const categoriesWithProducts = await Promise.all(
            Object.keys(navigationMenu).map(async (categoryName) => {
              try {
                console.log(`Processing category: ${categoryName}`)
                
                // Get all subcategories for this category (exact same as navbar)
                const subcategories = navigationMenu[categoryName] || []
                
                console.log(`Subcategories for ${categoryName}:`, subcategories)
                
                let products = []
                
                if (subcategories.length > 0) {
                  try {
                    // Use exact same API call as navbar
                    const subcategoriesParam = subcategories.map(sub => encodeURIComponent(sub)).join(',')
                    const url = `https://api.silksew.com/api/products/by-multiple-subcategories?subcategories=${subcategoriesParam}&category=${encodeURIComponent(categoryName)}`
                    console.log(`Fetching products from: ${url}`)
                    
                    const response = await fetch(url)
                    
                    if (response.ok) {
                      const data = await response.json()
                      if (data.success) {
                        console.log(`Found ${data.products?.length || 0} products for category ${categoryName}`)
                        products = data.products || []
                      } else {
                        console.error("API returned error:", data.message)
                        // Fallback to client-side filtering (same as navbar)
                        const allProductsResponse = await axios.get('https://api.silksew.com/api/products')
                        if (allProductsResponse.data.success && allProductsResponse.data.products) {
                          products = allProductsResponse.data.products.filter(product =>
                            product.category === categoryName ||
                            (product.subcategory && Array.isArray(product.subcategory) &&
                             product.subcategory.some(sub => subcategories.includes(sub)))
                          )
                        }
                      }
                    } else {
                      console.error("Failed to fetch products from API")
                      // Fallback to client-side filtering (same as navbar)
                      const allProductsResponse = await axios.get('https://api.silksew.com/api/products')
                      if (allProductsResponse.data.success && allProductsResponse.data.products) {
                        products = allProductsResponse.data.products.filter(product =>
                          product.category === categoryName ||
                          (product.subcategory && Array.isArray(product.subcategory) &&
                           product.subcategory.some(sub => subcategories.includes(sub)))
                        )
                      }
                    }
                  } catch (apiErr) {
                    console.error("Error fetching category products:", apiErr)
                    // Fallback to client-side filtering (same as navbar)
                    try {
                      const allProductsResponse = await axios.get('https://api.silksew.com/api/products')
                      if (allProductsResponse.data.success && allProductsResponse.data.products) {
                        products = allProductsResponse.data.products.filter(product =>
                          product.category === categoryName ||
                          (product.subcategory && Array.isArray(product.subcategory) &&
                           product.subcategory.some(sub => subcategories.includes(sub)))
                        )
                      }
                    } catch (fallbackErr) {
                      console.warn("Fallback also failed:", fallbackErr.message)
                    }
                  }
                }

                console.log(`Final products for ${categoryName}:`, products.length)

                return {
                  name: categoryName,
                  apiCategory: categoryName,
                  products: products
                }
              } catch (err) {
                console.warn(`Error processing ${categoryName}:`, err.message)
                return {
                  name: categoryName,
                  apiCategory: categoryName,
                  products: []
                }
              }
            })
          )

          console.log('Final categories with products:', categoriesWithProducts)
          setCategories(categoriesWithProducts)
        } else {
          console.log('No categories found in response')
          setCategories([])
        }
      } catch (err) {
        console.error("Error fetching categories:", err)
        // Fallback: Show empty state
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    fetchCategoriesAndProducts()
  }, [])

  // Handle category click
  const handleCategoryClick = (category) => {
    setSelectedCategory(category)
    // Scroll to products section
    const element = document.getElementById(`products-${category.apiCategory}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading categories...</p>
        </div>
      </div>
    )
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">No categories available at the moment.</p>
          <p className="text-gray-400 text-sm mt-2">Please check back later or contact admin.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent mb-6">
            Shop by Category
          </h1>
          <p className="text-gray-600 text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
            Discover our curated collection of premium fashion categories, each crafted with elegance and style
          </p>
          <div className="w-32 h-1.5 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mt-6 rounded-full shadow-lg"></div>
        </div>
      </div>

      {/* Categories Banners */}
      {/* <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <CategoryBanner
              key={index}
              category={category}
              onCategoryClick={handleCategoryClick}
            />
          ))}
        </div>
      </div> */}

      {/* Products Sections */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        {categories.map((category, index) => (
          <div key={index} id={`products-${category.apiCategory}`} className="mb-20">
            <div className="mb-8 text-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                {category.name} Collection
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-4">
                Explore our exclusive {category.name.toLowerCase()} products
              </p>
              <div className="w-24 h-1.5 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto rounded-full shadow-lg"></div>
            </div>
            
            <ProductsCarousel 
              products={category.products} 
              categoryName={category.name}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategoriesPage