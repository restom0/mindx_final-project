import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Col, Row } from 'react-bootstrap';

const Todo = ({ todo, updateTodo, editTodoName, editTodoType, deleleTodo, theme }) => {
    const { isCompleted, id, estPomodoros } = todo;
    const [item, setItem] = useState('');
    const [item1, setItem1] = useState('');
    const [edit, setEdit] = useState(false);
    const [edit1, setEdit1] = useState(false);
    const changeEditTodoName = (old) => {
        setEdit(!edit);
        setItem(old);
    }
    const handleEditTodoName = (event) => {
        if (event.key === "Enter" && item) {
            editTodoName(id, item);
            setEdit(false);
            setItem('');
        }
    }
    const changeEditTodoType = (old) => {
        setEdit1(!edit);
        setItem1(old);
    }
    const handleEditTodoType = (event) => {
        if (event.key === "Enter" && item1) {
            editTodoType(id, item1);
            setEdit1(false);
            setItem1('');
        }
    }
    return (
        <li className="list-group-item" id={theme}>
            <Row>
                <Col className='col-md-4'>
                    {
                        edit === true ?
                            <input type="text" value={item} onChange={(e) => (setItem(e.target.value))} onKeyDown={handleEditTodoName} />
                            :
                            (isCompleted === 1 ?
                                <label className="form-check-label" onDoubleClick={() => changeEditTodoName(todo.name)} ><s>{todo.name}</s></label>
                                :
                                <label className="form-check-label" onDoubleClick={() => changeEditTodoName(todo.name)}>{todo.name}</label>
                            )
                    }
                </Col>
                <Col className='col-md-2'>
                    {
                        isCompleted === 1 ?
                            <input className="form-check-input me-1" type="checkbox" checked={isCompleted} onChange={() => updateTodo(id)} disabled />
                            :
                            <input className="form-check-input me-1" type="checkbox" checked={isCompleted} onChange={() => updateTodo(id)} />
                    }

                </Col>
                <Col className='col-md-2'>
                    {
                        edit1 === true ?
                            <input type="text" value={item1} onChange={(e) => (setItem1(e.target.value))} onKeyDown={handleEditTodoType} />
                            :
                            (isCompleted === 1 ?
                                <label className="form-check-label" onDoubleClick={() => changeEditTodoType(todo.type)} ><s>{todo.type}</s></label>
                                :
                                <label className="form-check-label" onDoubleClick={() => changeEditTodoType(todo.type)}>{todo.type}</label>
                            )
                    }
                </Col>
                <Col className='col-md-2'>
                    {todo.estPomodoro}
                </Col>
                <Col className='col-md-2'>
                    <Button variant="danger" onClick={() => { deleleTodo(todo.id) }}>Xóa</Button>
                </Col>
            </Row>
        </li >
    );
}

export default Todo;
