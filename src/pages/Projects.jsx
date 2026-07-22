import { useLoaderData, Link, Form, useActionData, useNavigate, useNavigation, useRouteLoaderData, useParams, Outlet, useFetcher } from "react-router-dom";
import { useState, useEffect } from "react";
import { AdminOnly } from "../components/AdminGuard";
import { calcDueDate } from "../api/calculateDueDate";
import { Modal, ModalBody, ModalHeader, ModalFooter } from "../components/Modal";
import { toast } from "react-toastify";
import { DeleteButton } from "../components/DeleteButton.jsx";
import StatCard from "../components/StatCard.jsx"
import {
    FiArrowLeft,
    FiUsers,
    FiClipboard,
    FiCheckCircle,
} from "react-icons/fi";


export function ProjectSection() {
    const navigate = useNavigate();
    const fetcher = useFetcher();
    const { projects } = useRouteLoaderData("root");
    const projectsData = projects?.projects || []; 

    const [ filterTag, setFilterTag ] = useState("");
    console.log(filterTag);

    const results = projectsData.filter(p => p.tags === filterTag);
    const filteredData = (results && results.length > 0) ? results : projectsData;

    console.log("filteredData: ",filteredData);

    return (
        
            <div className="space-y-10 rounded-2xl border border-slate-200 bg-white shadow-sm p-6">  
                {/* Header Section */}
                <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                    <div>
                        {/* <h1 className="text-4xl font-bold text-slate-900">
                            Projects
                        </h1> */}

                        <p className="mt-2 text-slate-500">
                            Organize, manage, and track all of your projects in one place.
                        </p>

                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <select 
                            name="filter" 
                            className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            onChange={(e)=>{setFilterTag(e.target.value)}}
                        >
                            <option value="">All Projects</option>
                            <option value={"to-do"}>To Do</option>                   
                            <option value={"in-progress"}>In progress</option>                    
                            <option value={"completed"}>Completed</option>                    
                            <option value={"blocked"}>Blocked</option>
                        </select>
                            <Link 
                                to="/dashboard/projects/create" 
                                className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
                            >
                                + New Project
                            </Link>               
                    </div>
                </div>

                {/* Card Grid Layout */}
                {filteredData.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredData.map((project, index) => (
                            <div 
                                onClick={() => navigate(`/dashboard/projects/${project._id}`)}
                                key={project._id || index} 
                                className="flex cursor-pointer flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"
                            >
                                <div>

                                    <div className="flex items-start justify-between">

                                        <div>

                                            <h3 className="text-xl font-bold text-slate-900">
                                                {project.name}
                                            </h3>

                                            <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                                                {project.description || "No description provided."}
                                            </p>

                                        </div>

                                        <div className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                                            Project
                                        </div>

                                        </div>

                                        <div className="mt-6 flex items-center justify-between text-sm">

                                            {/* <span className="text-slate-500">
                                                Status
                                            </span>

                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold
                                                    ${
                                                        project.tags === "completed"
                                                            ? "bg-green-100 text-green-700"
                                                            : project.tags === "blocked"
                                                            ? "bg-red-100 text-red-700"
                                                            : project.tags === "in-progress"
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : "bg-blue-100 text-blue-700"
                                                    }`}
                                            >
                                                {project.tags}
                                            </span> */}

                                        </div>

                                    </div>

                                {/* Action Buttons */}
                                <AdminOnly>
                                    <div
                                        onClick={(e) => e.stopPropagation()}
                                        className="mt-8 flex justify-end gap-3 border-t border-slate-100 pt-5"
                                    >

                                        <button
                                            onClick={() => navigate(`/dashboard/projects/${project._id}/edit`)}
                                            className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-100"
                                        >
                                            Edit
                                        </button>

                                        <DeleteButton
                                            id={project._id}
                                            action="/dashboard/projects"
                                        />

                                    </div>
                                </AdminOnly>
                            </div>
                        ))}
                        <div>
                            <Outlet />
                        </div>
                    </div>
                    ):(
                    /* Empty State */
                        <div className="text-center py-20">
                            <p className="text-gray-500">No projects found. Create one to get started!</p>
                        </div>
                    )
                }
           </div>
    );
}

