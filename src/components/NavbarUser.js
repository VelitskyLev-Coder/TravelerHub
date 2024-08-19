import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext';

const ADMIN_ROLE = 'admin'
const TOUR_OPERATOR_ROLE = 'tourOperator'
const TRAVELER_ROLE = 'traveler'

const NavbarUser = () => {
    // const user = JSON.parse(localStorage.getItem('user'));

    const { logout } = useLogout()
    const { user } = useAuthContext()

    const handleLogoutBtn = () => {
        logout()
    }

    return (
        <Navbar data-bs-theme="dark" expand="lg" className="custom-navbar sticky-top">
            <Container className="container" fluid>
            <Navbar.Brand href="/homeuser" className='nav-title'>Traveler's Hub</Navbar.Brand>
            <div></div>
            <Navbar.Toggle />
            <Navbar.Collapse>
                <Nav className="me-auto">
                    <Nav.Link as={NavLink} to="/homeuser" exact='true'>Trips</Nav.Link>
                    <Nav.Link as={NavLink} to="/profile">My Profile</Nav.Link>
                    { user && user.userType===TRAVELER_ROLE && <Nav.Link as={NavLink} to="/myBooking">My Booking</Nav.Link> }
                    { user && user.userType===TOUR_OPERATOR_ROLE && 
                        <>
                            <Nav.Link as={NavLink} to="/myTrips">My Trips</Nav.Link>
                            <Nav.Link as={NavLink} to="/createTrip">Create a Trip</Nav.Link> 
                        </>
                    }
                    {/* <Nav.Link as={NavLink} to="/createTrip">Create a Trip</Nav.Link> */}
                    { user && user.userType!==ADMIN_ROLE && <Nav.Link as={NavLink} to="/Concept">Concept</Nav.Link> }
                    { user && user.userType===ADMIN_ROLE && 
                        <>
                            <Nav.Link as={NavLink} to="/manageUsers">Manage Users</Nav.Link> 
                            <Nav.Link as={NavLink} to="/customerReviews">Customer Reviews</Nav.Link> 
                            <Nav.Link as={NavLink} to="/manageTrips">Manage Trips</Nav.Link>
                        </>
                    }
                    <Nav.Link as={NavLink} to="/" onClick={handleLogoutBtn}>Log Out</Nav.Link>
                </Nav>
                { user && <p className='m-0'><i className="fa fa-user"></i> { user.email }</p> }
            </Navbar.Collapse>
            </Container>
        </Navbar>
  )
}

export default NavbarUser