import React, { useState, createContext } from 'react'
import Header from '../components/Header'

import Welcome from './Welcome'
import Login from './Login';
export const ThemeContext = createContext(null);
function Home() {
    const [theme, setTheme] = useState('light');
    const toggleTheme = () => {
        setTheme((cur) => (cur === 'light' ? 'dark' : 'light'));
    }
    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <Header theme={theme} toggleTheme={toggleTheme} />
            <Login />
            <Welcome />
        </ThemeContext.Provider>
        
    )
    
}


export default Home