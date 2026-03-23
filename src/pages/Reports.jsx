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

        if (!data || data.length === 0 || data.every(val => val === 0)) {
            return; 
        }

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

    if (!data || data.length === 0 || data.every(val => val === 0)) {
        return (
            <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                <p className="text-gray-400 font-medium">No tasks found for this period</p>
            </div>
        );
    }

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
        if (groupType === "project") return projects?.projects?.find(p => p._id === id)?.name ?? "Unknown Project";
        if (groupType === "team") return teams?.teams?.find(t => t._id === id)?.name ?? "Unknown Team";
        if (groupType === "owners") return users?.users?.find(u => u._id === id)?.name ?? "Unknown User";
        return "Unknown";
    };

    const handleGroupBy = async (group) => {
        setGroupBy(group);
        setLoading(true);
        try {
            const data = await apiFetch(`${BASE_URL}/api/report/closed-tasks?groupBy=${group}`);
            setClosedTasks(data);
        } catch (e) {
            console.error("Failed to fetch grouped report:", e);
        } finally {
            setLoading(false);
        }
    };

    // 1. Data Processing with optimized fallbacks
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const lastWeekTasks = lastWeek?.tasks || [];
    const lastWeekByDay = days.reduce((acc, d) => ({ ...acc, [d]: 0 }), {});
    
    lastWeekTasks.forEach(t => {
        if (t?.updatedAt) {
            const date = new Date(t.updatedAt);
            if (!isNaN(date)) {
                const day = days[date.getDay()];
                lastWeekByDay[day]++;
            }
        }
    });

    const pendingTasks = pending?.tasks || [];
    const pendingGrouped = pendingTasks.reduce((acc, t) => {
        if (t?.status) acc[t.status] = (acc[t.status] || 0) + 1;
        return acc;
    }, {});

    const closedTasksList = closedTasks?.tasks || [];
    const closedLabels = closedTasksList.map(t => getNameById(t._id, groupBy));
    const closedData = closedTasksList.map(t => t.totalClosed);

    // 2. Main Empty State Check (Logic: Do we have anything at all to show?)
    const hasAnyData = (lastWeek?.count > 0) || (pending?.totalTasks > 0) || (closedTasksList.length > 0);

    if (!hasAnyData) {
        return (
            <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in duration-500">
                <div className="bg-blue-50 p-8 rounded-full mb-6 ring-8 ring-blue-50/50">
                    <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-800">Charts are currently empty</h1>
                <p className="text-gray-500 max-w-sm mt-2">
                    Connect your teams or start completing tasks to unlock these productivity insights.
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto py-8 px-4">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Report Overview</h1>
                    <p className="text-gray-500 text-sm mt-1">Real-time performance metrics</p>
                </div>
                <span className="text-xs font-mono font-medium text-gray-400 bg-gray-100/80 px-3 py-1.5 rounded-md border border-gray-200">
                    LAST SYNC: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Last Week Chart */}
                <ChartCard title={`Completed Last Week (${lastWeek?.count || 0})`}>
                    <ChartCanvas
                        type="bar"
                        labels={days}
                        data={days.map(d => lastWeekByDay[d])}
                        colorSet={0}
                    />
                </ChartCard>

                {/* Pending Chart */}
                <ChartCard title={`Current Workload (${pending?.totalTasks || 0} Tasks)`}>
                    <ChartCanvas
                        type="doughnut"
                        labels={Object.keys(pendingGrouped)}
                        data={Object.values(pendingGrouped)}
                        colorSet={1}
                    />
                </ChartCard>

                {/* Breakdown Chart */}
                <div className="md:col-span-2">
                    <ChartCard title="Total Productivity Breakdown">
                        <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Group by</span>
                            <div className="flex bg-gray-100 p-1 rounded-lg">
                                {groupOptions.map(opt => (
                                    <button
                                        key={opt}
                                        onClick={() => handleGroupBy(opt)}
                                        className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all duration-200
                                            ${groupBy === opt
                                                ? "bg-white text-blue-600 shadow-sm"
                                                : "text-gray-500 hover:text-gray-700"
                                            }`}
                                    >
                                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {loading ? (
                            <div className="h-[300px] flex flex-col items-center justify-center space-y-4">
                                <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                                <p className="text-gray-400 text-sm font-medium animate-pulse">Analyzing data...</p>
                            </div>
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
        </div>
    );
}