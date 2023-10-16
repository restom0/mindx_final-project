import React, { useState } from 'react';
import { v4 as uuidv4 } from "uuid";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Button, Col, CloseButton } from 'react-bootstrap';
import 'boxicons';
import '../css/todo.css'
const TodoHeader = ({ addTodo, toggleTheme, theme, handleClick }) => {
    const [item, setItem] = useState('');
    const [number, setNumber] = useState(1);
    const [type, setType] = useState('');
    const [estPomodoros, setEstPomodoros] = useState(1);
    const [isLoading, setLoading] = useState(false);
    const [addTask, setAddTask] = useState(false);


    const handleAddTodo = (e) => {
        if (item && number && Number.isInteger(number)) {
            const newTodo = {
                taskname: item,
                tasktype: type,
                estPomodoros: number
            };
            addTodo(newTodo);
            setItem('');
            setNumber(1);
            setAddTask(!addTask);
        }
        e.preventDefault()
    }
    return (

        <Row className="row mt-3 ms-1" id={theme}>
            <form className="form-inline">
                <div className="row mb-3">
                    {
                        addTask === true ?
                            <Row>
                                <div role="dialog">
                                    <div role="document">
                                        <div>
                                            <Row className='mb-3'>
                                                <Col>

                                                </Col>
                                                <Col align="end" data-bs-theme={theme} className='bg-`+{theme}+`dark p-2'>
                                                    <CloseButton data-dismiss="modal" aria-label="Close" onClick={() => setAddTask(!addTask)} style={{ color: "white" }}>
                                                    </CloseButton>
                                                </Col>
                                            </Row>
                                            <Row className='mb-3'>
                                                <Col>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={item}
                                                        placeholder="Nhập task"
                                                        onChange={(e) => setItem(e.target.value)}

                                                    />
                                                </Col>
                                                <Col>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Nhập loại task..."
                                                        onChange={(e) => setType(e.target.value)}
                                                        id=""
                                                        value={type}
                                                    /></Col>
                                            </Row>
                                            <Row className='mb-3'>
                                                <label>Est Pomodoros</label>
                                                <Col className='col-8'>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={number}
                                                        onChange={(e) => setNumber(parseInt(e.target.value))}
                                                    />
                                                </Col>
                                                <Col className='col'>
                                                    <Button variant='light' onClick={() => setNumber(parseInt(number - 1) >= 1 ? parseInt(number - 1) : 1)}><box-icon name='chevron-down'></box-icon></Button>
                                                    <Button variant='light' onClick={() => setNumber(parseInt(number + 1))}><box-icon name='chevron-up'></box-icon></Button>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col>
                                                    <Button variant='secondary' className='w-100' onClick={() => setAddTask(!addTask)}>Hủy</Button>
                                                </Col>
                                                <Col>
                                                    <button
                                                        className="btn btn-primary w-100"
                                                        disabled={isLoading || item.length === 0 ? true : false}
                                                        onClick={(e) => (!isLoading ? handleClick() : null, handleAddTodo())}
                                                    >
                                                        {isLoading ? "Loading…" : "Thêm"}
                                                    </button>
                                                </Col>
                                            </Row>
                                        </div>
                                    </div>
                                </div>
                            </Row>
                            :
                            <Row>
                                <Button variant='primary' className='w-100' onClick={() => setAddTask(!addTask)}>Thêm Task</Button>
                            </Row>
                    }
                </div>
            </form >
        </Row>
    );
}
export default TodoHeader;
