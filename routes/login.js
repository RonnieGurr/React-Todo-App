require('dotenv').config
const express = require('express');
const User = require('../models/User');
const md5 = require('md5')
const jwt = require('jsonwebtoken');
const auth = require('./helpers/auth');

const router = express.Router();

router.post('/', (req, res) => {
    User.find({email: req.body.email}).then(data => {
        if (data.length > 0) {
            if (data[0].password === md5(req.body.password)) {
                const user = {
                    email: data[0].email
                }
                
                const accessToken = auth.genToken(user)
                const refreshToken = auth.genRefresh(user)
                res.json({token: accessToken, refreshToken: refreshToken})

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
