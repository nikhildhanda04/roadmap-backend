const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateTokenHandler = asyncHandler(async (req, res, next) => {
    let token;

    let authHeader = req.headers.Authorization || req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                res.status(401);
                throw new Error("User is Not Authorized");
            }
            req.user = decoded.user; // Assuming the token contains user info
            next();
    
}); 
if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
}}})

module.exports = validateTokenHandler;