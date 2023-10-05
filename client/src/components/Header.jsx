import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
const Header = ({ theme, toggleTheme }) => {
    return (
        <Navbar expand="lg" id={theme} >
            <Container>
                <Navbar.Brand href="/home" id={theme}>React-Bootstrap</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" id={theme} />
                <Navbar.Collapse>
                    <Nav className="me-auto">
                        <Nav.Link id={theme} href="/">Home</Nav.Link>
                        <Nav.Link id={theme} href="/todo">Todo</Nav.Link>
                        <Nav.Link id={theme} href="/report">Report</Nav.Link>
                    </Nav>
                    <div className="form-check form-switch">
                        <label className="form-check-label" >Dark mode</label>
                        <input className="form-check-input" type="checkbox" role="switch" onChange={() => toggleTheme()} id="flexSwitchCheckDefault" />
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Header