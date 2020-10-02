const { query } = require('express');
const express = require('express');
const Todos = require('../models/Todos');

const router = express.Router();

router.post('/', (req, res) => {
    console.log(req.body)
    if (req.body.id && req.body.user) {
        Todos.findOne({id: req.body.id, user: req.body.user} ,function(err, response) {
            console.log(response)
            if (response) {
                Todos.deleteOne({id: req.body.id, user: req.body.user}).then(data => {
                    console.log('item deleted')
                }).catch(err => {
                    console.log('Error deleting item')
                })
            } else {
                console.log('Unable to find todo item')
            }
        })
    } else {
        console.log('Unable to delete')
    }

    Todos.find({user: req.body.user}, function(err, response) {
        if (response) {
            res.json(response)
        } else {
            res.json([])
        }
    })
})

module.exports = router;