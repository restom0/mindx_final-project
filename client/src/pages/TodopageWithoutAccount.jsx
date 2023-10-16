import React, { createContext, useState } from 'react'
import Header from '../components/Header'
import TodoWithoutAccount from '../components/TodoWithoutAccount';
import '../css/todo.css'
import { Container } from 'react-bootstrap';
export const ThemeContext = createContext(null);
function TodopageWithoutAccount() {
    const [theme, setTheme] = useState('light');
    const toggleTheme = () => {
        setTheme((cur) => (cur === 'light' ? 'dark' : 'light'));
    }
    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <Container style={{ width: '532.28px', height: '100vh', padding: 0 }} id={theme}>
                <Header theme={theme} toggleTheme={toggleTheme} />
                <TodoWithoutAccount theme={theme} toggleTheme={toggleTheme} />
            </Container>
        </ThemeContext.Provider>
    )
}

export default TodopageWithoutAccount