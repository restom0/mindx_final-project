import React, { useState, createContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../components/Header';
import { Container, Row } from 'react-bootstrap';
import Report from '../components/Report';

export const ThemeContext = createContext(null);
const Reportpage = () => {
    const [theme, setTheme] = useState('light');
    const toggleTheme = () => {
        setTheme((cur) => (cur === 'light' ? 'dark' : 'light'));
    }
    return (
        <Container>
            <ThemeContext.Provider value={{ theme, toggleTheme }}>
                <Header theme={theme} toggleTheme={toggleTheme} />
                <Container className="mb-5" id={theme}>
                    <Container>
                        <Row className="row justify-content-center" id={theme}>
                            <h1 className="text-center mb-4">Report</h1>
                            <Report />
                        </Row>
                    </Container>
                </Container>
            </ThemeContext.Provider>
        </Container>
    )
}

export default Reportpage