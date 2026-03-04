import { useLoaderData, Link, Form, useActionData, useNavigate, useRouteLoaderData, useParams } from "react-router-dom";
import { useState } from "react";
import { AdminOnly } from "../components/AdminGuard";
import { calcDueDate } from "../api/calculateDueDate";

export function ProjectSection() {
    const navigate = useNavigate();
    const { projects } = useRouteLoaderData("root");
    console.log("project: ",projects);


    return (
        <div className="p-6 ">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                
                {/* Header Section */}
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-3xl font-bold text-blue-600">My Projects</h1>
                    <div className="flex items-center gap-4">
                        <select 
                            name="filter" 
                            className="px-3 py-2 outline-none bg-white border border-gray-300 rounded-md shadow-sm text-sm"
                        >
                            <option value="">All Projects</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                        <Link 
                            to="/project/create" 
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-md"
                        >
                            + New Project
                        </Link>                       
                    </div>
                </div>

                {/* Card Grid Layout */}
                {!projects || projects.projects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects?.projects.map((project, index) => (
                            <div 
                                onClick={() => navigate(`/project/${project._id}`)}
                                key={project._id || index} 
                                className="bg-gray-100 rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow flex flex-col justify-between"
                            >
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        {project.name}
                                    </h3>
                                    <p className="text-gray-600 text-sm line-clamp-3">
                                        {project.description || "No description provided for this project."}
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <AdminOnly>
                                    <div
                                        onClick={(e)=> e.stopPropagation()} 
                                        className="mt-6 pt-4 border-t border-gray-100 flex justify-end gap-4"
                                    >
                                        <button 
                                            className="text-blue-500 hover:text-blue-700 font-medium text-sm"
                                            onClick={()=>navigate(`/project/${project._id}/edit`)}    
                                        >
                                            Edit
                                        </button>
                                        <Form method="post" action="/projects" onClick={(e)=>e.stopPropagation()}>
                                            <input type="hidden" name="id" value={project._id} />                                           
                                            <button 
                                                type="submit"
                                                name="intent"
                                                value="delete"
                                                className="text-red-500 hover:text-red-700 font-medium text-sm">
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
                            <p className="text-gray-500">No projects found. Create one to get started!</p>
                        </div>
                    )
                }
            </div>
        </div>
    );
}

export function ProjectManagement(){
    const navigate = useNavigate();
    const { project } = useLoaderData();

    const {tasks} = useRouteLoaderData("root");
    
    const projectId = project.map(p=>p._id);

    console.log("projectId: ", projectId, "project: ", project);

    const tasksOnProject = tasks.tasks.filter(t=>t.project._id === projectId[0]);

    console.log("task on project: ", tasksOnProject);
    return(
        <>
        <div className="p-6 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <h1 className="text-3xl font-bold text-blue-600">Project Management</h1>
                <div
                    className="bg-gray-300 border border-gray-200 rounded-xl p-4 mt-4"
                >
                {project && (
                    <>
                    {project.map(p=>(
                        <div
                            onClick={(e)=> e.stopPropagation()} 
                            key={p._id}
                            className="mt-4"
                        >
                        <h2> <span className="font-bold"> Project name: </span>  {p.name}</h2>
                        <p> <span className="font-bold"> Project Description:  </span>{p.description}</p>
                        <AdminOnly>
                            <button 
                                onClick={(e)=> navigate(`/project/${p._id}/edit`)}
                                className="mt-4 text-blue-800 text-xl font-bold"
                            >
                                Edit Project
                            </button>
                        </AdminOnly>
                        </div>
                    ))}

                    {tasksOnProject.length > 0 ? (
                        <>
                        {tasksOnProject.map((t,index)=>(
                            <div key={t._id} className="bg-gray-100 border border-gray-200 sm:px-6 lg:px-8 py-4 shadow rounded-xl mt-4">
                                <p> <span className="font-bold"> Task #{index+1}: </span> {t.name} </p>
                                <p> <span className="font-bold"> Tag : </span>  {t.tags}</p>
                                <p> <span className="font-bold"> Owners: </span>  {t.owners.length > 0 ? t.owners : "No owners yet" }</p>
                                <p> <span className="font-bold"> Team: </span> {t.team.name}</p>
                                <p> <span className="font-bold"> Due Date: </span>  {calcDueDate(t.timeToComplete)}</p>
                                <AdminOnly onClick={(e)=>e.stopPropagation()}>
                                    <button
                                        className="text-blue-800 font-bold" 
                                        onClick={(e)=>e.preventDefault()}>
                                        Edit Task
                                    </button>
                                </AdminOnly>
                            </div>
                            
                        ))}
                        </>
                    ) : ( 
                        <>
                            <div className="bg-gray-100 border border-gray-200 sm:px-6 lg:px-8 py-4 shadow rounded-xl mt-4">
                                <h2>No task assign in this project yet.</h2>
                            </div>

                        </>
                    ) 
                    }
                    </>
                )}
                </div>
            </div>
        </div>
        </>
    )
}



export function ProjectForm(){

    const {id} = useParams();
    console.log("id: ", id);

    const isEdit = !!id;
    console.log("isedit: ", isEdit);

    const project  = useLoaderData();
    console.log("project:  ",project);

    const projectToUpdate = project?.project?.find(p=>p._id === id) || [];
    console.log("projectToUpdate:  ", projectToUpdate);

    const [formData, setFormData] = useState({
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
            <Form method="post" className="container mx-auto p-4 md:p-8">
                <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
                    <label 
                        htmlFor="name" 
                        className="block text-gray-700"
                    >
                        Project Name:
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
                        Project Description:
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
                        {isEdit ? "Edit Project" : "Create Project"} 
                    </button>
                </div>
            </Form>
        </>
    )
}