const express = require('express');
const Todos = require('../models/Todos');
const auth = require('./helpers/auth');

const router = express.Router();

router.post('/', auth.authToken, (req, res) => {
    let reply = {msg: '', todos: []}
    if (req.user && req.body.todos) {
    let todos = req.body.todos.map(data => {
        Todos.findOne({id: data.id, user: req.user}, function(err, response) {
            let todo = new Todos({
                id: data.id,
                user: req.user,
                TodoName: data.TodoName,
                TodoInfo: data.TodoInfo,
                done: data.done
            })

            if (!response) {
                todo.save().then(data => {
                    console.log('Item saved')
                }).catch(err => {
                    console.log('err')
                })
            } else {
                if (response.done !== todo.done) {
                    response.updateOne({ done: todo.done }).then(data => {
                        reply.msg = 'Todo Updated'
                    }).catch(err => {
                        console.log('Errors')
                    })
                } else {
                    console.log('no need to edit these ones')
                }
            }

        })

        return data

    })
    reply.todos = todos
    console.log(reply.todos)
    res.json(reply)

    } else {
        res.json('Error invalid params')
    }
})

module.exports = router;