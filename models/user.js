const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    catFactID: {
        type: [String],
        required: false
    },
    catInfoID: {
        type: [String],
        required: false
    }
})

module.exports = mongoose.model('User', userSchema) 