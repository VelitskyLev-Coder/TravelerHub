const express = require('express')

const multer = require('multer')
const storage = multer.memoryStorage() // Store the image in memory
const upload = multer({ storage: storage })

// controller functions
const { 
    updateUsername,
    updatePassword,
    updatePhoto,
    deletePhoto
} = require('../controllers/profileController')

const requireAuth = require('../middleware/requireAuth')
// const imgurEnsureAuthenticated = require('../middleware/imgurEnsureAuthenticated');

const router = express.Router()

// require auth for all profile routes
router.use(requireAuth)

// Ensure authenticated for Imgur
// router.use(imgurEnsureAuthenticated);

// UPDATE user's username route
router.patch('/username', updateUsername)

// UPDATE user's passworde route
router.patch('/password', updatePassword)

// UPDATE user's profile image route
router.patch('/uploadPhoto', upload.single('image'), updatePhoto);

// DELETE user's profile image route
router.patch('/deletePhoto', deletePhoto)

module.exports = router