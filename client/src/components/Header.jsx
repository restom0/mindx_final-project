import React from 'react'
import { NavDropdown } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
const Header = ({ theme, toggleTheme }) => {
    return (
        <Container>
            <Navbar expand="lg" id={theme} >
                <Container>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" id={theme} />
                    <Navbar.Collapse>
                        <Nav className="me-auto" >
                            <Nav.Link href="/home"><span id={theme}><b>Nhóm 2</b></span></Nav.Link>
                            <Nav.Link href="/todo"><span id={theme}><b>Task</b></span></Nav.Link>
                            <Nav.Link href="/report"><span id={theme}><b>Report</b></span></Nav.Link>
                            <NavDropdown title={<box-icon name='user' type='solid' color="#ffffff" ></box-icon>} id="basic-nav-dropdown">
                                <NavDropdown.Item >Tài khoản</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item>Logout</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>

                        <div className="form-check form-switch">
                            <label className="form-check-label"><b>Dark mode</b></label>
                            <input className="form-check-input" type="checkbox" role="switch" onChange={() => toggleTheme()} id="flexSwitchCheckDefault" />
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </Container>
    )
}

export default Header