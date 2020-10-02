const express = require('express');
const User = require('../models/User');

const router = express.Router();

router.post('/', (req, res) => {
    User.find({email: req.body.email}).then(data => {
        if (data.length > 0) {
            if (data[0].password === req.body.password) {
                data[0].password = undefined
                res.json(data[0])
            } else {
                res.json({error: 'Password incorrect'})
            }
        } else {
            res.json({error: 'Email not found'})
        }
    }).catch(err => {
        res.json(err)
    })
})

module.exports = router;