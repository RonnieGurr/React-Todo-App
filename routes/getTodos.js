const express = require('express');
const { ReplSet } = require('mongodb');
const Todos = require('../models/Todos');

const router = express.Router();

router.post('/', (req, res) => {
    if (!req.body.email) {
        res.json({error: 'No user supplied'})
    } else {
        Todos.find({user: req.body.email}, function(err, response) {
            if (response) {
                res.json(response)
            } else {
                res.json('0 Todos')
            }
        })
    }
})

module.exports = router;