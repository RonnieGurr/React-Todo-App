const express = require('express');
const User = require('../models/User');

const router = express.Router();

router.post('/', (req, res) => {
    User.count({email: req.body.email}, function(err, count) {
        if (count > 0) {
            res.send({error: 'Email already exsist'})
        } else {
            const user = new User({
                email: req.body.email,
                password: req.body.password
            })
            
            user.save()
            .then(data => {
                data.password = undefined
                res.json(data)
            })
            .catch(err => {
                res.json(err)
            })
        }
    })
})

module.exports = router;