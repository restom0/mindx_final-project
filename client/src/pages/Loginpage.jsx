import React, { useState, createContext } from 'react'
import Header from '../components/Header'

import Login from './Login';
import { Container } from 'react-bootstrap';
export const ThemeContext = createContext(null);
function Loginpage() {
    const [theme, setTheme] = useState('light');
    const toggleTheme = () => {
        setTheme((cur) => (cur === 'light' ? 'dark' : 'light'));
    }
    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <Login />
        </ThemeContext.Provider>

    )

}
export default Loginpage;