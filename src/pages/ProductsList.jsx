import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import ProductCard from '../components/ProductCard/ProductCard';
import { useNavigate } from 'react-router-dom';

const ProductsList = () => {
  const [searchParams] = useSearchParams();
  const { all_products } = React.useContext(ShopContext);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    
    let filtered = [...all_products];
    
    if (category) {
      filtered = filtered.filter(product => 
        (product.category && 
          (product.category === category || 
          (Array.isArray(product.category) && product.category.includes(category))))
      );
    }
    
    if (subcategory) {
      filtered = filtered.filter(product => 
        (product.subcategory &&
          (product.subcategory === subcategory || 
          (Array.isArray(product.subcategory) && product.subcategory.includes(subcategory))))
      );
    }
    
    setFilteredProducts(filtered);
  }, [searchParams, all_products]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">
        {searchParams.get('subcategory') 
          ? `${searchParams.get('category')} > ${searchParams.get('subcategory')}`
          : searchParams.get('category') || 'All Products'}
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div 
              key={product._id} 
              className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleProductClick(product._id)}
            >
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">${product.price}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500">No products found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsList;
