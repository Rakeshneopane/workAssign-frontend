import { 
    useLoaderData, 
    Link, 
    Form, 
    useActionData, 
    useNavigate, 
    useRouteLoaderData, 
    useParams, 
    useFetcher, 
    Outlet 
} from "react-router-dom";
import StatCard from "../components/StatCard.jsx"
import {
    FiUsers,
    FiClipboard,
    FiCheckCircle,
    FiArrowLeft,
} from "react-icons/fi";

// import {
//     Link,
//     useNavigate,
//     useRouteLoaderData,
//     useFetcher,
//     Outlet,
// } from "react-router-dom";

import { useState, useEffect } from "react";
import { AdminOnly } from "../components/AdminGuard";
import { calcDueDate } from "../api/calculateDueDate";
import { Modal, ModalBody, ModalHeader, ModalFooter } from "../components/Modal";
import { toast } from "react-toastify";
import { DeleteButton } from "../components/DeleteButton";

export function TeamSection() {
    const { teams, tasks } = useRouteLoaderData("root");

    //console.log("teams: ",teams);

    const navigate = useNavigate();

    const [query, setQuery] = useState("");

    // const fetcher = useFetcher();

    // const deletingId = fetcher.state === "submitting" 
    // && fetcher.formData?.get("intent") === "delete"
    // ? fetcher.formData?.get("id")
    // : null;

    // useEffect(()=>{
    //     if(fetcher.data?.success){
    //         toast.success(fetcher.data.message);
    //         const timer = setTimeout(()=>{
    //             navigate('/teams')
    //         }, 500);

    //         return ()=> clearTimeout(timer);
    //     }
    //     if (fetcher.data?.error) {
    //         toast.error(fetcher.data.message);
    //     }
    // }, [fetcher.data, navigate]);

    const filteredTeams = teams?.teams.filter((team) => {
        const search = query.toLowerCase().trim();

        return (
            team.name.toLowerCase().includes(search) ||
            team.description?.toLowerCase().includes(search)
        );
    });
    return (
            <div className="space-y-10 rounded-2xl border border-slate-200 bg-white shadow-sm p-6">  
                
                {/* Header Section */}
                <div className="mb-8">

                    {/* <h1 className="text-4xl font-bold text-slate-900">
                        Teams
                    </h1> */}

                    <p className="mt-2 text-slate-500">
                        Manage your teams and collaborate efficiently.
                    </p>

                </div>

                <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search teams..."
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 lg:w-96"
                    />

                    <Link
                        to="/dashboard/teams/create"
                        className="rounded-xl bg-blue-600 px-6 py-3 text-center font-medium text-white shadow-sm transition hover:bg-blue-700"
                    >
                        + New Team
                    </Link>

                </div>

                {/* Card Grid Layout */}
                {filteredTeams && filteredTeams.length > 0? (
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredTeams?.map((team, index) => {
                                const teamTasks = tasks.tasks.filter(
                                    task => task.team?._id === team._id
                                );

                                const memberCount = new Set(
                                    teamTasks.flatMap(
                                        task => task.owners?.map(owner => owner._id) || []
                                    )
                                ).size;
                                return (
                                <div 
                                    key={team._id || index} 
                                    className="rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow flex flex-col justify-between"
                                    onClick={()=>navigate(`/dashboard/teams/${team._id}`)}
                                >
                                    <div>

                                        <h3 className="text-xl font-semibold text-slate-900">
                                            {team.name}
                                        </h3>

                                        <p className="mt-2 text-sm text-slate-500">
                                            {team.description || "No description provided."}
                                        </p>

                                        <div className="mt-6 space-y-3">

                                            <div className="flex items-center gap-2 text-slate-600">

                                                <FiUsers className="text-blue-600" />

                                                <span>{memberCount} Members</span>

                                            </div>

                                            <div className="flex items-center gap-2 text-slate-600">

                                                <FiClipboard className="text-green-600" />

                                                <span>{teamTasks.length} Tasks</span>

                                            </div>

                                        </div>

                                    </div>

                                    {/* Action Buttons */}
                                    <AdminOnly>
                                        <div 
                                            className="mt-6 flex items-center justify-end gap-2 border-t border-slate-200 pt-4"
                                            //className="mt-6 pt-4 border-t border-gray-100 flex justify-end gap-4"
                                            onClick={(e)=>e.stopPropagation()}    
                                        >
                                            <button 
                                                intent="update"
                                                className="text-blue-500 hover:text-blue-700 font-medium text-sm"
                                                onClick={()=>navigate(`/dashboard/teams/${team._id}/edit`)}
                                            >
                                                Edit
                                            </button>
                                            <DeleteButton id={team._id} action="/dashboard/teams" />
                                            
                                        </div>
                                    </AdminOnly>                                
                                </div>
                            )})}
                            <Outlet />
                        </div>
                    </div>
                    ):(
                    /* Empty State */
                        <div className="py-20 text-center">
                            {query ? (
                                <p className="text-slate-500">
                                    No teams match "<span className="font-medium">{query}</span>".
                                </p>
                            ) : (
                                <p className="text-slate-500">
                                    No teams found. Create one to get started!
                                </p>
                            )}
                        </div>
                    )
                }
        </div>
    );
}

