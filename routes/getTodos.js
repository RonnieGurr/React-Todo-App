const auth = require('./helpers/auth');
const express = require('express');
const Todos = require('../models/Todos');

const router = express.Router();

router.post('/', auth.authToken, (req, res) => {
    if (!req.user) {
        res.json({error: 'No user supplied'})
    } else {
        Todos.find({user: req.user}, function(err, response) {
            if (response) {
                res.json(response)
            } else {
                res.json([])
            }
        })
    }
})

module.exports = router;