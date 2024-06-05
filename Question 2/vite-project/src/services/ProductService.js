import axios from 'axios';

const productService = {
  getAllProducts: async (category, top = 10, minPrice = 1, maxPrice = 100000, page = 1) => {
    try {
      const response = await axios.get(`http://localhost:3000/categories/${category}/products`, {
        params: {
          top,
          minPrice,
          maxPrice,
          page
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default productService;
