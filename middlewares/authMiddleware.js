const express = require('express');
const jwt = require('jsonwebtoken');

const protectedRoute = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "No token provided"
            });
        }

        // Extract token from Authorization header
        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is missing"
            });
        }

        // Verify the token
        jwt.verify(token, 'secret', (err, decoded) => {
            if (err) {
                // Handle expired or invalid token errors
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({
                        success: false,
                        message: "Token has expired"
                    });
                }

                // Handle other errors like invalid token
                return res.status(403).json({
                    success: false,
                    message: "Token is invalid"
                });
            }

            // If the token is valid, attach decoded user info to the request
            req.userInfo = decoded;

            // Proceed to the next middleware or route handler
            next();
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = protectedRoute;
