import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { useCategoryContext } from '../context/CategoryContext';
import Hero from '../components/Hero/Hero';
import CategoryCarousel from '../components/CategoryCarousal';
import Newsletter from '../components/NewsLetter/NewsLetter';
import MenBanner from '../components/MenBanner';
import WomenBanner from './WomenBanner';
import { Heart } from 'lucide-react';

const Shop = () => {
  const [searchParams] = useSearchParams();
  const { all_products } = useContext(ShopContext);
  const { 
    selectedCategory, 
    setSelectedCategory, 
    categoryProducts, 
    setCategoryProducts,
    setLoading,
    loading
  } = useCategoryContext();
  
  const category = searchParams.get('category');
  const subcategory = searchParams.get('subcategory');

  useEffect(() => {
    if (!Array.isArray(all_products)) {
      console.error('all_products is not an array:', all_products);
      setLoading(false);
      return;
    }
    
    console.log('Filtering products with:', { category, subcategory });
    let products = [...all_products];

    // Update selected category in context
    if (category) {
      setSelectedCategory(category);
    }

    // Filter by category if provided
    if (category) {
      const decodedCategory = decodeURIComponent(category).toLowerCase().trim();
      console.log('Filtering by category:', decodedCategory);
      
      products = products.filter(product => {
        if (!product.category) {
          console.log('Product has no category:', product._id);
          return false;
        }
        
        const productCategories = Array.isArray(product.category) 
          ? product.category.map(c => String(c).toLowerCase().trim())
          : [String(product.category).toLowerCase().trim()];
          
        const matches = productCategories.some(cat => cat === decodedCategory);
        if (!matches) {
          console.log('Product category does not match:', {
            productId: product._id,
            productCategories,
            expectedCategory: decodedCategory
          });
        }
        return matches;
      });
      
      console.log(`Found ${products.length} products in category '${decodedCategory}'`);
    }

    // Filter by subcategory if provided
    if (subcategory) {
      const decodedSubcategory = decodeURIComponent(subcategory).toLowerCase().trim();
      console.log('Filtering by subcategory:', decodedSubcategory);
      
      const initialCount = products.length;
      products = products.filter(product => {
        if (!product.subcategory) {
          console.log('Product has no subcategory:', product._id);
          return false;
        }
        
        const productSubcategories = Array.isArray(product.subcategory) 
          ? product.subcategory.map(s => String(s).toLowerCase().trim())
          : [String(product.subcategory).toLowerCase().trim()];
          
        const matches = productSubcategories.some(sub => sub === decodedSubcategory);
        if (!matches) {
          console.log('Product subcategory does not match:', {
            productId: product._id,
            productSubcategories,
            expectedSubcategory: decodedSubcategory
          });
        }
        return matches;
      });
      
      console.log(`Found ${products.length} products in subcategory '${decodedSubcategory}' (from ${initialCount} filtered products)`);
    }

    console.log('Final filtered products:', products);
    setCategoryProducts(products);
    setLoading(false);
  }, [all_products, category, subcategory]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Function to get the first available image from the product
  const getFirstImage = (product) => {
    try {
      if (!product.images || !product.images[0]) return 'https://via.placeholder.com/300';
      
      // Check if images[0] is already an object (parsed) or needs parsing
      const imageData = typeof product.images[0] === 'string' 
        ? JSON.parse(product.images[0])
        : product.images[0];
      
      // Get the first available color's first image
      const firstColor = Object.keys(imageData)[0];
      if (!firstColor) return 'https://via.placeholder.com/300';
      
      const firstImage = Array.isArray(imageData[firstColor]) 
        ? imageData[firstColor][0] 
        : imageData[firstColor];
        
      return firstImage || 'https://via.placeholder.com/300';
    } catch (error) {
      console.error('Error parsing product images:', error, product.images);
      return 'https://via.placeholder.com/300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />
      <CategoryCarousel />
      
      {/* Show filtered products if category or subcategory is selected */}
      {(category || subcategory) && categoryProducts.length > 0 ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {subcategory || category} Products
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categoryProducts.map((product) => (
              <Link 
                to={`/product/${product._id}`} 
                key={product._id}
                className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={getFirstImage(product)}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <button 
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      // Add to wishlist functionality here
                    }}
                  >
                    <Heart className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-1 line-clamp-2 h-12">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-lg font-bold text-gray-900">
                      ₹{product.price.toFixed(2)}
                    </span>
                    {product.oldPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ₹{product.oldPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (category || subcategory) ? (
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No products found {category ? `in ${category}` : ''} {subcategory ? `> ${subcategory}` : ''}
          </h2>
          <p className="text-gray-600 mb-6">We couldn't find any products matching your selection.</p>
          <Link 
            to="/shop" 
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            View All Products
          </Link>
        </div>
      ) : null}

      <Newsletter />
      <WomenBanner />
      <MenBanner />
    </div>
  );
};

export default Shop;