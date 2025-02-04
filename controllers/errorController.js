const AppError = require("../utils/appError");
const { STATUS } = require("../utils/constants");

handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
}
handleDuplicateFieldsDB = err => {
    const value = err.errorResponse.errmsg.match(/"([^"]*)"/)[0];
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
};

const handleJWTError = () => new AppError("Invalid Token, Please Login again!!!", 401)
const handleJWTTokenExpiredError = () => new AppError("Your Token got Expired, Please Login again!!!", 401)

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack
    });
}
const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    }
    //programming or other unknown error: don't leak error details
    else {
        // 1) log the error
        console.error('ERROR ', err)

        res.status(500).json({
            status: STATUS.ERROR,
            message: "Something went very wrong!"
        })
    }
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || STATUS.ERROR;

    if (process.env.NODE_ENV === 'dev') {
        sendErrorDev(err, res)
    }
    else if (process.env.NODE_ENV === 'prod') {
        let error = { ...err }
        if (error.name === 'CastError') error = handleCastErrorDB(error)

        if (error.code === 11000) error = handleDuplicateFieldsDB(error)
        if (error.name === 'JsonWebTokenError') error = handleJWTError()
        if (error.name === 'TokenExpiredError') error = handleJWTTokenExpiredError()
        sendErrorProd(error, res)
    }
}