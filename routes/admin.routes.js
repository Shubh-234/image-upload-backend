const express = require('express');
const roleBased = require('../middlewares/roleMiddleware');
const protectedRoute = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/admin-route',(req,res) => {
    res.send('admin route entered succesffully');
})

module.exports = router;