require('dotenv').config()

const express = require ('express')
const mongoose = require('mongoose')
const socket = require('socket.io')
// const cors = require("cors")

const userRoutes = require('./routes/user')
const adventureCanvasRoutes = require('./routes/adventureCanvas')
const profileRoutes = require('./routes/profile')
const bookingRoutes = require('./routes/booking')
const conceptRoutes = require('./routes/concept')
const forumRoutes = require('./routes/forum')
const manageTripsRoutes = require('./routes/manageTrips')
const reviewRoutes = require('./routes/review')

// eapress app
const app = express()

// Serve static files from the 'public' directory
app.use(express.static('public'))

// middleware
app.use(express.json())
// app.use(cors())

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// routes
app.use('/api/user', userRoutes)
app.use('/api/adventureCanvas', adventureCanvasRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/booking', bookingRoutes)
app.use('/api/concept', conceptRoutes)
app.use('/api/forum', forumRoutes)
app.use('/api/manageTrips', manageTripsRoutes)
app.use('/api/review', reviewRoutes)

mongoose.connect(process.env.MONGO_URI, {dbName: 'cluster0'})
    .then(() => {
        // listen to requests
        console.log('connecting to db')
    })
    .catch((error) => {
        console.log(error)
    })

const server = app.listen(process.env.PORT, () => {
    console.log('Listening on port', process.env.PORT)
})

// socket.io
const io = socket(server, {
    cors: {
        origin: "http://localhost:3000",
        cerdentials: true,
    },
})

global.io = io

global.onlineUsers = new Map()

io.on('connection', (socket) => {
    socket.on('add-user', (data) => {
        const { email, forumId } = data
        console.log(`${email} joined forum ${forumId}`)
        socket.join(forumId) // Join the user to the specific forum room
    })

    socket.on('send-msg', (msg) => {
        const { forumId, comment } = msg
        io.to(forumId).emit('msg-recieve', comment) // Emit to all users in the specific forum room
    })

    socket.on('comment-updated', (data) => {
        const { forumId, comment } = data
        io.to(forumId).emit('comment-updated', comment) // Emit the updated comment to all users in the specific forum room
    })

    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
})
