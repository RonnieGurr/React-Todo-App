const mongoose = require('mongoose');

const TodoSchema = mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    TodoName: {
        type: String,
        required: true
    },
    TodoInfo: {
        type: String,
        required: true
    },
    done: {
        type: Boolean,
        required: true
    }
})

module.exports = mongoose.model('Todos', TodoSchema);