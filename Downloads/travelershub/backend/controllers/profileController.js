const User = require('../models/userModel')

const bcrypt = require('bcrypt')
const FormData = require('form-data');
const fetch = require('node-fetch');

// update the user's username
const updateUsername = async (req, res) => {
    const user_id = req.user._id
    const { username } = req.body

    const user = await User.findOneAndUpdate({ _id: user_id }, { username }, { new: true })
  
    if (!user) {
      return res.status(400).json({error: 'No such user'})
    }
  
    res.status(200).json({msg: 'Update username successfully'})
}

// update the user's password
const updatePassword = async (req, res) => {
    const user_id = req.user._id
    const { password } = req.body
    
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = await User.findOneAndUpdate({ _id: user_id }, { password: hash }, { new: true })
  
    if (!user) {
      return res.status(400).json({error: 'No such user'})
    }
  
    res.status(200).json({msg: 'Update password successfully'})
}

// update the user's profile image
const updatePhoto = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file provided' });
    }

    const user_id = req.user._id;
    const formData = new FormData();
    formData.append('image', req.file.buffer, 'image.jpg');

    try {
        const response = await fetch('https://api.imgur.com/3/image', {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${process.env.IMGUR_ACCESS_TOKEN}`,
                ...formData.getHeaders()
            }
        });

        const json = await response.json();

        if (response.ok) {
            // Save the Imgur link to the user's profile
            const user = await User.findByIdAndUpdate(user_id, { photo: json.data.link }, { new: true });

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.status(200).json({ msg: 'Profile photo updated successfully', photo: user.photo });
        } else {
            res.status(response.status).json({ error: json.data.error });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to upload image' });
    }
}


// delete the user's profile image
const deletePhoto = async (req, res) => {
    // const { blankProfileImage } = req.body
    const user_id = req.user._id
    blankProfileImage = './images/user-blank-profile.png'

    try {
        const user = await User.findByIdAndUpdate(user_id, { photo: blankProfileImage }, { new: true })

        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        res.status(200).json({ msg: 'Profile photo deleted successfully', photo: user.photo})
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

// delete the user's account

module.exports = {
    updateUsername,
    updatePassword,
    updatePhoto,
    deletePhoto
}