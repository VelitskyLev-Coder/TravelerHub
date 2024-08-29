const AdventureCanvas = require('../models/adventureCanvasModel')
const TripPlan = require('../models/tripPlanModel')
const Forum = require('../models/forumModel')

const fetch = require('node-fetch') // Ensure you have node-fetch installed
const FormData = require('form-data')

// get all the adventure canvases
const getadventureCanvas = async (req, res) => {
    try {
        // const adventureCanvas = await AdventureCanvas.find({isPublished: true}).sort({updatedAt: -1})
        const adventureCanvastry = await AdventureCanvas.aggregate([
            // Match only published adventure canvases
            { $match: { isPublished: true } },
            // Perform a lookup to join the AdventureCanvas collection with the User collection
            {
                $lookup: {
                    from: 'users', // Name of the User collection
                    localField: 'assignTourOperator', // Field from AdventureCanvas to match with User
                    foreignField: 'email', // Field from User to match with AdventureCanvas
                    as: 'tourOperatorDetails' // Name of the array field where the matched user documents will be stored
                }
            },
            // Unwind the tourOperatorDetails array to convert it from an array to a single object
            {
                $unwind: {
                    path: '$tourOperatorDetails',
                    preserveNullAndEmptyArrays: true // This ensures that canvases without an assigned operator are still included
                }
            },
            // Project the fields and structure the assignTourOperator as an array
            {
                $project: {
                    images: 1,
                    tripName: 1,
                    duration: 1,
                    description: 1,
                    cost: 1,
                    isPublished: 1,
                    assignTourOperator: {
                        $cond: {
                            if: { $ifNull: ['$tourOperatorDetails', false] }, // Check if tourOperatorDetails exists
                            then: {
                                username: '$tourOperatorDetails.username',
                                email: '$tourOperatorDetails.email',
                                photo: '$tourOperatorDetails.photo'
                            },
                            else: null
                        }
                    },
                    updatedAt: 1,
                    createdAt: 1
                }
            }
        ]).sort({ updatedAt: -1 })

        res.status(200).json(adventureCanvastry)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// create new trip
const createNewTrip = async (req, res) => {
    const adventureCanvas = JSON.parse(req.body.adventureCanvas)
    const tripPlan = JSON.parse(req.body.tripPlan)
    
    try {
        const imgurImageUrls = []

        // Upload each image to Imgur
        for (const file of req.files) {
            const formData = new FormData()
            formData.append('image', file.buffer, file.originalname)

            const response = await fetch('https://api.imgur.com/3/image', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${process.env.IMGUR_ACCESS_TOKEN}`,
                    ...formData.getHeaders()
                }
            })

            const json = await response.json()
            if (response.ok) {
                imgurImageUrls.push(json.data.link) // Store Imgur URL
            } else {
                throw new Error(json.data.error)
            }
        }

        // Create new adventureCanvas with Imgur image URLs
        const newAdventureCanvas = await AdventureCanvas.create({
            ...adventureCanvas,
            images: imgurImageUrls
        })

        const newTripPlan = await TripPlan.create({ ...tripPlan, adventureCanvas_id: newAdventureCanvas._id })

        // Create forum and attach it to the new adventure canvas
        const newForum = await Forum.create({ comments: [], adventureCanvas_id: newAdventureCanvas._id })

        res.status(200).json({ msg: 'The trip has been created successfully' })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}
 
// get specific trip plan by adventure_canvases_id
const getTripPlanByAdventureCanvasId = async (req, res) => {
    const { adventureCanvas_id } = req.params

    try {
        const tripPlan = await TripPlan.findOne({ adventureCanvas_id })

        if (!tripPlan) {
            return res.status(404).json({ error: 'Trip plan not found' })
        }
        
        res.status(200).json(tripPlan)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// get adventure canvase by id
const getAdventureCanvasById = async (req, res) => {
    const { adventureCanvas_id } = req.params

    try {
        const adventureCanvas = await AdventureCanvas.findOne({ _id: adventureCanvas_id })

        if (!adventureCanvas) {
            return res.status(404).json({ error: 'Adventure canvas not found' })
        }
        
        res.status(200).json(adventureCanvas)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// get all trips (adventure canvases) for tour operator
const getTourOperatorTrips = async (req, res) => {
    const { email } = req.params
    try {
        const adventureCanvas = await AdventureCanvas.find({ 'assignTourOperator.email': email }).sort({updatedAt: -1})

        if (!adventureCanvas.length) {
            return res.status(404).json({ error: 'No trip has been assigned to you yet.' })
        }
        res.status(200).json(adventureCanvas)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = {
    getadventureCanvas,
    createNewTrip,
    getTripPlanByAdventureCanvasId,
    getAdventureCanvasById,
    getTourOperatorTrips,
}