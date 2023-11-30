const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
const cors = require("cors")

router.post('/', getUser, async (req, res) => {
    if (await res.user == null)
    {
        return res.status(400).send('Cannot find user')
    }
    try {
        if(await bcrypt.compare(req.body.password, user.password)){
            session = req.session
            session.userid = req.body.username
            console.log(session)
            res.send('User Logged In')
        } 
        else 
        {
            res.send('Not Allowed')
        }
    } catch (error) {
        res.status(500).send()
    }
})

async function getUser(req, res, next){
    try {
        user = await User.findOne({ username: req.body.username })
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