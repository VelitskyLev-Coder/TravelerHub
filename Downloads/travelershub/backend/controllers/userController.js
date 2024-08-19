const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, { expiresIn: '1d' }) //the user will remain logged in for 1 day and then the token is going to expire
}

// login user
const loginUser = async (req, res) => {
    const {email, password} = req.body

    try {
        const user = await User.login(email, password)

        // create a token
        const token = createToken(user._id)

        res.status(200).json({email, token, username: user.username, photo: user.photo, userType: user.userType})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// signup user
const signupUser = async (req, res) => {
    const {email, username, password, photo, userType} = req.body

    try {
        const user = await User.signup(email, username, password, photo, userType)

        // create a token
        const token = createToken(user._id)

        if (userType == 'traveler') {
            res.status(200).json({email, token, username: user.username, photo, userType})
        } else {
            res.status(200).json('Tour Operator Account Made Successfully')
        }
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

module.exports = {
    loginUser,
    signupUser
}