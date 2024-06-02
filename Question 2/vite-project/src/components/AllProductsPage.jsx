import React, { useState, useEffect } from "react";
import productService from "../services/ProductService";

function AllProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const CATEGORIES = [
    "Laptop",
    "Phone",
    "Computer",
    "TV",
    "Earphone",
    "Tablet",
    "Charger",
    "Mouse",
    "Keypad",
    "Bluetooth",
    "Pendrive",
    "Remote",
    "Speaker",
    "Headset",
    "PC",
  ];

  const selectedCategory = CATEGORIES[0];
  useEffect(() => {
    productService
      .getAllProducts(selectedCategory, 10, 1, 100000, 1)
      .then((products) => {
        setProducts(products);
        console.log("Fetched products:", products);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center mt-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-4">All Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border rounded-md overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-2">{product.company}</p>
              <p className="text-gray-600 mb-2">{product.category}</p>
              <p className="text-gray-700 font-bold mb-2">{product.price}</p>
              <div className="flex items-center">
                <span className="text-yellow-500">{product.rating}</span>
                <span className="ml-2">{product.discount}</span>
                <span className="ml-auto">{product.availability}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllProductsPage;