export function TeamManagement() {
    const navigate = useNavigate();
    const loaderData = useLoaderData();
    const { tasks, tags } = useRouteLoaderData("root");

    const team = loaderData.teams || [];

    console.log("Team:", team);

    const tasksOnTeam = tasks.tasks.filter(
        (t) => t.team?._id === team._id
    );

    const memberCount = new Set(
        tasksOnTeam.flatMap(
            task => task.owners?.map(owner => owner._id) || []
        )
    ).size;

    const completedTasks = tasksOnTeam.filter(
        task => task.status === "completed"
    ).length;

    //console.log("Tasks on team:", tasksOnTeam);

    return (
        <div className="space-y-10 rounded-2xl border border-slate-200 bg-white shadow-sm"> 
        <div className="min-h-screen">
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* headers */}
                <div className="mb-8">

                    <button
                        onClick={() => navigate(-1)}
                        className="mb-6 flex items-center gap-2 text-slate-500 hover:text-blue-600"
                    >
                        <FiArrowLeft />
                        Back to Teams
                    </button>

                    <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">

                        <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">

                            <div>

                                <h1 className="text-4xl font-bold">
                                    {team.name}
                                </h1>

                                <p className="mt-3 max-w-2xl text-blue-100">
                                    {team.description}
                                </p>

                            </div>

                            <AdminOnly>

                                <button
                                    onClick={() =>
                                        navigate(`/dashboard/teams/${team._id}/edit`)
                                    }
                                    className="rounded-xl bg-white px-6 py-3 font-semibold text-blue-700 transition hover:bg-blue-50"
                                >
                                    Edit Team
                                </button>

                            </AdminOnly>

                        </div>

                    </div>

                </div>

                {/* stats */}

                <div className="mb-8 grid gap-6 md:grid-cols-3">

                    <StatCard
                        icon={FiUsers}
                        title="Members"
                        value={memberCount}
                        iconColor="text-blue-600"
                        iconBg="bg-blue-50"
                    />

                    <StatCard
                        icon={FiClipboard}
                        title="Tasks"
                        value={tasksOnTeam.length}
                        iconColor="text-green-600"
                        iconBg="bg-green-50"
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
                                        Assigned Tasks
                                    </h2>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Tasks currently assigned to this team.
                                    </p>
                                </div>

                                <span className="self-start rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
                                    {tasksOnTeam.length} {tasksOnTeam.length === 1 ? "Task" : "Tasks"}
                                </span>
                            </div>

                            {tasksOnTeam.length > 0 ? (
                                <div className="space-y-6">
                                    {tasksOnTeam.map((task) => (
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
                                                        {task.project?.name || "No project assigned"}
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
                                        This team doesn't have any tasks assigned yet.
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

export function TeamForm(){

    const {id} = useParams();
    const navigate = useNavigate();

    const isEdit = !!id;

    const loaderData = useLoaderData();

    const fetcher = useFetcher();
    
    const isSubmitting = fetcher.state === "submitting";

    console.log(fetcher.data)

    useEffect(()=>{
        if(fetcher.data?.success){
            toast.success(fetcher.data.message);
            const timer = setTimeout(()=>{
                navigate('/dashboard/teams')
            }, 500);

            return ()=> clearTimeout(timer);
        }
        if (fetcher.data?.error) {
            toast.error(fetcher.data.message);
        }
    }, [fetcher.data, navigate]);

    console.log("Team: ", loaderData, "id: ", id);

    const teamToUpdate = isEdit ? loaderData?.teams : null;

    console.log("teamToUpdate: ", teamToUpdate);

    const [formData, setFormData] = useState({
        id: id ?? "",
        name: teamToUpdate?.name ?? "",
        description: teamToUpdate?.description ??  "",
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
            <Modal onClose={() => navigate("/dashboard/teams")}>
                <fetcher.Form
                    method="post"
                    action="/dashboard/teams"
                    className="flex h-full flex-col min-h-0"
                >

                        {/* Header */}
                        <ModalHeader
                            title={isEdit ? "Edit Team" : "Create Team"}
                            description={
                                isEdit
                                    ? "Update your team's information."
                                    : "Create a new team to organize work."
                            }
                        />

                        {/* Team Name */}
                        <ModalBody>
                        <div className="mb-6">
                            <label
                                htmlFor="name"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Team Name
                            </label>

                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="e.g. Backend Team"
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            />
                        </div>

                        {/* Description */}
                        <div className="mb-8">
                            <label
                                htmlFor="description"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Description
                            </label>

                            <textarea
                                id="description"
                                name="description"
                                rows={4}
                                value={formData.description}
                                onChange={handleChange}
                                required
                                placeholder="Describe the team's purpose..."
                                className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
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
                        <ModalFooter
                            onCancel={() => navigate("/dashboard/teams")}
                            isSubmitting={isSubmitting}
                            isEdit={isEdit}
                            createLabel="Create Team"
                        />
                </fetcher.Form>
            </Modal>   
        </>
    )
}