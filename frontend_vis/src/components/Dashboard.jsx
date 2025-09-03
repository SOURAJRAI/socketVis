import React from 'react'
import HighchartsReact from 'highcharts-react-official';
import { useEffect } from 'react';
import HighCharts from "highcharts";

import io from 'socket.io-client';
import { useState } from 'react';
import './styles/Dashboard.css';
import DarkUnica from 'highcharts/themes/adaptive';
// import Chalk from 'highcharts/themes/brand-dark';
// import Chalk from 'highcharts/themes/dark-blue';


// DarkUnica(HighCharts);

const socket=io("http://localhost:4000")
function Dashboard() {
    const [numbers,setNumbers]=useState({})
    const [numberValue,setNumber]=useState([]);
    const [squareValue,setSquare]=useState([]);

    useEffect(()=>{
        socket.on("newSqaure",({number,square})=>{
            console.log("Received",number,square);
            setNumbers({number,square});
            setNumber((prev)=>[...prev,number]);

            setSquare((prev)=>{

                const now=Date.now();
                const updated= [...prev,[now,square]]
                const one_min=now - 60*1000;
                return updated.filter(([t])=>t >=one_min);
                
            }
            );

        })

        return () => socket.off("newSqaure")
    },[]);

    const chartOption={
        chart:{type:"areaspline"},
        credits:{enabled:false},
        title:{
            text:"Squares Of Number",
        },
        xAxis:{
            title:{
                text:"Number",
            },
        
            // categories:numberValue\
            type:"datetime",
        },
        yAxis:{
            title:{
                text:"Squares"  
            }
        },
        time:{
            useUTC:false
        },
        series:[
            {
                name:"Square numbers",
                data:squareValue,
            }
        ]
    };
//       const chartOptionBar = {
//     chart: { type: "column" },
//     credits: { enabled: false },
//     title: { text: "Sqaures of Numbers" },
//         xAxis:{
//             title:{
//                 text:"Number",
//             },
//             categories:numbers.map((item)=>item.number),
//         },
//         yAxis:{
//             title:{
//                 text:"Squares"
//             }
//         },
//         series:[
//             {
//                 name:"Square numbers",
//                 data:numbers.map(item=>item.square)
//             }
//         ]
//   };
// console.log(numbers)
console.log("number",numberValue)
console.log(squareValue)
console.log(numbers)

  return (
    <>
    <div className='header'>
        {/* <span> */}
            <h1>Data Visualisation</h1>
        {/* </span> */}
        <span>
            <p>{numbers.number ?? '-'}</p>
            </span>
       <span><p>{numbers.square ?? '-'}</p></span> 
       
    </div>
    <div className='container'>
      
        <div className='chart-container'>
            <div className='card'>
                <HighchartsReact
                highcharts={HighCharts}
                options={chartOption}
                
                />
            </div>
            {/* <div className='card'>
                      <HighchartsReact
                highcharts={HighCharts}
                options={chartOptionBar}
                
                />
            </div> */}
        </div>
        {/* <div className='button'>
                <button className='disconnect' onClick={()=>socket.disconnect()}>Disconnect</button>

        </div> */}
    </div>
    
    </>
  )
}

export default Dashboard