const express = require('express')
const router = express.Router()
const User = require('../../models/user')
const cors = require("cors")

router.get('/', getUser, (req, res) => {
    res.json(res.user)
})

// update info to favorites
router.patch('/', getUser, async (req, res) => 
{
    if(req.body.catFactID != null){
        let catFact = req.body.catFactID
        console.log(catFact)
        catFact.forEach(element => user.catFactID.push(element))
    }

    if(req.body.catInfoID != null){
        let catInfo = req.body.catInfoID
        console.log(catInfo)
        catInfo.forEach(element => user.catInfoID.push(element))
    }
    try {
        const updatedUser = await res.user.save()
        res.json(updatedUser)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// remove a cat fact/cat info
router.delete('/', getUser, async (req, res) => {
    if(req.body.catFactID != null)
    {
        let catFact = req.body.catFactID
        catFact.forEach(element => user.catFactID.pull(element))
    }

    if(req.body.catInfoID != null)
    {
        let catInfo = req.body.catInfoID
        catInfo.forEach(element => user.catInfoID.pull(element))
    }

    try {
        const updatedUser = await res.user.save()
        res.json(updatedUser)
    } catch (error) {
        res.status(400).json( {message: error.message} )
    }
})


// // remove a cat fact favorite
// router.delete('/:catFactID', getCatFact, async (req, res) => {
//     try {
//         // console.log(user)
//         await res.user.catFactID.pull(req.params['catFactID'])
//         const removedFact = await res.user.save()
//         console.log(user)
//         res.json({ message: 'Fact has been removed' })
//     } catch (error) {
//         res.status(500).json({ message: error.message })
//     }
// })

// // remove a cat info favorite
// router.delete('/:catInfoID', getCatInfo, async (req, res) => {
//     try {
//         await res.user.catInfoID.pull(req.params['catInfoID'])
//         const removedInfo = await res.user.save()
//         // console.log(user)
//         res.json({ message: 'Info has been removed' })
//     } catch (error) {
//         res.status(500).json({ message: error.message })
//     }
// })

// Find logged in user
async function getUser(req, res, next){
    try {
        session = req.session
        console.log("the current user is "+session.userid)
        user = await User.findOne({ username: session.userid })
        if(user == null){
            return res.status(404).json({ message: 'Cannot find user' })
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
    res.user = user
    console.log(user+"\n"+"getUser function passed")
    next()
}

// find cat info id middleware
async function getCatInfo(req, res, next){
    try {
        user = await User.findOne({ catInfoID: req.params['catInfoID'] })
        if(user == null){
            return res.status(404).json({ message: 'Cannot find info' })
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
    res.user = user
    next()
}

// find cat fact id middleware
async function getCatFact(req, res, next){
    try {
        user = await User.findOne({ catFactID: req.params['catFactID'] })
        if(user == null){
            return res.status(404).json({ message: 'Cannot find fact' })
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
    res.user = user
    next()
}

module.exports = router