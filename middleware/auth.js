const { UnauthorizedError} = require('../errors/error');

const AuthenticationKey =(req, res, next)=>{
    const apiKey = req.headers['x-api-key']
    const expectedApiKey = process.env.API_KEY;

    if (!apiKey || apiKey !== expectedApiKey) {
    // Pass the error to the global error handler
    return next(new UnauthorizedError('Missing or invalid API key.'));
  }

  //proceed for valid api keys
  next();
};

module.exports = AuthenticationKey;