export function ProjectManagement() {
    const navigate = useNavigate();
    const { project } = useLoaderData();

    const { tasks, tags } = useRouteLoaderData("root");

    const projectId = project._id;

    const tasksOnProject = (tasks.tasks || []).filter(t => t.project?._id === projectId);

    const memberCount = new Set(
        tasksOnProject.flatMap(
            task => task.owners?.map(owner => owner._id) || []
        )
    ).size;

    const completedTasks = tasksOnProject.filter(
        task => task.status === "completed"
    ).length;

    return (
        <div className="space-y-10 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="min-h-screen">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* headers */}
                <div className="mb-8">

                    <button
                        onClick={() => navigate("/dashboard/projects")}
                        className="mb-6 flex items-center gap-2 text-slate-500 hover:text-blue-600"
                    >
                        <FiArrowLeft />
                        Back to Projects
                    </button>

                    <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">

                        <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">

                            <div>

                                <h1 className="text-4xl font-bold">
                                    {project.name}
                                </h1>

                                <p className="mt-3 max-w-2xl text-blue-100">
                                    {project.description}
                                </p>

                            </div>

                            <AdminOnly>

                                <button
                                    onClick={() =>
                                        navigate(`/dashboard/projects/${project._id}/edit`)
                                    }
                                    className="rounded-xl bg-white px-6 py-3 font-semibold text-blue-700 transition hover:bg-blue-50"
                                >
                                    Edit Project
                                </button>

                            </AdminOnly>

                        </div>

                    </div>

                </div>

                {/* stats */}

                <div className="mb-8 grid gap-6 md:grid-cols-3">

                    <StatCard
                        icon={FiClipboard}
                        title="Tasks"
                        value={tasksOnProject.length}
                        iconColor="text-green-600"
                        iconBg="bg-green-50"
                    />

                    <StatCard
                        icon={FiUsers}
                        title="Members"
                        value={memberCount}
                        iconColor="text-blue-600"
                        iconBg="bg-blue-50"
                    />

                    <StatCard
                        icon={FiCheckCircle}
                        title="Completed"
                        value={completedTasks}
                        iconColor="text-emerald-600"
                        iconBg="bg-emerald-50"
                    />

                </div>

                <div>
                    {/* TASKS SECTION */}
                        <div className="mt-10">
                            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">
                                        Project Tasks
                                    </h2>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Tasks currently assigned to this project.
                                    </p>
                                </div>

                                <span className="self-start rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
                                    {tasksOnProject.length} {tasksOnProject.length === 1 ? "Task" : "Tasks"}
                                </span>
                            </div>

                            {tasksOnProject.length > 0 ? (
                                <div className="space-y-6">
                                    {tasksOnProject.map((task) => (
                                        <div
                                            key={task._id}
                                            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
                                        >
                                            {/* Header */}
                                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                                <div>
                                                    <h3 className="text-xl font-semibold text-slate-900">
                                                        {task.name}
                                                    </h3>

                                                    <p className="mt-1 text-sm text-slate-500">
                                                        {task.team?.name || "No team assigned"}
                                                    </p>

                                                    {/* Tags */}
                                                    <div className="mt-4 flex flex-wrap gap-2">
                                                        {task.tags?.length > 0 ? (
                                                            task.tags.map((tagId) => {
                                                                const tag = tags.tags.find(
                                                                    (t) => t._id === tagId
                                                                );

                                                                return tag ? (
                                                                    <span
                                                                        key={tagId}
                                                                        className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                                                                    >
                                                                        {tag.name}
                                                                    </span>
                                                                ) : null;
                                                            })
                                                        ) : (
                                                            <span className="text-xs text-slate-400">
                                                                No Tags
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <span
                                                    className={`rounded-full px-4 py-2 text-xs font-semibold capitalize ${
                                                        task.status === "completed"
                                                            ? "bg-green-100 text-green-700"
                                                            : task.status === "in-progress"
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : "bg-slate-100 text-slate-700"
                                                    }`}
                                                >
                                                    {task.status}
                                                </span>
                                            </div>

                                            {/* Information */}
                                            <div className="mt-8 grid gap-6 md:grid-cols-2">
                                                <div>
                                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                        Owners
                                                    </p>

                                                    <p className="mt-2 text-slate-700">
                                                        {task.owners?.length > 0
                                                            ? task.owners
                                                                .map((owner) => owner.name)
                                                                .join(", ")
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
                                            </div>

                                            {/* Actions */}
                                            <AdminOnly>
                                                <div className="mt-8 flex justify-end">
                                                    <button
                                                        onClick={() =>
                                                            navigate(
                                                                `/dashboard/tasks/${task._id}/edit`
                                                            )
                                                        }
                                                        className="rounded-lg bg-blue-50 px-5 py-2 font-medium text-blue-600 transition hover:bg-blue-100"
                                                    >
                                                        Edit Task
                                                    </button>
                                                </div>
                                            </AdminOnly>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center">
                                    <h3 className="text-lg font-semibold text-slate-700">
                                        No tasks assigned
                                    </h3>

                                    <p className="mt-2 text-slate-500">
                                        This project doesn't have any tasks assigned yet.
                                    </p>
                                </div>
                            )}
                        </div>
                </div>
            </div>
        </div>
        </div>
    );
}


export function ProjectForm(){

    const {id} = useParams();
    const navigate = useNavigate();
    const fetcher = useFetcher();
    const isSubmitting = fetcher.state === "submitting";

    console.log(fetcher.data)

    useEffect(()=>{
        if(fetcher.data?.success){
            toast.success(fetcher.data.message);
            const timer = setTimeout(()=>{
                navigate('/dashboard/projects')
            }, 500);

            return ()=> clearTimeout(timer);
        }
        if (fetcher.data?.error) {
            toast.error(fetcher.data.message);
        }
    }, [fetcher.data, navigate]);

    console.log("id: ", id);

    const isEdit = !!id;
    console.log("isEdit: ", isEdit);

    const project  = useLoaderData();

    console.log("project:  ",project);

    const projectToUpdate = project?.project || [];
    console.log("projectToUpdate:  ", projectToUpdate);

    const [formData, setFormData] = useState({
        id: id ?? "",
        name: projectToUpdate?.name ?? "",
        description: projectToUpdate?.description ?? "",
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
            <Modal onClose={()=>navigate("/dashboard/projects")}>
            <fetcher.Form
                method="post"
                action="/dashboard/projects"
                className="flex h-full flex-col"
            >
                <ModalHeader
                            title={isEdit ? "Edit Project" : "Create Project"}
                            description="Create a new task and assign it to a project and team."
                        />
                            <ModalBody>
                            <div>
                                    <label
                                        htmlFor="name"
                                        className="mb-2 block text-sm font-medium text-slate-700"
                                    >
                                        Project Name
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Website Redesign"
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="description"
                                        className="mb-2 block text-sm font-medium text-slate-700"
                                    >
                                        Description
                                    </label>

                                    <textarea
                                        name="description"
                                        id="description"
                                        rows={4}
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                        placeholder="Describe the project..."
                                        className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                    />
                                </div>
                                </ModalBody>

                            <ModalFooter
                                onCancel={() => navigate("/dashboard/projects")}
                                isSubmitting={isSubmitting}
                                isEdit={isEdit}
                                createLabel="Create Projects"
                            />
                    </fetcher.Form>
            </Modal>
        </>
    )
}