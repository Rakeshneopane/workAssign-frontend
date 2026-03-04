import { useLoaderData, Link, Form, useActionData, useNavigate, useRouteLoaderData, useParams } from "react-router-dom";
import { useState } from "react";
import { calcDueDate } from "../api/calculateDueDate";
import { AdminOnly } from "../components/AdminGuard";

export function TaskSection(){

    const { tasks } = useRouteLoaderData("root");
    const tasksData = tasks;
    console.log(tasksData)

    const navigate = useNavigate();

    const calcDueDate = (daysToComplete)=>{
        const today = new Date();
        const dueDate = new Date(today);
        dueDate.setDate(today.getDate() + Number(daysToComplete));
        
         return dueDate.toLocaleDateString('en-GB', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
        });
    }
  return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-blue-600">My Tasks</h1>
                    <div className="flex items-center gap-4">
                        <select 
                            name="filter" 
                            id="filter"
                            className="px-3 py-2 outline-none bg-white border border-gray-300 rounded-md shadow-sm text-sm"
                        >
                            <option value="">Filter</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition">
                            <Link to={"/tasks/create"}>+ New Task</Link>
                            
                        </button>
                    </div>
               </div>
            
                <div className="bg-white rounded-md shadow overflow-hidden">
                    <div className="overflow-x-auto">                   
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-blue-600">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        #
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        Task Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        Owners
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        Due Date
                                    </th>
                                    <AdminOnly>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </AdminOnly>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                { tasksData && tasksData.tasks.map((task, index) => (
                                    <tr 
                                        key={index} 
                                        className="hover:bg-gray-50"
                                        onClick={()=>navigate(`/tasks/${task._id}`)}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {task.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {task.owners.map((owner, idx) => (
                                                <span key={idx}>
                                                    {owner.name}
                                                    {idx < task.owners.length - 1 ? ', ' : ''}
                                                </span>
                                            ))}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                task.status === 'completed' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : task.status === 'in-progress'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {task.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {calcDueDate(task.timeToComplete)}
                                        </td>
                                        <AdminOnly>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button className="text-blue-400 hover:text-blue-600 mr-3">
                                                    Edit
                                                </button>
                                                <button className="text-red-600 hover:text-red-900">
                                                    Delete
                                                </button>
                                            </td>
                                        </AdminOnly>  
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
  )
};

export function Tasks(){
    return(
        <>
        <TaskSection />
        </>
    )
}

export function TaskManagement() {

    const navigate = useNavigate();
    
    const loaderData = useLoaderData();
    
    const task = loaderData.tasks; 

    console.log("Task:", task);

    return (
        <div className="p-6 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <h1 className="text-3xl font-bold text-blue-600">
                    Task Management
                </h1>

                <div className="bg-gray-300 border border-gray-200 rounded-xl p-4 mt-4">

                    {task && (
                        <div className="bg-gray-100 border border-gray-200 sm:px-6 lg:px-8 py-4 shadow rounded-xl mt-4">

                            <h2>
                                <span className="font-bold">Task Name: </span>
                                {task.name}
                            </h2>

                            <p>
                                <span className="font-bold">Tag: </span>
                                {task.tags}
                            </p>

                            <p>
                                <span className="font-bold">Status: </span>
                                {task.status ? task.status.charAt(0).toUpperCase() + task.status.slice(1) : "N/A"}
                            </p>

                            <p>
                                <span className="font-bold">Owners: </span>
                                {task.owners?.length > 0
                                    ? task.owners.join(", ")
                                    : "No owners yet"}
                            </p>

                            <p>
                                <span className="font-bold">Project: </span>
                                {task.project?.name}
                            </p>

                            <p>
                                <span className="font-bold">Team: </span>
                                {task.team?.name}
                            </p>

                            <p>
                                <span className="font-bold">Due Date: </span>
                                {calcDueDate(task.timeToComplete)}
                            </p>

                            <AdminOnly>
                                <button
                                    onClick={() => navigate(`/tasks/${task._id}/edit`)}
                                    className="mt-4 text-blue-800 text-xl font-bold"
                                >
                                    Edit Task
                                </button>
                            </AdminOnly>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

export function TaskForm(){

    const loaderData = useLoaderData();
    console.log("loaderData:", loaderData);

    const editTask = loaderData.tasks;

    console.log("Tasks: ", editTask);

    const {id} = useParams();

    console.log("id: ", id);

    const isEdit = !!id;

    const { projects,tasks, teams } = useRouteLoaderData("root");

    

    const navigation = useNavigate();

    const [formData, setFormData] = useState({
        name: editTask?.name ?? "",
        project: editTask?.project?._id ?? "",
        owners: editTask?.owners ?? [],
        team: editTask?.team?._id ?? "",
        tags: editTask?.tags ?? "",
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
            <Form method="post" className="container mx-auto p-4 md:p-8">
                <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
                    <label 
                        htmlFor="name" 
                        className="block text-gray-700"
                    >
                        Task Name:
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
                        htmlFor="project"
                        className="block text-gray-700"
                    >
                        Project:
                    </label>
                    <select 
                        type="text"
                        name="project"
                        id="project"
                        value={formData.project}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    >
                        <option value={""}>Select Project</option>
                        {projects?.projects.map((project,index)=>(
                            <option value={project._id} key={index}> {project.name} </option>
                        ))}
                    </select>

                    {/* <label htmlFor="owners">Owners:</label>
                    <select 
                        type="text"
                        name="owners"
                        id="owners"
                        value={formData.project}
                        onChange={handleChange}
                        multiple
                        required
                    >
                        <option value={""}>Select Owners</option>
                        {users?.map((owner,index)=>(
                            <option value={owner._id} key={index}> {owner.name} </option>  
                        ))}
                    </select> */}

                    <label 
                        htmlFor="team"
                        className="block text-gray-700"    
                    >
                        Teams:
                    </label>
                    <select 
                        type="text"
                        name="team"
                        id="team"
                        value={formData.team}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md "
                    >
                        <option value={""}>Select team</option>
                        {teams?.teams.map((team,index)=>(
                            <option value={team._id} key={index}> {team.name} </option>
                        ))}
                    </select>

                    <label 
                        htmlFor="tags"
                        className="block text-gray-700"
                    >
                        Tags:
                    </label>
                    <input 
                        type="text"
                        name="tags"
                        id="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 p-2 rounded rounded-md"
                        placeholder="Tags"
                    />

                    <label 
                        htmlFor="timeToComplete"
                        className="block text-gray-700"
                    >
                        Time To Complete:
                    </label>
                    <input 
                        type="number"
                        name="timeToComplete"
                        id="timeToComplete"
                        value={formData.timeToComplete}
                        onChange={handleChange}
                        min={1}
                        required
                        className="mt-1 block w-full border border-gray-300 p-2 rounded rounded-md"
                        placeholder="Time to complete in days"
                    />

                    <label 
                        htmlFor="status"
                        className="block text-gray-700"
                    >
                        Status: 
                    </label>
                    <select 
                        type="text"
                        name="status"
                        id="status"
                        value={formData.status}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded rounded-md p-2"
                    >
                        <option value={""}>Select Status</option> 
                        <option value={"to-do"}>To Do</option>                   
                        <option value={"in-progress"}>In progress</option>                    
                        <option value={"completed"}>Completed</option>                    
                        <option value={"blocked"}>Blocked</option>
                    </select>

                    <button 
                        type="submit" 
                        name="intent" 
                        value={isEdit ? "update" : "create"} 
                        className=" mt-4 w-full bg-blue-500 text-white p-2 rounded-md"
                    > 
                        {isEdit ? "Edit Task" : "Create Task" }
                    </button>
                </div>
            </Form>
        </>
    )
}