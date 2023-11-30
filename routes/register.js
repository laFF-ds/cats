const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
const cors = require("cors")



// create a user
router.post('/', async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const user = new User({
        email: req.body.email,
        username: req.body.username,
        password: hashedPassword,
        catFactID: req.body.catFactID,
        catInfoID: req.body.catInfoID
    })
    try {
        const newUser = await user.save()
        res.status(201).json(newUser)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

module.exports = router