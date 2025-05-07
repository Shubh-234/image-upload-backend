const express = require('express')
const {registerUser,loginUser,getUsers,changePassword} = require('../controllers/authControllers')
const protectedRoute = require('../middlewares/authMiddleware')


const router = express.Router()

router.post('/register',registerUser)

router.post('/login',loginUser)

router.get('/users',getUsers);

router.post('/change-password',protectedRoute,changePassword);

module.exports = router;