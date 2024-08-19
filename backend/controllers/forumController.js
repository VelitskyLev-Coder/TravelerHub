const Forum = require('../models/forumModel')

// get all forum content by Adventure Canvas id
const getForumContent = async (req, res) => {
    const { adventureCanvas_id } = req.params
    try {
        const forum = await Forum.findOne({adventureCanvas_id})

        if (!forum) {
            return res.status(404).json({ error: 'Forum not found' })
        }

        res.status(200).json(forum)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const addMsg = async (req, res) => {
    const { id } = req.params
    const { userType, username, email, photo, message } = req.body

    try {
        const comment = {
            userType: userType,
            username: username,
            email: email,
            photo: photo,
            message: message,
            likes: [],
            dislikes: []
        }

        const forum = await Forum.findOneAndUpdate(
            { _id: id },
            { $push: { comments: comment } },
            { new: true, timestamps: false }
        )

        const newComment = forum.comments[forum.comments.length - 1]

        // Emit the updated forum and message to clients connected to this forum only
        io.to(id).emit('msg-recieve', newComment)
        
        res.status(200).json(newComment)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const updateLikeDislike = async (req, res) => {
    const { forumId, commentId } = req.params
    const { email, action } = req.body // action can be 'like' or 'dislike'

    try {
        const forum = await Forum.findById(forumId)
        const comment = forum.comments.id(commentId)

        if (action === 'like') {
            // Toggle like
            const likeIndex = comment.likes.indexOf(email)
            if (likeIndex === -1) {
                comment.likes.push(email)
            } else {
                comment.likes.splice(likeIndex, 1)
            }
            // Remove from dislikes if present
            const dislikeIndex = comment.dislikes.indexOf(email)
            if (dislikeIndex !== -1) {
                comment.dislikes.splice(dislikeIndex, 1)
            }
        } else if (action === 'dislike') {
            // Toggle dislike
            const dislikeIndex = comment.dislikes.indexOf(email)
            if (dislikeIndex === -1) {
                comment.dislikes.push(email)
            } else {
                comment.dislikes.splice(dislikeIndex, 1)
            }
            // Remove from likes if present
            const likeIndex = comment.likes.indexOf(email)
            if (likeIndex !== -1) {
                comment.likes.splice(likeIndex, 1)
            }
        }

        await forum.save()

        // Emit the updated comment to clients connected to this forum only
        io.to(forumId).emit('comment-updated', comment)

        res.status(200).json(comment)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = {
    getForumContent,
    addMsg,
    updateLikeDislike
}