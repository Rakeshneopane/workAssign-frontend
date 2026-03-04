import { useLoaderData, Link, Form, useActionData, useNavigate, useRouteLoaderData, useParams } from "react-router-dom";
import { useState } from "react";
import { AdminOnly } from "../components/AdminGuard";
import { calcDueDate } from "../api/calculateDueDate";

export function TeamSection() {
    const { teams } = useRouteLoaderData("root");
    console.log("teams: ",teams);

    const navigate = useNavigate();

    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                
                {/* Header Section */}
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-3xl font-bold text-blue-600">My Teams</h1>
                    <div className="flex items-center gap-4">
                        <Link 
                            to="/team/create" 
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-md"
                        >
                            + New Team
                        </Link>
                    </div>
                </div>

                {/* Card Grid Layout */}
                {!teams || teams.teams.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {teams?.teams.map((team, index) => (
                            <div 
                                key={team._id || index} 
                                className="bg-gray-100 rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow flex flex-col justify-between"
                                onClick={()=>navigate(`/team/${team._id}`)}
                            >
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        {team.name}
                                    </h3>
                                    <p className="text-gray-600 text-sm line-clamp-3">
                                        {team.description || "No description provided for this project."}
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <AdminOnly>
                                    <div 
                                        className="mt-6 pt-4 border-t border-gray-100 flex justify-end gap-4"
                                        onClick={(e)=>e.stopPropagation()}    
                                    >
                                        <button 
                                            intent="update"
                                            className="text-blue-500 hover:text-blue-700 font-medium text-sm"
                                            onClick={()=>navigate(`/team/${team._id}/edit`)}
                                        >
                                            Edit
                                        </button>
                                        <Form method="post" action="/teams" onClick={(e)=>e.stopPropagation()}>
                                            <input type="hidden" name="id" value={team._id} />
                                            <button 
                                                type="submit"
                                                name="intent"
                                                value={"delete"}
                                                className="text-red-500 hover:text-red-700 font-medium text-sm"
                                            >
                                            Delete
                                        </button>
                                        </Form>
                                        
                                    </div>
                                </AdminOnly>                                
                            </div>
                        ))}
                    </div>
                    ):(
                    /* Empty State */
                        <div className="text-center py-20">
                            <p className="text-gray-500">No team found. Create one to get started!</p>
                        </div>
                    )
                }
            </div>
        </div>
    );
}

export function TeamManagement() {
    const navigate = useNavigate();
    const loaderData = useLoaderData();
    const { tasks } = useRouteLoaderData("root");

    const team = loaderData.teams;

    console.log("Team:", team);

    const tasksOnTeam = tasks.tasks.filter(
        (t) => t.team?._id === team._id
    );

    console.log("Tasks on team:", tasksOnTeam);

    return (
        <div className="p-6 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <h1 className="text-3xl font-bold text-blue-600">
                    Team Management
                </h1>

                <div className="bg-gray-300 border border-gray-200 rounded-xl p-4 mt-4">

                    {/* TEAM DETAILS */}
                    {team && (
                        <div className="mt-4">
                            <h2>
                                <span className="font-bold">Team Name: </span>
                                {team.name}
                            </h2>

                            <p>
                                <span className="font-bold">Description: </span>
                                {team.description}
                            </p>

                            <AdminOnly>
                                <button
                                    onClick={() => navigate(`/team/${team._id}/edit`)}
                                    className="mt-4 text-blue-800 text-xl font-bold"
                                >
                                    Edit Team
                                </button>
                            </AdminOnly>
                        </div>
                    )}
                    
                    {tasksOnTeam.length > 0 ? (
                        <>
                            {tasksOnTeam.map((t, index) => (
                                <div
                                    key={t._id}
                                    className="bg-gray-100 border border-gray-200 sm:px-6 lg:px-8 py-4 shadow rounded-xl mt-4"
                                >
                                    <p>
                                        <span className="font-bold">
                                            Task #{index + 1}:
                                        </span>{" "}
                                        {t.name}
                                    </p>

                                    <p>
                                        <span className="font-bold">Tag: </span>
                                        {t.tags}
                                    </p>

                                    <p>
                                        <span className="font-bold">Owners: </span>
                                        {t.owners.length > 0
                                            ? t.owners.join(", ")
                                            : "No owners yet"}
                                    </p>

                                    <p>
                                        <span className="font-bold">Project: </span>
                                        {t.project?.name}
                                    </p>

                                    <p>
                                        <span className="font-bold">Due Date: </span>
                                        {calcDueDate(t.timeToComplete)}
                                    </p>

                                    <AdminOnly>
                                        <button
                                            className="text-blue-800 font-bold"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                navigate(`/tasks/${t._id}/edit`);
                                            }}
                                        >
                                            Edit Task
                                        </button>
                                    </AdminOnly>
                                </div>
                            ))}
                        </>
                    ) : (
                        <div className="bg-gray-100 border border-gray-200 sm:px-6 lg:px-8 py-4 shadow rounded-xl mt-4">
                            <h2>No tasks assigned to this team yet.</h2>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export function Teams(){
    return(
        <>
        <TeamSection />
        </>
    )
}


export function TeamForm(){

    const {id} = useParams();

    const isEdit = !!id;

    const team = useLoaderData();

    console.log("Team: ", team, "id: ", id);

    const teamToUpdate = team?.teams

    console.log("teamToUpdate: ", teamToUpdate);

    const [formData, setFormData] = useState({
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
            <Form method="post" className="container mx-auto p-4 md:p-8">
                <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
                    <label 
                        htmlFor="name" 
                        className="block text-gray-700"
                    >
                        Team Name:
                    </label>
                    <input 
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Task name"
                    />

                    <label 
                        htmlFor="description" 
                        className="block text-gray-700"
                    >
                        Team Description:
                    </label>
                    <input 
                        type="text"
                        name="description"
                        id="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Task name"
                    />

                    <button 
                        type="submit" 
                        name="intent" 
                        value="create" 
                        className=" mt-4 w-full bg-blue-500 text-white p-2 rounded-md"
                    > 
                        {isEdit ? "Edit Team":"Create Team" }
                    </button>
                </div>
            </Form>
        </>
    )
}