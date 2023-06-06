import React, { useState, useEffect } from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { DatePicker, Space } from 'antd';
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);


const BarChart = ({dataBarChart, setMonth, setYear}) => {
  const [valueMonthAndYearPieChart, setValueMonthAndYearPieChart] = useState(null)
  const data = {
    labels: dataBarChart[0]?.map((elm) => {return elm}),
    datasets: [
      {
        label:"A+",
        data: dataBarChart[1],
        backgroundColor: 'rgb(255, 99, 132)',
      },
      {
        label:"A",
        data: dataBarChart[2],
        backgroundColor:'rgba(54, 162, 235, 0.2)'
      },
      {
        label:"B",
        data: dataBarChart[3],
        backgroundColor:'rgba(255, 206, 86, 0.2)'
      },
      {
        label:"C",
        data: dataBarChart[4],
        backgroundColor:'rgba(75, 192, 192, 0.2)'
      },
      {
        label:"D",
        data: dataBarChart[5],
        backgroundColor:'rgba(153, 102, 255, 0.2)',
      },
    
    ],
  };
    const options = {
    plugins: {
      title: {
        display: true,
        text: 'Bar Chart - Stacked',
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };
  useEffect(() => {
    if(valueMonthAndYearPieChart){
      const monthValuePie = valueMonthAndYearPieChart.slice(5)
      const yearValuePie = valueMonthAndYearPieChart.slice(0,4)
      setMonth(monthValuePie)
      setYear(yearValuePie)
     
    }
  },[valueMonthAndYearPieChart])

  const handleChangeMonthAndYearPieChart = (e, value) => {
    setValueMonthAndYearPieChart(value)
  }
  return (
    <div>
        <div style={{ display: "flex", marginBottom: "10px" }}>
              You choose year and month: 
            <Space direction="vertical" size={12}>
              <DatePicker picker="month" placeholder="Choose month and year"  bordered={false} onChange={handleChangeMonthAndYearPieChart} />
            </Space>
            </div>
      <Bar
        data={data}
        height={100}
        options={options}
      />
    </div>
  )
}

export default BarChart