import React, { useState, createContext } from 'react'
import Header from '../components/Header'

import Introduction from '../components/Introduction'
import { Container } from 'react-bootstrap';
export const ThemeContext = createContext(null);
function Home() {
    const [theme, setTheme] = useState('light');
    const toggleTheme = () => {
        setTheme((cur) => (cur === 'light' ? 'dark' : 'light'));
    }
    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <div id={theme}>
                <Container style={{ width: '532.28px', padding: 0 }} >
                    <Header theme={theme} toggleTheme={toggleTheme} />
                    <Introduction theme={theme} />
                </Container>
            </div>
        </ThemeContext.Provider>

    )

}


export default Home