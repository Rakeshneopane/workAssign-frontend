import Chart from "chart.js/auto"
import { useEffect, useRef } from "react";
import { useLoaderData } from "react-router-dom";

function ChartCard({title, children}){
    return (
        <>
        <h1> {title} </h1>
        {children}
        </>
    )
}

function ChartCanvas({type, data, labels}){

    const canvasRef = useRef(null);
    const chartRef = useRef(null);

  useEffect(()=>{
    chartRef.current?.destroy();

    chartRef.current = new Chart(canvasRef.current, {
        type: "bar",
        data: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri","Sat", "Sun"],
            datasets: [{
                label: Object.keys(labels),
                data: Object.values(labels)
            }]
        },
        options:{
            responsive: true,
            plugins: {
            legend: { position: "bottom" },
            tooltip: {
                callbacks: {
                label: (ctx) => `${ctx.label}: ${ctx.raw}`,
                },
            },
            },
            scales:{
                y:{
                    beginAtZero: true
                }
            }
        }
    });

    return () => chartRef.current?.destroy();

  },[data,type,labels]);
  
  
  return <canvas ref={canvasRef}></canvas>
}


export function Reports(){

    const [lastWeek, pending] = useLoaderData();

    console.log("Last week data: ", lastWeek, "pending: ", pending);

    console.log("last-week: ", lastWeek);

    const lastWeekLabels = lastWeek.tasks.reduce((acc,curr)=>{
        acc[curr.status] = (acc[curr.status] || 0) + 1;
        return acc;
    },{});

    const pendingLabels = pending.tasks.reduce((acc,curr)=>{
        acc[curr.status] = (acc[curr.status] || 0) + 1;
        return acc;
    },{});

    console.log("lastWeekLabels: ",lastWeekLabels);

    return(
        <>
        <h1>Report Overview</h1>
        <div style={{ width: '100%', maxWidth: '600px' }}>
            <ChartCard title="Task closed last week">
                <ChartCanvas
                type="bar"
                data={Object.keys(lastWeekLabels)}
                labels={Object.values(lastWeekLabels)}
                ></ChartCanvas>
            </ChartCard>

            <ChartCard title="Task pending">
                <ChartCanvas
                type="bar"
                data={Object.keys(pendingLabels)}
                labels={Object.values(pendingLabels)}
                ></ChartCanvas>
            </ChartCard>
        </div>      

        </>
    )
}