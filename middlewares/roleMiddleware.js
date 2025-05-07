const express = require('express');
const jwt = require('jsonwebtoken');

const roleBased = (req,res,next) => {
    try {
        const user = req.userInfo;
        if(!user){
            res.status(400).json({
                success: false,
                message: 'user info not found in request'
            })
        }
        if(user.role === 'admin'){
            next();
        }else{
            res.status(403).json({
                success : false,
                message: "forbidden route"
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message : "Internal server error"
        })
    }
}

module.exports = roleBased;