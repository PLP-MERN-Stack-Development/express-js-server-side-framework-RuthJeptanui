 const {BaseError} = require('../errors/error');


 const ErrorHandler = (err, req, res, next)=>{
    console.error(err.stack);
    //for the custome errors
    if(err instanceof BaseError){
        return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
    }

    //other kind of errors
     res.status(500).json({
        status: 'error',
        message: 'something is definitely wrong with the server',
        
     })
 }

 module.exports = ErrorHandler;