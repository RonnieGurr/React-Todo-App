const { query } = require('express');
const e = require('express');
const express = require('express');
const { data } = require('jquery');
const { unstable_renderSubtreeIntoContainer } = require('react-dom');
const Todos = require('../models/Todos');

const router = express.Router();

router.post('/', (req, res) => {
    let reply = {msg: '', todos: []}
    if (req.body.user && req.body.todos) {
    let todos = req.body.todos.map(data => {
        Todos.findOne({id: data.id, user: req.body.user}, function(err, response) {
            let todo = new Todos({
                id: data.id,
                user: req.body.user,
                TodoName: data.TodoName,
                TodoInfo: data.TodoInfo,
                done: data.done
            })

            if (!response) {
                todo.save().then(data => {
                    reply.msg = 'todo saved'
                }).catch(err => {
                    console.log('error')
                })
            } else {
                if (response.done !== todo.done) {
                    response.updateOne({ done: todo.done }).then(data => {
                        reply.msg = 'Todo Updated'
                    }).catch(err => {
                        console.log(err)
                    })
                } else {
                    console.log('no need to edit these ones')
                }
            }

        })

        reply.todos.push(data)
        return data

    })

    res.json(reply)

    } else {
        res.json('Error invalid params')
    }
})

module.exports = router;