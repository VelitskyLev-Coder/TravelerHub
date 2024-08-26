import React from 'react'
import { Navbar, Nav, Container } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'

const Navigation = () => {
  return (
      <Navbar data-bs-theme="dark" expand="lg" className="custom-navbar sticky-top">
        <Container className="container" fluid>
          <Navbar.Brand href="/" className='nav-title'>Traveler's Hub</Navbar.Brand>
          <div></div>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="me-auto">
              <Nav.Link as={NavLink} to="/" exact='true'>Home</Nav.Link>
              <Nav.Link as={NavLink} to="/login">Log In</Nav.Link>
              <Nav.Link as={NavLink} to="/signup">Sign Up</Nav.Link>
              <Nav.Link as={NavLink} to="/aboutus">About Us</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
  )
}

export default Navigation