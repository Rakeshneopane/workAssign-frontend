import Chart from "chart.js/auto"
import { useEffect, useRef, useState } from "react";
import { useLoaderData, useRouteLoaderData } from "react-router-dom";
import apiFetch from "../api/api";
import { BASE_URL } from "../api/config";

function ChartCard({ title, children }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">{title}</h2>
            {children}
        </div>
    );
}

function ChartCanvas({ type, data, labels, colorSet = 0 }) {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);

    const colorSets = [
        [
            "rgba(59,130,246,0.7)",
            "rgba(234,179,8,0.7)",
            "rgba(239,68,68,0.7)",
            "rgba(34,197,94,0.7)",
            "rgba(168,85,247,0.7)",
            "rgba(249,115,22,0.7)",
            "rgba(20,184,166,0.7)",
        ],
        [
            "rgba(34,197,94,0.7)",
            "rgba(239,68,68,0.7)",
            "rgba(234,179,8,0.7)",
            "rgba(59,130,246,0.7)",
        ],
    ];

    useEffect(() => {
        chartRef.current?.destroy();

        chartRef.current = new Chart(canvasRef.current, {
            type,
            data: {
                labels,
                datasets: [{
                    label: "Tasks",
                    data,
                    backgroundColor: colorSets[colorSet],
                    borderRadius: 6,
                    borderWidth: 1,
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: "bottom" },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => ` ${ctx.raw} task${ctx.raw !== 1 ? "s" : ""}`,
                        },
                    },
                },
                scales: type === "doughnut" ? {} : {
                    y: { beginAtZero: true, ticks: { stepSize: 1 } }
                }
            }
        });

        return () => chartRef.current?.destroy();
    }, [data, type, labels]);

    return <canvas ref={canvasRef} />;
}

export function Reports() {
    const [lastWeek, pending, initialClosed] = useLoaderData();
    const { projects, teams, users } = useRouteLoaderData("root");

    const [groupBy, setGroupBy] = useState("project");
    const [closedTasks, setClosedTasks] = useState(initialClosed);
    const [loading, setLoading] = useState(false);

    const groupOptions = ["project", "team", "owners"];

    const getNameById = (id, groupType) => {
        if (groupType === "project") {
            return projects?.projects?.find(p => p._id === id)?.name ?? "Unknown";
        }
        if (groupType === "team") {
            return teams?.teams?.find(t => t._id === id)?.name ?? "Unknown";
        }
        if (groupType === "owners") {
            return users?.users?.find(u => u._id === id)?.name ?? "Unknown";
        }
        return "Unknown";
    };

    const handleGroupBy = async (group) => {
        setGroupBy(group);
        setLoading(true);
        try {
            const data = await apiFetch(`${BASE_URL}/api/report/closed-tasks?groupBy=${group}`);
            setClosedTasks(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    // Last week - group completed tasks by day
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const lastWeekByDay = days.reduce((acc, d) => ({ ...acc, [d]: 0 }), {});
    lastWeek.tasks.forEach(t => {
        const day = days[new Date(t.updatedAt).getDay()];
        lastWeekByDay[day]++;
    });

    // Pending - group by status
    const pendingGrouped = pending.tasks.reduce((acc, t) => {
        acc[t.status] = (acc[t.status] || 0) + 1;
        return acc;
    }, {});

    // Closed - resolve names from root loader data
    const closedLabels = closedTasks.tasks.map(t => getNameById(t._id, groupBy));
    const closedData   = closedTasks.tasks.map(t => t.totalClosed);

    return (
        <div className="max-w-5xl mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold text-blue-600 mb-8">Report Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Last Week */}
                <ChartCard title={`Completed Last Week (${lastWeek.count})`}>
                    <ChartCanvas
                        type="bar"
                        labels={days}
                        data={days.map(d => lastWeekByDay[d])}
                        colorSet={0}
                    />
                </ChartCard>

                {/* Pending */}
                <ChartCard title={`Pending Tasks (${pending.totalTasks}) — ${pending.daysToComplete} days total`}>
                    <ChartCanvas
                        type="doughnut"
                        labels={Object.keys(pendingGrouped)}
                        data={Object.values(pendingGrouped)}
                        colorSet={1}
                    />
                </ChartCard>

                {/* Closed by group - full width */}
                    <ChartCard title="Closed Tasks Breakdown">

                        {/* GroupBy Buttons */}
                        <div className="flex gap-2 mb-4">
                            {groupOptions.map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => handleGroupBy(opt)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition
                                        ${groupBy === opt
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                >
                                    By {opt.charAt(0).toUpperCase() + opt.slice(1)}
                                </button>
                            ))}
                        </div>

                        {loading ? (
                            <p className="text-gray-400 text-sm text-center py-8">Loading...</p>
                        ) : (
                            <ChartCanvas
                                type="bar"
                                labels={closedLabels}
                                data={closedData}
                                colorSet={0}
                            />
                        )}
                    </ChartCard>

            </div>
        </div>
    );
}