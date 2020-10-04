const mongoose = require('mongoose');

const Tokens = mongoose.Schema({
    refreshToken: {
        type: String,
        required: true
    },
    creationTime: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Tokens', Tokens);