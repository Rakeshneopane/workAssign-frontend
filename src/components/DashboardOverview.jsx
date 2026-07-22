import { Link, useRouteLoaderData } from "react-router-dom";
import {
    FiFolder,
    FiCheckSquare,
    FiUsers,
    FiTrendingUp,
    FiArrowRight,
    FiPlus,
} from "react-icons/fi";

export default function DashboardOverview() {
    const { projects, tasks, teams } = useRouteLoaderData("root");

    const projectList = projects?.projects || [];
    const taskList = tasks?.tasks || [];
    const teamList = teams?.teams || [];

    const completedTasks = taskList.filter(
        t => t.status === "completed"
    ).length;

    const completion =
        taskList.length > 0
            ? Math.round((completedTasks / taskList.length) * 100)
            : 0;

    const stats = [
        {
            title: "Projects",
            value: projectList.length,
            icon: <FiFolder size={26} />,
            bg: "bg-blue-100",
            text: "text-blue-600",
        },
        {
            title: "Tasks",
            value: taskList.length,
            icon: <FiCheckSquare size={26} />,
            bg: "bg-green-100",
            text: "text-green-600",
        },
        {
            title: "Teams",
            value: teamList.length,
            icon: <FiUsers size={26} />,
            bg: "bg-purple-100",
            text: "text-purple-600",
        },
        {
            title: "Completed",
            value: `${completion}%`,
            icon: <FiTrendingUp size={26} />,
            bg: "bg-orange-100",
            text: "text-orange-600",
        },
    ];

    const recentProjects = projectList.slice(0, 3);

    const upcomingTasks = taskList
    .filter((task) => task.status !== "completed")
    .slice(0, 3);

    const getProjectTaskCount = (projectId) =>
    taskList.filter((task) => task.project?._id === projectId).length;


    const activity = [
        ...projectList.slice(0, 2).map((project) => ({
            id: project._id,
            type: "project",
            title: `Created project "${project.name}"`,
            color: "blue",
        })),

        ...taskList.slice(0, 2).map((task) => ({
            id: task._id,
            type: "task",
            title: `Added task "${task.name}"`,
            color: "green",
        })),

        ...teamList.slice(0, 2).map((team) => ({
            id: team._id,
            type: "team",
            title: `Created team "${team.name}"`,
            color: "purple",
        })),
    ];

  return (
    <div className="space-y-10 rounded-2xl border border-slate-200 bg-white shadow-sm p-6">

      {/* Greeting */}
      <div className="flex items-center justify-between">

            <div>

                <h1 className="text-4xl font-black text-slate-900">
                    Good Afternoon 👋
                </h1>

                <p className="mt-2 text-slate-500">
                    Here's what's happening across your workspace today.
                </p>

            </div>

        </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        {stats.map((stat) => (

            <div
                key={stat.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-lg"
            >

                <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg} ${stat.text}`}
                >
                    {stat.icon}
                </div>

                <p className="mt-6 text-slate-500">
                    {stat.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                    {stat.value}
                </h2>

            </div>

        ))}

    </div>

      {/* Projects & Tasks */}
      <div className="mt-10 grid gap-8 lg:grid-cols-2">

        {/* Recent Projects */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-6 flex items-center justify-between">

                <h2 className="text-2xl font-bold">
                    Recent Projects
                </h2>

                <Link
                    to="/dashboard/projects"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                    View All
                    <FiArrowRight />
                </Link>

            </div>

            <div className="space-y-4">

                {recentProjects.map(project => (

                    <Link
                        key={project._id}
                        to={`/dashboard/projects/${project._id}`}
                        className="flex items-center justify-between rounded-xl border p-4 transition hover:border-blue-300 hover:bg-blue-50"
                    >

                        <div>

                            <h3 className="font-semibold">
                                {project.name}
                            </h3>
                                 <p className="text-sm text-slate-500">
                                    {getProjectTaskCount(project._id)} tasks
                                </p>

                        </div>

                        <FiArrowRight className="text-slate-400" />

                    </Link>

                ))}

            </div>

        </div>

        {/* Upcoming Tasks */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-6 flex items-center justify-between">

                <h2 className="text-2xl font-bold">
                    Upcoming Tasks
                </h2>

                <Link
                    to="/dashboard/tasks"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                    View All
                    <FiArrowRight />
                </Link>

            </div>

            <div className="space-y-4">

                {upcomingTasks.map(task => (

                    <Link
                        key={task._id}
                        to={`/dashboard/tasks/${task._id}`}
                        className="flex items-center justify-between rounded-xl border p-4 transition hover:border-green-300 hover:bg-green-50"
                    >

                        <div>

                            <h3 className="font-semibold">
                                {task.name}
                            </h3>

                            <p className="text-sm text-slate-500">
                                {task.status}
                            </p>

                        </div>

                        <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold
                            ${
                                task.status === "blocked"
                                    ? "bg-red-100 text-red-700"
                                    : task.status === "in-progress"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-blue-100 text-blue-700"
                            }`}
                        >
                            {task.status}
                        </span>

                    </Link>

                ))}

            </div>

        </div>

    </div>

      {/* Quick Actions */}

      {/* <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="flex items-center justify-between">

            <div>
                <h2 className="text-2xl font-bold">
                    Quick Actions
                </h2>

                <p className="mt-1 text-slate-500">
                    Jump straight into your most common tasks.
                </p>
            </div>

        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">

            <Link
                to="/dashboard/projects/create"
                className="group rounded-2xl border border-slate-200 p-6 transition hover:border-blue-300 hover:bg-blue-50 hover:shadow-md"
            >
                <div className="flex items-center justify-between">

    <div>

        <h3 className="font-semibold">
            Create Project
        </h3>

        <p className="text-sm text-slate-500">
            Start a new project
        </p>

    </div>

    <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
        <FiPlus />
    </div>

</div>

                <h3 className="mt-6 text-xl font-semibold">
                    New Project
                </h3>

                <p className="mt-2 text-slate-500">
                    Create a new project and start organizing work.
                </p>
            </Link>

            <Link
                to="/dashboard/tasks/create"
                className="group rounded-2xl border border-slate-200 p-6 transition hover:border-green-300 hover:bg-green-50 hover:shadow-md"
            >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-100 text-green-600">
                    <FiCheckSquare size={26} />
                </div>

                <h3 className="mt-6 text-xl font-semibold">
                    New Task
                </h3>

                <p className="mt-2 text-slate-500">
                    Assign work to teammates and set deadlines.
                </p>
            </Link>

            <Link
                to="/dashboard/teams/create"
                className="group rounded-2xl border border-slate-200 p-6 transition hover:border-purple-300 hover:bg-purple-50 hover:shadow-md"
            >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                    <FiUsers size={26} />
                </div>

                <h3 className="mt-6 text-xl font-semibold">
                    New Team
                </h3>

                <p className="mt-2 text-slate-500">
                    Create a team and collaborate more efficiently.
                </p>
            </Link>

        </div>

    </div> */}

    {/* Quick Actions */}

<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

    <div className="mb-6">

        <h2 className="text-2xl font-bold">
            Quick Actions
        </h2>

        <p className="mt-1 text-slate-500">
            Create new resources with one click.
        </p>

    </div>

    <div className="space-y-4">

        <Link
            to="/dashboard/projects/create"
            className="group flex items-center justify-between rounded-xl border p-4 transition hover:border-blue-300 hover:bg-blue-50"
        >

            <div className="flex items-center justify-between">

                <div className="flex items-center gap-4">

                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                        <FiFolder />
                    </div>

                    <div>
                        <h3 className="font-semibold">
                            Create Project
                        </h3>

                        <p className="text-sm text-slate-500">
                            Start a new project workspace
                        </p>
                    </div>

                </div>

                

            </div>
            <div className="rounded-lg bg-slate-100 p-2 text-slate-500 transition group-hover:bg-blue-100 group-hover:text-blue-600">
                <FiPlus />
            </div>

        </Link>

        <Link
            to="/dashboard/tasks/create"
            className="group flex items-center justify-between rounded-xl border p-4 transition hover:border-green-300 hover:bg-green-50"
        >

            <div className="flex items-center justify-between">

                <div className="flex items-center gap-4">

                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
                        <FiCheckSquare />
                    </div>

                    <div>
                        <h3 className="font-semibold">
                            Create Task
                        </h3>

                        <p className="text-sm text-slate-500">
                            Assign work to your team
                        </p>
                    </div>

                </div>

            </div>
            <div className="rounded-lg bg-slate-100 p-2 text-slate-500 transition group-hover:bg-blue-100 group-hover:text-blue-600">
                <FiPlus />
            </div>

        </Link>

        <Link
            to="/dashboard/teams/create"
            className="group flex items-center justify-between rounded-xl border p-4 transition hover:border-purple-300 hover:bg-purple-50"
        >

            <div className="flex items-center justify-between">

                <div className="flex items-center gap-4">

                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                        <FiUsers />
                    </div>

                    <div>
                        <h3 className="font-semibold">
                            Create Team
                        </h3>

                        <p className="text-sm text-slate-500">
                            Organize members into teams
                        </p>
                    </div>

                </div>

            </div>
            <div className="rounded-lg bg-slate-100 p-2 text-slate-500 transition group-hover:bg-blue-100 group-hover:text-blue-600">
                <FiPlus />
            </div>

        </Link>

    </div>

</div>

      {/* Recent Activity */}

<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

    <div className="mb-6">

        <h2 className="text-2xl font-bold">
            Recent Activity
        </h2>

        <p className="mt-1 text-slate-500">
            Latest updates across your workspace.
        </p>

    </div>

    <div className="space-y-4">

        {activity.map((item) => (

            <div
                key={`${item.type}-${item.id}`}
                className="flex items-center justify-between rounded-xl border p-4"
            >

                <div className="flex items-center gap-4">

                    <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full
                        ${
                            item.color === "blue"
                                ? "bg-blue-100 text-blue-600"
                                : item.color === "green"
                                ? "bg-green-100 text-green-600"
                                : "bg-purple-100 text-purple-600"
                        }`}
                    >

                        {item.type === "project" && <FiFolder />}

                        {item.type === "task" && <FiCheckSquare />}

                        {item.type === "team" && <FiUsers />}

                    </div>

                    <div>

                        <h3 className="font-medium">
                            {item.title}
                        </h3>

                        <p className="text-sm text-slate-500">
                            Recently added
                        </p>

                    </div>

                </div>

            </div>

        ))}

    </div>

</div>

    </div>
  );
}