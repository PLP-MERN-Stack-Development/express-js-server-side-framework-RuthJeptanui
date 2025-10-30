
const { type } = require('os');
const { ValidationError } = require('../errors/error');

//the schema for the product validation
const productSchema ={
    name: 'string',
    description: 'string',
    price:'number',
    category: 'string',
    inStock: 'boolean',

}


const validateProduct = (req, res, next)=>{
const product = req.body
const errors = []


//now we check the required fields i.e name and price

if(!product.name || typeof product.name !== productSchema.name){
    errors.push('name is rquired and must be string')
}

if(!product.price || typeof product.price !== productSchema.price){
    errors.push('Price is required and must be a number.');
}
//optional
if (product.description && typeof product.description !== productSchema.description) {
    errors.push('Description must be a string.');
  }


  if (product.category && typeof product.category !== productSchema.category) {
    errors.push('Category must be a string.')
  }

  if (product.inStock !== undefined && typeof product.inStock !== productSchema.inStock) {
    errors.push('inStock must be a boolean.');
  }

  if(error.length>0){
    //we are passing the validation error
    return next(new ValidationError(errors.join(' ')));
  }

next();



}

module.exports = { validateProduct };