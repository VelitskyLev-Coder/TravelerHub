// import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route} from 'react-router-dom'

// pages & components
import Navbar from './components/Navbar';
import NavbarUser from './components/NavbarUser';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import AboutUs from './pages/AboutUs';
import HomeUser from './pages/HomeUser';
import CreateTrip from './pages/CreateTrip';
import Concept from './pages/Concept';
import TripPlan from './pages/TripPlan';
import Profile from './pages/Profile';
import MyBooking from './pages/MyBooking';

function App() {
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
              element={
                <div>
                  <Navbar />
                  <Login />
                </div>
              }
            />
            <Route
              path="/signup"
              element={
                <div>
                  <Navbar />
                  <SignUp />
                </div>
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
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
