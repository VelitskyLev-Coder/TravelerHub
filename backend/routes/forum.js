const express = require('express')

// controller functions
const { 
    getForumContent,
    addMsg,
    updateLikeDislike
} = require('../controllers/forumController')

const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// require auth for all travel guide routes
router.use(requireAuth)

// GET all forum content by Adventure Canvas id
router.get('/getForumContent/:adventureCanvas_id', getForumContent)

// PATCH add message to forum route
router.patch('/addMsg/:id', addMsg)

// PATCH update like/dislike for comment in forum route
router.patch('/updateLikeDislike/:forumId/:commentId', updateLikeDislike)

module.exports = router