import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto'
const Report = () => {
    const [todos, setTodos] = useState([]);
    const getTodo = () => {
        fetch('http://localhost:3000/task/stat?apitoken=' + localStorage.getItem('apitoken'))
            .then((res) => res.json()).then((res) => {
                setTodos(res.result);
            });
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    var date = [];
    for (let i = sevenDaysAgo.getTime(); i <= Date.now(); i += 86400000) {
        const currentDate = new Date(i);
        const stat = {
            day: currentDate.getDate(),
            month: currentDate.getMonth(),
            year: currentDate.getFullYear(),
            estPomodoro: 0,
        };
        date.push(stat);
    }
    if (todos && todos.length > 0) {
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 3; j++) {
                if (date[i].day === todos[j].finishAtDay && date[i].month === todos[j].finishAtMonth && date[i].year === todos[j].finishAtYear) {
                    date[i].estPomodoro += todos[j].estPomodoro;
                }
            }
        }
    }
    useEffect(() => {
        getTodo();
    }, []);
    const labels = date.map((stat) => `${stat.month + 1}/${stat.day}`); // Adjusting months as they are zero-based
    const data = {
        labels,
        datasets: [{
            label: 'Số pomodoro',
            data: date.map((stat) => stat.estPomodoro),
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    };
    return (
        <Line data={data} />
    )
}

export default Report