import { useLoaderData, Link, Form, useNavigate, useRouteLoaderData, useParams, useFetcher, Outlet} from "react-router-dom";
import { useEffect, useState } from "react";
import { calcDueDate } from "../api/calculateDueDate";
import { AdminOnly } from "../components/AdminGuard";
import { Modal, ModalBody, ModalHeader, ModalFooter } from "../components/Modal";
import { toast } from "react-toastify";
import { DeleteButton } from "../components/DeleteButton.jsx";
import {
    FiArrowLeft,
    FiUsers,
    FiClipboard,
    FiCheckCircle,
} from "react-icons/fi";

export function TaskSection(){

    const { tasks } = useRouteLoaderData("root");
    const tasksData = tasks.tasks || [];
    console.log("tasksData ", tasksData);

    const navigate = useNavigate();
    const [ filterTag, setFilterTag ] = useState("");
    const [query, setQuery] = useState("");

    console.log(filterTag);

    const results = tasksData.filter(t=>t.status === filterTag);
    console.log("results ",results);

    const filteredData = tasksData.filter(task => {

            const matchesStatus =
                !filterTag || task.status === filterTag;

            const matchesSearch =
                task.name.toLowerCase().includes(query.toLowerCase());

            return matchesStatus && matchesSearch;

        });

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            {/* Header */}

            <div className="mb-8">

                <p className="mt-2 text-slate-500">
                    Track work, assign teammates, and monitor progress.
                </p>

            </div>

            {/* Toolbar */}

            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

                    {/* Search */}

                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search tasks..."
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 lg:w-96"
                    />

                    {/* Filter */}

                    <select
                        value={filterTag}
                        onChange={(e) => setFilterTag(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-52"
                    >
                        <option value="">All Status</option>
                        <option value="to-do">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="blocked">Blocked</option>
                    </select>

                </div>

                <Link
                    to="/dashboard/tasks/create"
                    className="rounded-xl bg-blue-600 px-6 py-3 text-center font-medium text-white shadow-sm transition hover:bg-blue-700"
                >
                    + New Task
                </Link>

            </div>

            {/* Table */}

            <div className="overflow-hidden rounded-2xl border border-slate-200">

                <div className="overflow-x-auto">

                    <table className="min-w-full">

                        <thead className="bg-slate-50">

                            <tr>

                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    #
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Task
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Owners
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Status
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Due Date
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Actions
                                </th>

                            </tr>

                        </thead>

                        <tbody className="divide-y divide-slate-100 bg-white">

                            {filteredData.map((task, index) => (

                                <tr
                                    key={task._id}
                                    onClick={() => navigate(`/dashboard/tasks/${task._id}`)}
                                    className="cursor-pointer transition hover:bg-slate-50"
                                >

                                    <td className="px-6 py-5 text-sm text-slate-600">
                                        {index + 1}
                                    </td>

                                    <td className="px-6 py-5">

                                        <div>

                                            <p className="font-semibold text-slate-900">
                                                {task.name}
                                            </p>

                                            <p className="text-sm text-slate-500">
                                                {task.project?.name || "No Project"}
                                            </p>

                                        </div>

                                    </td>

                                    <td className="px-6 py-5">

                                        <div className="flex -space-x-2">

                                            {(task.owners || []).map(owner => (

                                                <div
                                                    key={owner._id}
                                                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-xs font-bold text-white"
                                                    title={owner.name}
                                                >
                                                    {owner.name.charAt(0)}
                                                </div>

                                            ))}

                                        </div>

                                    </td>

                                    <td className="px-6 py-5">

                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold
                                            ${
                                                task.status === "completed"
                                                    ? "bg-green-100 text-green-700"
                                                    : task.status === "in-progress"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : task.status === "blocked"
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-blue-100 text-blue-700"
                                            }`}
                                        >
                                            {task.status}
                                        </span>

                                    </td>

                                    <td className="px-6 py-5 text-sm text-slate-600">
                                        {calcDueDate(task.timeToComplete)}
                                    </td>

                                    <td
                                        className="px-3 py-5"
                                        onClick={(e) => e.stopPropagation()}
                                    >

                                        <div className="flex items-center justify-start gap-2">

                                        <button
                                            onClick={() => navigate(`/dashboard/tasks/${task._id}/edit`)}
                                            className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-100"
                                        >
                                            Edit
                                        </button>

                                        <DeleteButton
                                            id={task._id}
                                            action="/dashboard/tasks"
                                        />

                                    </div>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

            <Outlet />

        </div>
    );
};

export function TaskManagement() {
    const navigate = useNavigate();
    const loaderData = useLoaderData();
    const task = loaderData.tasks || {};

    const { tags } = useRouteLoaderData("root");

    return (
        <div className="space-y-10 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="min-h-screen">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 flex items-center gap-2 text-slate-500 hover:text-blue-600"
                >
                    <FiArrowLeft />
                    Back to Tasks
                </button>

                <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">

                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

                        <div>

                            <h1 className="text-4xl font-bold">
                                {task.name}
                            </h1>

                            <p className="mt-3 max-w-2xl text-blue-100">
                                {task.project?.name || "No project assigned"}
                            </p>

                            {/* Tags */}
                            <div className="mt-4 flex flex-wrap gap-2">
                                {task.tags?.length > 0 ? (
                                    task.tags.map((tagId) => {
                                        const tag = tags.tags.find((t) => t._id === tagId);
                                        return tag ? (
                                            <span
                                                key={tagId}
                                                className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white"
                                            >
                                                {tag.name}
                                            </span>
                                        ) : null;
                                    })
                                ) : (
                                    <span className="text-xs text-blue-100">No Tags</span>
                                )}
                            </div>

                        </div>

                        <div className="flex flex-col items-start gap-4 lg:items-end">

                            <span
                                className={`rounded-full px-4 py-2 text-xs font-semibold capitalize ${
                                    task.status === "completed"
                                        ? "bg-green-100 text-green-700"
                                        : task.status === "in-progress"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-white text-slate-700"
                                }`}
                            >
                                {task.status || "N/A"}
                            </span>

                            <AdminOnly>
                                <button
                                    onClick={() => navigate(`/dashboard/tasks/${task._id}/edit`)}
                                    className="rounded-xl bg-white px-6 py-3 font-semibold text-blue-700 transition hover:bg-blue-50"
                                >
                                    Edit Task
                                </button>
                            </AdminOnly>

                        </div>

                    </div>

                </div>

                {/* details card */}
                <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                    <div className="grid gap-6 md:grid-cols-2">

                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Owners
                            </p>
                            <p className="mt-2 text-slate-700">
                                {task.owners?.length > 0
                                    ? task.owners.map(o => o.name ?? o).join(", ")
                                    : "No owners assigned"}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Due Date
                            </p>
                            <p className="mt-2 text-slate-700">
                                {calcDueDate(task.timeToComplete)}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Project
                            </p>
                            <p className="mt-2 text-slate-700">
                                {task.project?.name || "No project assigned"}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Team
                            </p>
                            <p className="mt-2 text-slate-700">
                                {task.team?.name || "No team assigned"}
                            </p>
                        </div>

                    </div>

                </div>

            </div>
        </div>
        </div>
    );
}

export function TaskForm(){
    const { id } = useParams();

    console.log("id: ", id);

    const isEdit = !!id;

    const fetcher = useFetcher();
    
    const navigate = useNavigate();

    const loaderData = useLoaderData() || {};
    const editTask = loaderData.tasks;
 
    const isSubmitting = fetcher.state === "submitting";
    
    console.log("loaderData:", loaderData);

    useEffect(()=>{
        if(fetcher.data?.success){
            toast.success(fetcher.data.message);
            const timer = setTimeout(()=>{
                navigate("/dashboard/tasks");
            }, 1500);
            
            return ()=>clearTimeout(timer);
        }
        if (fetcher.data?.error) {
            toast.error(fetcher.data.message);
        }        
    },[fetcher.data, navigate]);

    console.log("Tasks: ", editTask);    

    const { projects, tasks, teams, users, tags } = useRouteLoaderData("root");

    const [formData, setFormData] = useState({
        id: id ?? "",
        name: editTask?.name ?? "",
        project: editTask?.project?._id ?? "",
        owners: (editTask?.owners || []).map(o => typeof o === 'object' ? o._id : o) ?? [],
        team: editTask?.team?._id ?? "",
        tags: (editTask?.tags || []).map(t => typeof t === 'object' ? t._id : t) ?? [],
        timeToComplete: editTask?.timeToComplete ?? "",
        status: editTask?.status ?? "",
    });

    const handleChange = (e) =>{
        const {name, value} = e.target;

        setFormData((prev)=>({
            ...prev,
            [name]: value,
        }));
    };

    return(
        <>
            <Modal onClose={() => navigate("/dashboard/tasks")}>
                <fetcher.Form
                    method="post"
                    action="/dashboard/tasks"
                    className="flex h-full flex-col min-h-0"
                >
                    {/* <div className="max-h-[85vh] overflow-y-auto rounded-2xl bg-white"> */}

                        {/* Header */}
                        <ModalHeader
                            title={isEdit ? "Edit Task" : "Create Task"}
                            description="Create a new task and assign it to a project and team."
                        />
                            {/* Project */}
                            <ModalBody>
                                {/* Task Name */}
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="mb-2 block text-sm font-medium text-slate-700"
                                    >
                                        Task Name
                                    </label>

                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Authentication API"
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                                    />
                                </div>
                                <div>
                                <label
                                    htmlFor="project"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Project
                                </label>

                                <select
                                    id="project"
                                    name="project"
                                    value={formData.project}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                                >
                                    <option value="">Select Project</option>

                                    {projects?.projects?.map((project) => (
                                        <option key={project._id} value={project._id}>
                                            {project.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Team */}
                            <div>
                                <label
                                    htmlFor="team"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Team
                                </label>

                                <select
                                    id="team"
                                    name="team"
                                    value={formData.team}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                                >
                                    <option value="">Select Team</option>

                                    {teams?.teams?.map((team) => (
                                        <option key={team._id} value={team._id}>
                                            {team.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Status */}
                            <div>
                                <label
                                    htmlFor="status"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Status
                                </label>

                                <select
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                                >
                                    <option value="">Select Status</option>
                                    <option value="to-do">To Do</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                    <option value="blocked">Blocked</option>
                                </select>
                            </div>

                            {/* Owners */}
                            <div>
                                <label
                                    htmlFor="owners"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Owners
                                </label>

                                <select
                                    multiple
                                    id="owners"
                                    name="owners"
                                    value={formData.owners}
                                    required
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            owners: [...e.target.selectedOptions].map(
                                                (o) => o.value
                                            ),
                                        })
                                    }
                                    className="h-36 w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                                >
                                    {users?.users?.map((owner) => (
                                        <option key={owner._id} value={owner._id}>
                                            {owner.name}
                                        </option>
                                    ))}
                                </select>

                                <p className="mt-2 text-xs text-slate-400">
                                    Hold Ctrl (Windows) or Cmd (Mac) to select multiple.
                                </p>
                            </div>

                            {/* Tags */}
                            <div>
                                <label
                                    htmlFor="tags"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Tags
                                </label>

                                <select
                                    multiple
                                    id="tags"
                                    name="tags"
                                    value={formData.tags}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            tags: [...e.target.selectedOptions].map(
                                                (t) => t.value
                                            ),
                                        })
                                    }
                                    required
                                    className="h-36 w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                                >
                                    {tags?.tags?.map((tag) => (
                                        <option key={tag._id} value={tag._id}>
                                            {tag.name}
                                        </option>
                                    ))}
                                </select>

                                <p className="mt-2 text-xs text-slate-400">
                                    Hold Ctrl (Windows) or Cmd (Mac) to select multiple.
                                </p>
                            </div>

                            {/* Time */}
                            <div>
                                <label
                                    htmlFor="timeToComplete"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Estimated Duration (Days)
                                </label>

                                <input
                                    id="timeToComplete"
                                    name="timeToComplete"
                                    type="number"
                                    min="1"
                                    value={formData.timeToComplete}
                                    onChange={handleChange}
                                    placeholder="5"
                                    required
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                                />
                            </div>

                            {isEdit && (
                            <input
                                type="hidden"
                                name="id"
                                value={id}
                            />
                        )}
                        </ModalBody>

                        {/* Footer */}
                        <ModalFooter
                            onCancel={() => navigate("/dashboard/tasks")}
                            isSubmitting={isSubmitting}
                            isEdit={isEdit}
                            createLabel="Create Task"
                        />

                </fetcher.Form>
            </Modal>          
        </>
    )
}