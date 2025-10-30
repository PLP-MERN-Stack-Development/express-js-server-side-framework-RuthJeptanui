const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { NotFound, ValidationError } = require('../errors/error');
const authenticationKey = require('../middleware/auth');
const { validateProduct } = require('../middleware/validation.middleware');

//initializing in-memory db
const { products } = require('../server'); 

const router = express.Router();

//lets create a helper fucntion
const findProduct =(id)=>{
    const product = products.find((p)=> p.id === id);
    if(!product){
        throw new NotFound('product')
    }
    return product;
}

//get all product with filtering, search and pagination
router.get('/', (req, res, next)=>{
try{
    let results =[...products];
    const {category, search,page =1, limit =5}= req.query;

    //filter
    if(search){
        results = results.filter((p)=>{
            p.name.toLowerCase().include(search.toLowerCase())
        })
    }

    //paginate
    const pageNum = parseInt( page, 5);
    const limitNum = parseInt(limit,5);
    const startIndex =(pageNum-1) * limitNum;
    const endIndex = pageNum * limitNum;


    const paginatedResults = results.slice(startIndex, endIndex);
    const totalPages = Math.ceil(results.length / limitNum);

    res.json({
      page: pageNum,
      limit: limitNum,
      totalPages: totalPages,
      totalResults: results.length,
      data: paginatedResults,
    });
  } catch (error) {
    next(error);
  }


})


//get statistics
router.get('/stats', (req, res, next) => {
  try {
    const stats = products.reduce((acc, product) => {
      const { category } = product;
      if (!acc[category]) {
        acc[category] = { count: 0, totalValue: 0, inStock: 0 };
      }
      acc[category].count++;
      acc[category].totalValue += product.price;
      if (product.inStock) {
        acc[category].inStock++;
      }
      return acc;
    }, {});

    const totalProducts = products.length;
    const totalValue = products.reduce((sum, p) => sum + p.price, 0);

    res.json({
      totalProducts,
      totalValue,
      countByCategory: stats,
    });
  } catch (error) {
    next(error);
  }
});


//get product by ID
router.get('/:id', (req, res, next) => {
  try {
    const product = findProduct(req.params.id);
    res.json(product);
  } catch (error) {
    next(error); //global error handler
  }
});


//new product
router.post('/', authenticationKey, validateProduct, (req, res, next) => {
  try {
    const { name, description, price, category, inStock = false } = req.body;

    const newProduct = {
      id: uuidv4(),
      name,
      description,
      price,
      category,
      inStock,
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
});

//update an existing product
router.put('/:id', authenticationKey, validateProduct, (req, res, next) => {
  try {
    const product = findProduct(req.params.id);
    const { name, description, price, category, inStock } = req.body;

    //fields
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.inStock = inStock !== undefined ? inStock : product.inStock;

    res.json(product);
  } catch (error) {
    next(error);
  }
});


//delete product
router.delete('/:id', authenticationKey, (req, res, next) => {
  try {
    const productIndex = products.findIndex((p) => p.id === req.params.id);

    if (productIndex === -1) {
      throw new NotFoundError('Product');
    }

    products.splice(productIndex, 1);
    res.status(204).send(); 
  } catch (error) {
    next(error);
  }
});

module.exports = router;