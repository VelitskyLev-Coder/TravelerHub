import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const NavbarUser = () => {
    return (
        <Navbar data-bs-theme="dark" expand="lg" className="custom-navbar sticky-top">
            <Container className="container" fluid>
            <Navbar.Brand href="/homeuser" className='nav-title'>Traveler's Hub</Navbar.Brand>
            <div></div>
            <Navbar.Toggle />
            <Navbar.Collapse>
                <Nav className="me-auto">
                    <Nav.Link as={NavLink} to="/homeuser" exact='true'>Trips</Nav.Link>
                    <Nav.Link as={NavLink} to="/profile">Profile</Nav.Link>
                    <Nav.Link as={NavLink} to="/myBooking">My Booking</Nav.Link>
                    <Nav.Link as={NavLink} to="/createTrip">Create a Trip</Nav.Link>
                    <Nav.Link as={NavLink} to="/Concept">Concept</Nav.Link>
                    <Nav.Link as={NavLink} to="/">Log Out</Nav.Link>
                </Nav>
                <p className='m-0'><i className="fa fa-user"></i> email@exmple.com</p>
            </Navbar.Collapse>
            </Container>
        </Navbar>
  )
}

export default NavbarUser