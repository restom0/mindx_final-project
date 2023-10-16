import React, { createContext, useState } from 'react'
import Header from '../components/Header'
import '../css/todo.css'
import { Container } from 'react-bootstrap';
import TodoWithAccount from '../components/TodoWithAccount';
export const ThemeContext = createContext(null);
function TodopageWithAccount() {
    const [theme, setTheme] = useState('light');
    const toggleTheme = () => {
        setTheme((cur) => (cur === 'light' ? 'dark' : 'light'));
    }
    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <div id={theme} style={{ height: "auto" }}>
                <Container style={{ width: '532.28px', padding: 0 }} id={theme}>
                    <Header theme={theme} toggleTheme={toggleTheme} />
                    <TodoWithAccount theme={theme} toggleTheme={toggleTheme} />
                </Container>
            </div>
        </ThemeContext.Provider>
    )
}

export default TodopageWithAccount