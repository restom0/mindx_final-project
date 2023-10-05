import React, { useState } from 'react';
import { v4 as uuidv4 } from "uuid";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Button, Col } from 'react-bootstrap';
import 'boxicons';
import '../css/todo.css'
const TodoHeader = ({ addTodo, toggleTheme, theme }) => {
    const [item, setItem] = useState('');
    const [number, setNumber] = useState(1);
    const [type, setType] = useState('');
    const [estPomodoros, setEstPomodoros] = useState(1);
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
                                                <h5 >Modal title</h5>
                                            </Col>
                                            <Col align="end">
                                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => setAddTask(!addTask)}>
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </Col>
                                        </Row>
                                        <Row className='mb-3'>
                                            <Col>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={item}
                                                    placeholder="Enter your task here..."
                                                    onChange={(e) => setItem(e.target.value)}

                                                />
                                            </Col>
                                            <Col>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={type}
                                                    placeholder="Enter type of task here..."
                                                    onChange={(e) => setType(e.target.value)}

                                                /></Col>
                                        </Row>
                                        <Row className='mb-3'>
                                            <label>Est Pomodoros</label>
                                            <Col className='col-md-9'>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={number}
                                                    onChange={(e) => setNumber(parseInt(e.target.value))}
                                                />
                                            </Col>
                                            <Col className='col-md'>
                                                <Button variant='light' onClick={() => setNumber(parseInt(number - 1) >= 1 ? parseInt(number - 1) : 1)}><box-icon name='chevron-down'></box-icon></Button>
                                                <Button variant='light' onClick={() => setNumber(parseInt(number + 1))}><box-icon name='chevron-up'></box-icon></Button>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <Button variant='secondary' className='w-100' onClick={() => setAddTask(!addTask)}>Hủy</Button>
                                            </Col>
                                            <Col>
                                                <Button variant='primary' className='w-100' onClick={handleAddTodo}>Thêm</Button>
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
    );
}
export default TodoHeader;
