const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    photo: {
        type: String,
        default: '/images/user-blank-profile.png'
    },
    userType: {
        type: String,
        required: true
    }
}, { timestamps: true })  


// static signup mathod
userSchema.statics.signup = async function (email, username, password, userType) {

    //validation
    if (!email || !username || !password) {
        throw Error('All fields must be filled')
    }
    if (username.trim()==='' || password.trim()==='') {
        throw Error('All fields must be filled')
    }
    if (!validator.isEmail(email)) {
        throw Error('Email is not valid')
    }
    // if (!validator.isStrongPassword(password)) {
    //     throw Error('Password not strong enough')
    // }

    const existsEmail = await this.findOne({ email })

    if (existsEmail) {
        throw Error('Email already in use')
    }
    
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = await this.create({ email, username, password: hash, userType})

    return user
}


// static login mathod
userSchema.statics.login = async function (email, password) {
    if (!email || !password) {
        throw Error('All fields must be filled')
    }

    const user = await this.findOne({ email })

    if (!user) {
        throw Error('Incorrect email or password')
    }

    const match = await bcrypt.compare(password, user.password)

    if (!match) {
        throw Error('Incorrect email or password')
    }

    return user
}

module.exports = mongoose.model('User', userSchema)