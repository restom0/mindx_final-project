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
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <div id={theme}>
                <Container style={{ width: '532.28px', height: '100vh', padding: 0 }} id={theme}>
                    <Header theme={theme} toggleTheme={toggleTheme} />
                    <div className="justify-content-center" id={theme}>
                        <h1 className="text-center mb-4">Report</h1>
                        <Report theme={theme} />
                    </div>
                </Container>
            </div>
        </ThemeContext.Provider >
    )
}

export default Reportpage