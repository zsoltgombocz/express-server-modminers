function notFound(req, res, next) {
    const error = new Error('Not found - '+ req.originalUrl);
    res.status(404);
    next(error);
}

function errorHandler(error, req, res, next) {
    res.status(res.statusCode || 500);
    res.json({
        message: error.message,
        error: process.env.NODE_ENV === 'production' ? {} : error.stack
    });
}

function checkOrigin(req,res,next) {
    const origin = req.headers['origin'];
    if(origin == process.env.LOCAL_ORIGIN || origin == process.env.LOCAL_ORIGIN || req.headers['postman'] == 1) next()
    else res.status(401)
}

module.exports = {
    notFound,
    errorHandler,
    checkOrigin
}