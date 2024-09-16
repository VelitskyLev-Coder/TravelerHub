# Traveler's Hub

Traveler's Hub is a comprehensive trip planning platform designed to streamline the process for travelers and tour operators. It allows users to explore, create, book trips, and engage in discussions through a community-driven interface.

## Features
- **Trip Planning**: Users can browse and book trips with detailed itineraries.
- **Adventure Canvas**: Tour operators can create travel packages outlining activities, destinations, and pricing.
- **Concept Creation**: Travelers can propose trip ideas, which can be reviewed and promoted by tour operators.
- **Forum Discussions**: Engage with other users and operators in real-time conversations about trips.
- **Real-Time Chat**: Powered by Socket.IO for real-time interactions.
- **Image Handling**: Integrated with Imgur for efficient image storage and display.

## Tech Stack
- **Frontend**: React.js
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Real-time Communication**: Socket.IO
- **Image Storage**: Imgur API

## Installation and Running Locally

### Prerequisites
Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v14+)
- [MongoDB](https://www.mongodb.com/)
- [Imgur API Key](https://apidocs.imgur.com/) (for image uploads)

### Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/VelitskyLev-Coder/TravelerHub.git
   cd TravelerHub

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install

3. **Configure Environment Variables:** Create a .env file in the backend directory and set the following variables:
   ```bash
   PORT=<Port_Number>
   MONGO_URI=<Your_MongoDB_URI>
   IMGUR_ACCESS_TOKEN=<Your_Imgur_Access_Token>
   SECRET=<Your_JWT_Secret>

4. **Run the backend:**
   ```bash
   npm start

5. **Install frontend dependencies:** Open a new terminal and navigate to the frontend directory:
   ```bash
   cd ../frontend
   npm install

6. **Run the frontend:**
   ```bash
   npm start

### Running Tests

To run the unit tests for the project:
```bash
cd backend
npm test
