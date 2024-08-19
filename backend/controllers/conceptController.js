const Concept = require('../models/conceptModel')

// get all concepts
const getConcepts = async (req, res) => {
    const concepts = await Concept.find({}).sort({updatedAt: -1})
    res.status(200).json(concepts)
}

// post new concept
const postConcept = async (req, res) => {
    const { concept } = req.body

    try {
        const newConcept = await Concept.create({ ...concept, likes: [] })

        if (!newConcept) {
            return res.status(404).json({ error: 'Something went wrong...' })
        }

        res.status(200).json({ newConcept, msg: 'The concept was made successfully' })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// update like status to a concept
const updateLikeToConcept = async (req, res) => {
    const { concept_id, email, likeStatus } = req.body

    try {
        if (likeStatus === 'like') {
            const concept = await Concept.findOneAndUpdate({_id: concept_id}, 
                {$push: { likes: email }}, 
                { new: true, timestamps: false })

            res.status(200).json(concept.likes)

        } else if (likeStatus === 'unlike') {
            const concept = await Concept.findOneAndUpdate({_id: concept_id}, 
                {$pull: { likes: email }}, 
                { new: true, timestamps: false })

            res.status(200).json(concept.likes)
        }
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// delete concept
const deleteConcept = async (req, res) => {
    const { concept_id } = req.body

    try {
        const concept = await Concept.findByIdAndDelete(concept_id)

        if (!concept) {
            return res.status(404).json({ error: 'Concept not found' })
        }

        res.status(200).json({ msg: 'Concept deleted successfully' })
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

module.exports = {
    getConcepts,
    postConcept,
    deleteConcept,
    updateLikeToConcept
}