const express = require('express');
const Todos = require('../models/Todos');
const auth = require('./helpers/auth');

const router = express.Router();

router.post('/', auth.authToken, (req, res) => {
    console.log(req.body.id + ' | ' + req.user)

    if (req.body.id && req.user) {
        Todos.findOne({id: req.body.id, user: req.user} ,function(err, response) {
            if (response) {
                Todos.deleteOne({id: req.body.id, user: req.user}).then(data => {
                    Todos.find({user: req.user}, function(err, response) {
                        if (response) {
                            res.json(response) 
                        } else {
                            console.log(err)
                            res.json('error getting response')
                        }
                    })
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

})

module.exports = router;