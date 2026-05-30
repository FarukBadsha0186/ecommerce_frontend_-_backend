import React from 'react';
import { Link } from 'react-router-dom';

const CategorySection = () => {
  const categories = [
    { id: 1, name: 'Electronics', icon: '📱', color: 'bg-blue-100', count: 120 },
    { id: 2, name: 'Fashion', icon: '👕', color: 'bg-pink-100', count: 85 },
    { id: 3, name: 'Home & Living', icon: '🏠', color: 'bg-green-100', count: 64 },
    { id: 4, name: 'Sports', icon: '⚽', color: 'bg-orange-100', count: 42 },
    { id: 5, name: 'Books', icon: '📚', color: 'bg-purple-100', count: 98 },
    { id: 6, name: 'Beauty', icon: '💄', color: 'bg-red-100', count: 56 },
  ];

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/shop?category=${category.name}`}
              className="group"
            >
              <div className={`${category.color} rounded-lg p-6 text-center transition transform hover:scale-105`}>
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-semibold text-gray-800">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.count} products</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySection;