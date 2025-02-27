const AppError = require("../utils/appError");
const { STATUS } = require("../utils/constants");

// handleCastErrorDB = err => {
//     const message = `Invalid ${err.path}: ${err.value}.`;
//     return new AppError(message, 400);
// }
// handleDuplicateFieldsDB = err => {
//     const value = err.errorResponse.errmsg.match(/"([^"]*)"/)[0];
//     const message = `Duplicate field value: ${value}. Please use another value!`;
//     return new AppError(message, 400);
// };

// const handleJWTError = () => new AppError("Invalid Token, Please Login again!!!", 401)
// const handleJWTTokenExpiredError = () => new AppError("Your Token got Expired, Please Login again!!!", 401)

const sendErrorDev = (err, req, res) => {
    // console.log(req.startsWith)
    if (req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        })
    }
    return res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: err.message
    })
}
const sendErrorProd = (err, req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            });
        }
        // Programming or other unknown error: don't leak error details
        console.error('ERROR ', err);
        return res.status(500).json({
            status: STATUS.ERROR,
            message: "Something went very wrong!"
        });
    }
    if (err.isOperational) {
        return res.status(err.statusCode).render('error', {
            title: 'Something went wrong!',
            msg: err.message
        });
    }
    // Programming or other unknown error: don't leak error details
    console.error('ERROR ', err);
    return res.status(500).render('error', {
        title: 'Something went wrong!',
        msg: 'Please try again later.'
    });

}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || STATUS.ERROR;

    if (process.env.NODE_ENV === 'dev') {
        sendErrorDev(err, req, res)
    }
    // else if (process.env.NODE_ENV === 'production') {
    //     let error = { ...err }
    //     if (error.name === 'CastError') error = handleCastErrorDB(error)

    //     if (error.code === 11000) error = handleDuplicateFieldsDB(error)
    //     if (error.name === 'JsonWebTokenError') error = handleJWTError()
    //     if (error.name === 'TokenExpiredError') error = handleJWTTokenExpiredError()
    //     sendErrorProd(error, req, res)
    // }
}