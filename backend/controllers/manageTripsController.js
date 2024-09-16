const AdventureCanvas = require('../models/adventureCanvasModel')
const TripPlan = require('../models/tripPlanModel')
const Forum = require('../models/forumModel')
const User = require('../models/userModel')

// add tour operator details to each adventure canvas
const addTourOperatorDetails = async (adventureCanvases) => {
    return await Promise.all(adventureCanvases.map(async canvas => {
        if (!canvas.assignTourOperator) {
            return canvas
        }

        const user = await User.findOne({ email: canvas.assignTourOperator });
        if (!user) {
            // Fallback to default values if user is not found
            return {
                ...canvas.toObject(),
                assignTourOperator: {
                    username: 'Unknown',
                    email: canvas.assignTourOperator.email,
                    photo: '/images/user-blank-profile.png'
                }
            }
        }

        return {
            ...canvas.toObject(),
            assignTourOperator: {
                username: user.username,
                email: user.email,
                photo: user.photo
            }
        }
    }))
}

// get all the adventure canvases that are not yet published
const getUnpublishedAdventureCanvas = async (req, res) => {
    try {
        const adventureCanvas = await AdventureCanvas.find({isPublished: false}).sort({updatedAt: -1})

        if (!adventureCanvas || adventureCanvas.length === 0) {
            return res.status(404).json({ error: 'There are no trips waiting to be published.' })
        }
        
        const adventureCanvasesWithDetails = await addTourOperatorDetails(adventureCanvas)

        res.status(200).json(adventureCanvasesWithDetails)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// publish trip by Adventure Canvas id
const publishTrip = async (req, res) => {
    const { adventureCanvas_id, assignTourOperator } = req.body

    const adventureCanvas = await AdventureCanvas.findOneAndUpdate(
        { _id: adventureCanvas_id }, 
        { 
            isPublished: true, 
            assignTourOperator: assignTourOperator 
        }, 
        { new: true }
    )
  
    if (!adventureCanvas) {
      return res.status(400).json({error: 'Adventure canvas not found'})
    }
  
    res.status(200).json({msg: 'Trip published successfully'})
}

// get the trips plan with dates that are not yet confirmed for execution
const getExecutionUnconfirmedTripPlan = async (req, res) => {
    try {
        // Find all AdventureCanvas documents where isPublished is true
        const publishedAdventureCanvases = await AdventureCanvas.find({ isPublished: true })

        // Get the IDs of the published AdventureCanvases
        const publishedCanvasIds = publishedAdventureCanvases.map(canvas => canvas._id)

        // Find TripPlans that have at least one unconfirmed date and are linked to the published AdventureCanvases
        const unconfirmedTripPlans = await TripPlan.find({
            adventureCanvas_id: { $in: publishedCanvasIds }, // Match only the published adventureCanvas
            dates: { 
                $elemMatch: { executionConfirmed: false }
            }
        })

        // Extract the AdventureCanvases that correspond to the unconfirmed trip plans
        const filteredAdventureCanvases = publishedAdventureCanvases.filter(canvas =>
            unconfirmedTripPlans.some(tripPlan => tripPlan.adventureCanvas_id.equals(canvas._id))
        )

        if (filteredAdventureCanvases.length === 0) {
            return res.status(404).json({ error: 'No published unconfirmed trip plans found' })
        }

        const adventureCanvasesWithDetails = await addTourOperatorDetails(filteredAdventureCanvases)

        res.status(200).json(adventureCanvasesWithDetails)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// update executionConfirmed date status
const updateConfirmedDate = async (req, res) => {
    const { trip_id, date_id } = req.body

    try {
        // Find the TripPlan by ID
        const tripPlan = await TripPlan.findById({ _id: trip_id })
        if (!tripPlan) {
            return res.status(404).json({ error: 'TripPlan not found' })
        }

        // Find the specific date by data_id within the dates array
        const dateItem = tripPlan.dates.id(date_id)
        if (!dateItem) {
            return res.status(404).json({ error: 'Date not found' })
        }

        // Toggle the executionConfirmed field
        dateItem.executionConfirmed = !dateItem.executionConfirmed

        // Save the updated TripPlan
        await tripPlan.save()

        // Respond with the updated dateItem
        res.status(200).json(dateItem)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

// get all the tour operators users
const getAllTourOperators = async (req, res) => {
    try {
        const tourOperators = await User.find({ userType: 'tourOperator' }).select('username email photo -_id')

        if (!tourOperators) {
            return res.status(404).json({ error: 'There are no tour operators users' })
        }
        
        res.status(200).json(tourOperators)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// delete trip
const deleteTrip = async (req, res) => {
    const { adventureCanvas_id } = req.body

    try {
        const forum = await Forum.findOneAndDelete({ adventureCanvas_id })
        if (!forum) {
            return res.status(404).json({ error: 'Somthing went worng...' })
        }

        const tripPlan = await TripPlan.findOneAndDelete({ adventureCanvas_id })
        if (!tripPlan) {
            return res.status(404).json({ error: 'Somthing went worng...' })
        }

        const adventureCanvas = await AdventureCanvas.findOneAndDelete({ _id: adventureCanvas_id })
        if (!adventureCanvas) {
            return res.status(404).json({ error: 'Somthing went worng...' })
        }
        
        res.status(200).json({ msg: 'Trip deleted successfully' })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = {
    getUnpublishedAdventureCanvas,
    publishTrip,
    getExecutionUnconfirmedTripPlan,
    updateConfirmedDate,
    getAllTourOperators,
    deleteTrip,
}