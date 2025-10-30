// server.js - Starter Express server for Week 2 assignment

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
const productRoutes = require('./routes/product.routes');
const errors = require ('./middleware/errors.middleware');
const {NotFoundError} = require('./errors/error');
const ErrorHandler = require('./middleware/errors.middleware');
const logger = require('./middleware/logger.middleware')

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;



// Middleware setup
app.use(bodyParser.json());

// Sample in-memory products database
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  }
];

//we are exporting this for routes 
module.exports.products = products;

//logger middleware
app.use(logger)

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Product API! Go to /api/products to see all products.');
});

//mounting product routes
app.use('/api/products', productRoutes);

//error handling
app.use((req, res, next)=>{
  next(new NotFoundError('api endpoint'));
});

app.use(ErrorHandler)


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app; 