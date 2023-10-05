import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const TodoFooter = ({ calculateRemainingTasks }) => {
    return (
        <div className="row mb-3">
            <div className='col-md-8'>
                <p>{calculateRemainingTasks()} {calculateRemainingTasks() <= 1 ? "task" : "tasks"} remaining</p>
            </div>
            <div className='col-md-4'>
                MindX todolist
            </div>
        </div>
    );
};

export default TodoFooter;
