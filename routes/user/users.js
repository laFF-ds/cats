const express = require('express')
const router = express.Router()
const User = require('../../models/user')
const cors = require("cors")

// get all users
router.get('/', async (req, res) => 
{
    try {
        const users = await User.find()
        res.json(users)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// create a user
router.post('/', async (req, res) => {
    const user = new User
    ({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
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

// remove a user
router.delete('/:username', getUser, async (req, res) => {
    try {
        await res.user.deleteOne()
        res.json({ message: 'User has been removed' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// find user middleware
async function getUser(req, res, next){
    try {
        user = await User.findOne({ username: req.params['username'] })
        if(user == null){
            return res.status(404).json({ message: 'Cannot find user' })
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
    res.user = user
    console.log("getUser function passed")
    next()
}

module.exports = router