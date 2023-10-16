import React, { useState, createContext, useEffect } from 'react';
import TodoHeader from '../components/TodoHeader';
import TodoList from '../components/TodoList';
import TodoFooter from '../components/TodoFooter';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../components/Header';
import { Container, Row } from 'react-bootstrap';

export const ThemeContext = createContext(null);
const TodoPage = () => {
    const [todos, setTodos] = useState([]);
    const [theme, setTheme] = useState('light');
    const getTodo = () => {
        fetch('http://localhost:3000/task?apitoken=' + localStorage.getItem('apitoken'))
            .then((res) => res.json()).then((res) => {
                setTodos(res.result);
            });
    }
    const addTodo = (newTodo) => {
        var data = new URLSearchParams();
        data.append('apitoken', localStorage.getItem('apitoken'));
        data.append('taskname', newTodo.taskname);
        data.append('tasktype', newTodo.tasktype);
        data.append('estPomodoro', newTodo.estPomodoros);
        // setTodos((prevTodos) => [...prevTodos, newTodo]);
        fetch('http://localhost:3000/task/add?' + data, {
            method: 'POST'
        }).then((res) => res.json()).then((res) => {
            if (res.check === true) {
                getTodo();
            }
        })
    };
    const updateTodo = (id) => {
        // setTodos(
        //     todos.map((todo) => {
        //         if (todo.id === id) {
        //             todo.isCompleted = !todo.isCompleted;
        //         }
        //         return todo;
        //     })
        // );
        var data = new URLSearchParams();
        data.append('apitoken', localStorage.getItem('apitoken'));
        data.append('id', id);
        fetch('http://localhost:3000/task/status?' + data, {
            method: 'POST',
        }).then((res) => res.json()).then((res) => {
            if (res.check === true) {
                getTodo();
            }
        })
    };
    const editTodoName = (id, text) => {
        // setTodos(
        //     todos.map((todo) => {
        //         if (todo.id === id) {
        //             todo.text = text;
        //         }
        //         return todo;
        //     })
        // );
        var data = new URLSearchParams();
        data.append('apitoken', localStorage.getItem('apitoken'));
        data.append('id', id);
        data.append('taskname', text);
        fetch('http://localhost:3000/task/edit?' + data, {
            method: 'POST',
        }).then((res) => res.json()).then((res) => {
            if (res.check === true) {
                getTodo();
            }
        })
    };
    const editTodoType = (id, text) => {
        // setTodos(
        //     todos.map((todo) => {
        //         if (todo.id === id) {
        //             todo.text = text;
        //         }
        //         return todo;
        //     })
        // );
        var data = new URLSearchParams();
        data.append('apitoken', localStorage.getItem('apitoken'));
        data.append('id', id);
        data.append('tasktype', text);
        fetch('http://localhost:3000/task/edit?' + data, {
            method: 'POST',
        }).then((res) => res.json()).then((res) => {
            if (res.check === true) {
                getTodo();
            }
        })
    };
    const deleteTodo = (id) => {
        // setTodos((todos) => (todos.filter((todo) => todo.id !== id)))
        var data = new URLSearchParams();
        data.append('apitoken', localStorage.getItem('apitoken'));
        data.append('id', id);
        fetch('http://localhost:3000/task/delete?' + data, {
            method: 'POST'
        }).then((res) => res.json()).then((res) => {
            if (res.check === true) {
                getTodo();
            }
        })
    };
    const calculateRemainingTasks = () => {
        return todos.filter(todo => todo.isCompleted === 0).length;
    };
    const toggleTheme = () => {
        setTheme((cur) => (cur === 'light' ? 'dark' : 'light'));
    }
    useEffect(() => {
        getTodo();
    }, [])
    return (
        <Container>
            <ThemeContext.Provider value={{ theme, toggleTheme }}>
                <div id={theme}>
                    <Header theme={theme} toggleTheme={toggleTheme} />
                    <Container className="mb-5" id={theme}>
                        <Container>
                            <Row className="row justify-content-center" id={theme}>
                                <h1 className="text-center mb-4">Todo App</h1>
                                <TodoHeader addTodo={addTodo} theme={theme} toggleTheme={toggleTheme} />
                                <TodoList todos={todos} updateTodo={updateTodo} editTodoName={editTodoName} editTodoType={editTodoType} deleleTodo={deleteTodo} theme={theme} />
                                <TodoFooter todos={todos} calculateRemainingTasks={calculateRemainingTasks} />
                            </Row>
                        </Container>
                    </Container>
                </div>
            </ThemeContext.Provider>
        </Container>
    );
}
export default TodoPage;
