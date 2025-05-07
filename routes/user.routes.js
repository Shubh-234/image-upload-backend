const express = require('express')
const router = express.Router();

router.get('/user-route',(req,res) => {
    res.send('user route entered succesffully');
})

module.exports = router;