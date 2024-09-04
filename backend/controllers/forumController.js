const Forum = require('../models/forumModel')
const User = require('../models/userModel')

// add commenter details to each comment on the forum
const addCommenterDetails = async (comments) => {
    if (comments.length === 0) {
        return comments // Return empty array if no comments are present
    }

    return await Promise.all(comments.map(async comment => {
        const user = await User.findOne({ email: comment.email })

        if (!user) {
            // If the user is not found, return the comment with default values
            return {
                ...comment.toObject(), // Convert Mongoose document to plain object
                username: 'Unknown',
                photo: '/images/user-blank-profile.png',
                userType: 'Unknown',
            }
        }

        // Return the comment enriched with user details
        return {
            ...comment.toObject(), // Convert Mongoose document to plain object
            username: user.username,
            photo: user.photo,
            userType: user.userType,
        }
    }))
}

// get all forum content by Adventure Canvas id
const getForumContent = async (req, res) => {
    const { adventureCanvas_id } = req.params
    try {
        const forum = await Forum.findOne({ adventureCanvas_id })

        if (!forum) {
            return res.status(404).json({ error: 'Forum not found' })
        }

        // Enrich comments with user details
        const commentsWithDetails = await addCommenterDetails(forum.comments)

        // Prepare the full response object
        const forumRes = {
            ...forum.toObject(),
            comments: commentsWithDetails,
        }

        res.status(200).json(forumRes)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// add new message to a forum
const addMsg = async (req, res) => {
    const { id } = req.params
    const { email, message } = req.body

    try {
        const comment = {
            email: email,
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

        // Fetch the user details based on the email
        const user = await User.findOne({ email: email })

        if (!user) {
            throw new Error('User not found')
        }

        // Enhance the new comment with user details
        const enhancedComment = {
            ...newComment.toObject(),
            userType: user.userType,
            username: user.username,
            photo: user.photo
        }

        // Emit the updated forum and message to clients connected to this forum only
        io.to(id).emit('msg-recieve', enhancedComment)
        
        res.status(200).json(enhancedComment)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// update like/dislike to a comment in a forum
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