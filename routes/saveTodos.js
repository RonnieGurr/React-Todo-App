const { query } = require('express');
const e = require('express');
const express = require('express');
const Todos = require('../models/Todos');

const router = express.Router();

router.post('/', (req, res) => {
    if (req.body.user) {
    let todos = req.body.todos.map(data => {
        Todos.findOne({id: data.id, user: req.body.user}, function(err, response) {
            let todo = new Todos({
                id: data.id,
                user: req.body.user,
                TodoName: data.name,
                TodoInfo: data.info,
                done: data.done
            })

            if (!response) {
                todo.save().then(data => {
                    console.log('todo saved')
                }).catch(err => {
                    console.log('error')
                })
            } else {
                if (response.done !== todo.done) {
                    console.log('updating')
                    response.updateOne({ done: todo.done }).then(data => {
                        console.log(data)
                    }).catch(err => {
                        console.log(err)
                    })
                } else {
                    console.log('no need to edit these ones')
                }

                console.log('Error could not find any Todo list')
            }

        })

        return data

    })

    letNewTodos = Todos.find({user: req.body.user}, function(err, response) {
        if (response) {
            res.json(response)
        } else {
            res.json([])
        }
    })

    } else {
        res.json('Error invalid params')
    }
})

module.exports = router;