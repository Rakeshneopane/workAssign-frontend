import Chart from "chart.js/auto"
import { useEffect, useRef, useState } from "react";
import { useLoaderData, useRouteLoaderData } from "react-router-dom";
import apiFetch from "../api/api";
import { BASE_URL } from "../api/config";
import {
    FiCheckCircle,
    FiClock,
    FiTrendingUp,
} from "react-icons/fi";

function ChartCard({ title, children }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">

            <h2 className="text-xl font-semibold text-slate-900">
                {title}
            </h2>

            <div className="mt-6">
                {children}
            </div>

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
            interaction: {
                intersect: false,
                mode: "index",
            },
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
                    title: {
                        display: false,
                    },

                    legend: {
                        display: false,
                    },

                    tooltip: {
                        backgroundColor: "#0f172a",
                        padding: 12,
                        displayColors: false,
                        callbacks: {
                            label: (ctx) =>
                                `${ctx.raw} completed task${ctx.raw !== 1 ? "s" : ""}`,
                        },
                    },
                },
                scales:
                    type === "doughnut"
                        ? {}
                        : {
                            x: {
                                grid: {
                                    display: false,
                                },
                            },
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    stepSize: 1,
                                },
                                grid: {
                                    color: "#e2e8f0",
                                },
                            },
                        },
            }
        });

        return () => chartRef.current?.destroy();
    }, [data, type, labels]);

    if (!data || data.length === 0 || data.every(val => val === 0)) {
        return (
            <div className="flex h-64 flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50">
                <p className="font-medium text-slate-400">No tasks found for this period</p>
            </div>
        );
    }

    return (
        <div className="h-[360px]">
            <canvas ref={canvasRef} />
        </div>
    );
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

    const hasAnyData = (lastWeek?.count > 0) || (pending?.totalTasks > 0) || (closedTasksList?.length > 0);

    if (!hasAnyData) {
        return (
            <div className="space-y-10 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                    <div className="mb-8">
                        <p className="mt-2 text-slate-500">
                            Track productivity, workload, and completed tasks across your organization.
                        </p>
                    </div>

                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-32 text-center">
                        <div className="mb-6 rounded-full bg-blue-50 p-8 ring-8 ring-blue-50/50">
                            <svg className="h-16 w-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-700">Charts are currently empty</h3>
                        <p className="mt-2 max-w-sm text-slate-500">
                            Connect your teams or start completing tasks to unlock these productivity insights.
                        </p>
                    </div>

                </div>
            </div>
            </div>
        );
    }

    const closedLabels = closedTasksList?.map(t => getNameById(t._id, groupBy));
    const closedData = closedTasksList?.map(t => t.totalClosed);

    const completedCount = lastWeek?.count || 0;
    const pendingCount = pending?.totalTasks || 0;

    const completionRate =
        completedCount + pendingCount === 0
            ? 0
            : Math.round(
                (completedCount / (completedCount + pendingCount)) * 100
            );

    return (
        <div className="space-y-10 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="min-h-screen">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <div className="mb-8">
                    <p className="mt-2 text-slate-500">
                        Track productivity, workload, and completed tasks across your organization.
                    </p>
                </div>

                {/* stats */}
                <div className="mb-8 grid gap-6 md:grid-cols-3">

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
                            <FiCheckCircle className="text-2xl text-emerald-600" />
                        </div>

                        <p className="text-sm text-slate-500">
                            Completed Tasks
                        </p>

                        <h2 className="mt-2 text-3xl font-bold text-slate-900">
                            {completedCount}
                        </h2>

                        <p className="mt-3 text-sm text-slate-400">
                            Finished during the last 7 days
                        </p>

                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50">
                            <FiClock className="text-2xl text-amber-500" />
                        </div>

                        <p className="text-sm text-slate-500">
                            Pending Tasks
                        </p>

                        <h2 className="mt-2 text-3xl font-bold text-slate-900">
                            {pendingCount}
                        </h2>

                        <p className="mt-3 text-sm text-slate-400">
                            Currently in progress
                        </p>

                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                            <FiTrendingUp className="text-2xl text-blue-600" />
                        </div>

                        <p className="text-sm text-slate-500">
                            Completion Rate
                        </p>

                        <h2 className="mt-2 text-3xl font-bold text-slate-900">
                            {completionRate}%
                        </h2>

                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
                            <div
                                className="h-full rounded-full bg-blue-600 transition-all duration-500"
                                style={{ width: `${completionRate}%` }}
                            />
                        </div>

                    </div>

                </div>

                {/* charts */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">

                    <ChartCard title={`Completed Last Week (${lastWeek?.count || 0})`}>
                        <ChartCanvas
                            type="bar"
                            labels={days}
                            data={days.map(d => lastWeekByDay[d])}
                            colorSet={0}
                        />
                    </ChartCard>

                    <ChartCard title={`Current Workload (${pending?.totalTasks || 0} Tasks)`}>
                        <ChartCanvas
                            type="doughnut"
                            labels={Object.keys(pendingGrouped)}
                            data={Object.values(pendingGrouped)}
                            colorSet={1}
                        />
                    </ChartCard>

                    <div className="md:col-span-2">
                        <ChartCard
                            title="Productivity Breakdown"
                        >

                            <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                                <div>

                                    <p className="text-sm text-slate-500">
                                        Compare completed work across projects,
                                        teams, or owners.
                                    </p>

                                    <div className="mt-4">

                                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                                            Viewing by {groupBy}
                                        </span>

                                    </div>

                                </div>

                                <div className="inline-flex rounded-xl bg-slate-100 p-1">

                                    {groupOptions.map((opt) => (

                                        <button
                                            key={opt}
                                            onClick={() => handleGroupBy(opt)}
                                            className={`
                                                rounded-lg
                                                px-5
                                                py-2
                                                text-sm
                                                font-medium
                                                transition-all

                                                ${
                                                    groupBy === opt
                                                        ? "bg-white text-blue-600 shadow-sm"
                                                        : "text-slate-500 hover:text-slate-700"
                                                }
                                            `}
                                        >
                                            {opt.charAt(0).toUpperCase() + opt.slice(1)}
                                        </button>

                                    ))}

                                </div>

                            </div>

                            {loading ? (

                                <div className="flex h-[360px] flex-col items-center justify-center gap-4">

                                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

                                    <p className="text-sm font-medium text-slate-400">
                                        Generating productivity report...
                                    </p>

                                </div>

                            ) : (

                                <div className="rounded-xl border border-slate-100 bg-slate-50 p-6">

                                    <ChartCanvas
                                        type="bar"
                                        labels={closedLabels}
                                        data={closedData}
                                        colorSet={0}
                                    />

                                </div>

                            )}

                        </ChartCard>
                    </div>

                </div>

            </div>
        </div>
        </div>
    );
}