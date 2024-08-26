import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext'

// pages & components
import Navbar from './components/Navbar'
import NavbarUser from './components/NavbarUser'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import AboutUs from './pages/AboutUs'
import HomeUser from './pages/HomeUser'
import CreateTrip from './pages/CreateTrip'
import Concept from './pages/Concept'
import TripPlan from './pages/TripPlan'
import Profile from './pages/Profile'
import MyBooking from './pages/MyBooking'
import ManageUsers from './pages/ManageUsers'
import ManageTrips from './pages/ManageTrips'
import MyTrips from './pages/MyTrips'
import CustomerReviews from './pages/CustomerReviews'

function App() {

  const { user } = useAuthContext()

  return (
    <div className="App">
      <BrowserRouter>
        <div className='pages'>
          <Routes>
            <Route
              path="/"
              element={ 
                <div>
                  <Navbar />
                  <Home />
                </div>
              }
            />
            <Route
              path="/login"
              element={ !user ?
                <div>
                  <Navbar />
                  <Login />
                </div> : <Navigate to='/homeuser' />
              }
            />
            <Route
              path="/signup"
              element={ !user ?
                <div>
                  <Navbar />
                  <SignUp />
                </div> : <Navigate to='/homeuser' />
              }
            />
            <Route
              path="/aboutus"
              element={
                <div>
                  <Navbar />
                  <AboutUs />
                </div>
              }
            />
            <Route
              path="/homeuser"
              element={
                <div>
                  <NavbarUser />
                  <HomeUser />
                </div>
              }
            />
            <Route
              path="/profile"
              element={
                <div>
                  <NavbarUser />
                  <Profile />
                </div>
              }
            />
            <Route
              path="/myBooking"
              element={
                <div>
                  <NavbarUser />
                  <MyBooking />
                </div>
              }
            />
            <Route
              path="/createTrip"
              element={
                <div>
                  <NavbarUser />
                  <CreateTrip />
                </div>
              }
            />
            <Route
              path="/concept"
              element={
                <div>
                  <NavbarUser />
                  <Concept />
                </div>
              }
            />
            <Route
              path="/tripPlan"
              element={
                <div>
                  <NavbarUser />
                  <TripPlan />
                </div>
              }
            />
            <Route
              path="/manageUsers"
              element={
                <div>
                  <NavbarUser />
                  <ManageUsers />
                </div>
              }
            />
            <Route
              path="/manageTrips"
              element={
                <div>
                  <NavbarUser />
                  <ManageTrips />
                </div>
              }
            />
            <Route
              path="/myTrips"
              element={
                <div>
                  <NavbarUser />
                  <MyTrips />
                </div>
              }
            />
            <Route
              path="/customerReviews"
              element={
                <div>
                  <NavbarUser />
                  <CustomerReviews />
                </div>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
