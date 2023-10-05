import React from 'react';
import Todo from './Todo';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Container, Row, Table } from 'react-bootstrap';

const TodoList = ({ todos, updateTodo, editTodoName, editTodoType, deleleTodo, theme }) => {
    return (
        <Container className="mb-3" id={theme}>
            <ul className="list-group" id={theme}>
                <li className="list-group-item" id={theme}>
                    <Row>
                        <Col className='col-md-4'>Tên task</Col>
                        <Col className='col-md-2'>#</Col>
                        <Col className='col-md-2'>Loại</Col>
                        <Col className='col-md-2'>estPromodoro</Col>
                        <Col className='col-md-2'>Tùy chỉnh</Col>
                    </Row>
                </li>
                {
                    todos.length > 0
                        ?
                        todos.map((todo) => (
                            <Todo key={todo.id} todo={todo} isCompleted={todo.isCompleted} updateTodo={updateTodo} editTodoName={editTodoName} editTodoType={editTodoType} theme={theme} deleleTodo={deleleTodo} />

                        ))
                        :
                        <div></div>
                }
            </ul>
        </Container>
    );
}

export default TodoList;
