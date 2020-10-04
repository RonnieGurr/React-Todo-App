require('dotenv').config;
const express = require('express');
const User = require('../models/User');
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const auth = require('./helpers/auth')

const router = express.Router();

router.post('/', (req, res) => {
    User.count({email: req.body.email}, function(err, count) {
        if (count > 0) {
            res.send({error: 'Email already exsist'})
        } else {
            const user = new User({
                email: req.body.email,
                password: md5(req.body.password)
            })
            
            user.save()
            .then(data => {
                const user = {
                    email: data.email
                }
                const accessToken = auth.genToken(user)
                const refreshToken = auth.genRefresh(user)
                res.json({token: accessToken, refreshToken: refreshToken})
            })
            .catch(err => {
                res.json(err)
            })
        }
    })
})

module.exports = router;