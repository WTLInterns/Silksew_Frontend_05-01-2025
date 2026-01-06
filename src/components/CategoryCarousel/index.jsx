import React from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './CategoryCarousel.css';

const CategoryCarousel = () => {
  const categories = [
    { id: 1, name: 'Sarees', image: '/images/categories/saree.jpg', slug: 'sarees' },
    { id: 2, name: 'Kurtis', image: '/images/categories/kurti.jpg', slug: 'kurtis' },
    { id: 3, name: 'Lehengas', image: '/images/categories/lehenga.jpg', slug: 'lehengas' },
    { id: 4, name: 'Dresses', image: '/images/categories/dress.jpg', slug: 'dresses' },
    { id: 5, name: 'Tops', image: '/images/categories/top.jpg', slug: 'tops' },
  ];

  const scrollLeft = () => {
    document.getElementById('categoryContainer').scrollBy({
      left: -200,
      behavior: 'smooth'
    });
  };

  const scrollRight = () => {
    document.getElementById('categoryContainer').scrollBy({
      left: 200,
      behavior: 'smooth'
    });
  };

  return (
    <section className="category-carousel">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Shop by Category</h2>
          <div className="carousel-controls">
            <button onClick={scrollLeft} className="carousel-control" aria-label="Previous">
              <FiChevronLeft />
            </button>
            <button onClick={scrollRight} className="carousel-control" aria-label="Next">
              <FiChevronRight />
            </button>
          </div>
        </div>
        
        <div className="categories-container" id="categoryContainer">
          {categories.map(category => (
            <Link to={`/category/${category.slug}`} key={category.id} className="category-card">
              <div className="category-image">
                <img src={category.image} alt={category.name} />
              </div>
              <h3 className="category-name">{category.name}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryCarousel;
