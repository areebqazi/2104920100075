const router = require("express").Router();
const {
  API_BASE_URL,
  CATEGORIES,
  access_token,
  COMPANIES,
} = require("../utils/constants");
const axios = require("axios");

// Function to generate a unique identifier for a product
const generateProductId = (company, category, product) => {
  const cleanProductName = product.replace(/\s+/g, "").toUpperCase();
  return `${company}-${category}-${cleanProductName}`;
};

// Function to fetch the products from the main API
const fetchProducts = async (category, n, minPrice, maxPrice) => {
  let products = [];
  for (const company of COMPANIES) {
    const company = 'AMZ'
    try {
        const url = `${API_BASE_URL}/${company}/categories/${category}/products`;
      const response = await axios.get(
        url,
        {
          params: {
            top: n,
            minPrice: minPrice,
            maxPrice: maxPrice,
          },
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      const data = response.data.map((product) => ({
        ...product,
        id: generateProductId(company, category, product.productName),
        company,
      }
    ));
      products = products.concat(data);
    } catch (error) {
      console.error(`Error fetching products for company ${company}:`, error);
    }
  }
  return products;
};

router.get("/:categoryname/products", async (req, res) => {
  const { categoryname } = req.params;
  const n = req.query.top || 10;
  const minPrice = req.query.minPrice || 0;
  const maxPrice = req.query.maxPrice || 100000;
  const page = parseInt(req.query.page) || 1;

  if (!CATEGORIES.includes(categoryname)) {
    return res.status(400).send("Invalid category");
  }
  try {
    const products = await fetchProducts(categoryname, n, minPrice, maxPrice);

    console.log(products);
    if (products.length === 0) {
      return res.status(404).send("No products found");
    }
    console.log("length of data", products.length);
    let paginatedProducts = products;
    if (n > 10) {
      const startIndex = (page - 1) * 10;
      const endIndex = page * 10;
      paginatedProducts = paginatedProducts.slice(startIndex, endIndex);
    }

    res.json(paginatedProducts);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error Fetching Products");
  }
});

router.get("/:categoryname/products/:productid", async (req, res) => {
  const { categoryname, productid } = req.params;
  const n = req.query.top || 10;
  const minPrice = req.query.minPrice || 1;
  const maxPrice = req.query.maxPrice || 100000;
  try {
    if (!CATEGORIES.includes(categoryname)) {
      return res.status(400).send("Invalid category");
    }

    const products = await fetchProducts(categoryname, n, minPrice, maxPrice);

    const product = products.find((p) => p.id === productid);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error Fetching Product Details");
  }
});

module.exports = router;
