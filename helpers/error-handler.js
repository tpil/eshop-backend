function errorHandler(err, req, res, next) {
    console.log('ERROR HANDLER:',err);
    // jwt authentication error
    if (err.name === "UnauthorizedError")
        return res.status(401).json({ message: 'The user is not authorized' });

    //Validation error
    if (err.name === "ValidationError")
        return res.status(401).json({ message: err });

    //Default Server error
    return res.status(500).send({ message: err });
}

module.exports = errorHandler;