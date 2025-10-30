
//this is base class for the custom app errors
class BaseError extends Error{
    constructor(message, statusCode){
        //properties of error
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);

    }
}


//404
class NotFoundError extends BaseError{
    constructor(resource ='Resource'){
        super(`${resource } not found`, 404)
    }
}

//400  or validation error
class ValidationError extends BaseError{
    constructor(message = 'Invalid data send to the server.') {
    super(message, 400);
    }

}

class UnauthorizedError extends BaseError {
  constructor(message = 'failed to authenticate.') {
    super(message, 401);

  }
}

module.exports = {
  BaseError,
  NotFoundError,
  ValidationError,
  UnauthorizedError,
};