import { useLoaderData, Link, Form, useNavigate, useRouteLoaderData, useParams, useFetcher, Outlet} from "react-router-dom";
import { useEffect, useState } from "react";
import { calcDueDate } from "../api/calculateDueDate";
import { AdminOnly } from "../components/AdminGuard";
import { Modal } from "../components/ModalOverlays";
import { toast } from "react-toastify";
import { DeleteButton } from "../components/DeleteButton.jsx";

export function TaskSection(){

    const { tasks } = useRouteLoaderData("root");
    const tasksData = tasks.tasks || [];
    console.log("tasksData ", tasksData);

    const navigate = useNavigate();
    const [ filterTag, setFilterTag ] = useState("");
    
    console.log(filterTag);

    const results = tasksData.filter(t=>t.status === filterTag);
    console.log("results ",results);

    const filteredData = filterTag 
        ? tasksData.filter(t => t.status === filterTag) 
        : tasksData;

    console.log("filteredData: ",filteredData);

    return (
        <div className="">
            <div className="max-w-7xl py-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-blue-600">My Tasks</h1>
                    <div className="flex items-center gap-4">
                        <select 
                            name="filter" 
                            id="filter"
                            className="px-3 py-2 outline-none bg-white border border-gray-300 rounded-md shadow-sm text-sm"
                            onChange={(e)=>{setFilterTag(e.target.value)}}
                            value={filterTag}
                        >
                            <option value="">Filter</option>
                            <option value={"to-do"}>To Do</option>                   
                            <option value={"in-progress"}>In progress</option>                    
                            <option value={"completed"}>Completed</option>                    
                            <option value={"blocked"}>Blocked</option>

                        </select>
                            <button 
                                onClick={(e)=>e.stopPropagation()} 
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition"
                            >
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
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                            Actions
                                        </th>                                    
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                { filteredData && filteredData.map((task, index) => (
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
                                            {(task.owners || []).map((owner, idx) => (
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
                                                    : task.status === 'blocked'
                                                    ? 'bg-red-100 text-red-800'
                                                    : task.status === 'to-do'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {task.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {calcDueDate(task.timeToComplete)}
                                        </td>                                        
                                            <td 
                                            onClick={(e)=>e.stopPropagation()}
                                                className="px-6 py-4 whitespace-nowrap text-sm font-medium"
                                            >
                                                <button 
                                                    className="text-blue-500 hover:text-blue-700 font-medium text-sm me-2"
                                                    onClick={() => navigate(`/tasks/${task._id}/edit`)}
                                                >
                                                    Edit
                                                </button>

                                                <DeleteButton id={task._id} action="/tasks" />
                                            </td>                                        
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Outlet />
                </div>
            </div>
        </div>
    )
};

export function TaskManagement() {

    const navigate = useNavigate();
    
    const loaderData = useLoaderData();
    
    const task = loaderData.tasks || []; 

    const { tags } = useRouteLoaderData("root");
    console.log("tags: ", tags.tags)

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
                                <span className="font-bold">Tags: </span>
                                    {task.tags?.map((tagId) => {
                                        const tagObj = tags.tags.find((t) => t._id === tagId);
                                        return tagObj ? (
                                            <span key={tagId}>
                                                {tagObj.name}{", "}
                                            </span>
                                        ) : null;
                                    })}
                            </p>

                            <p>
                                <span className="font-bold">Status: </span>
                                {task.status ? task.status.charAt(0).toUpperCase() + task.status.slice(1) : "N/A"}
                            </p>

                            <p>
                                <span className="font-bold">Owners: </span>
                                { task.owners?.length > 0 
                                    ? task.owners.map(o => o.name ?? o).join(", ") 
                                    : "No owners yet" }
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
                navigate("/tasks");
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
            <Modal onClose={()=> navigate("/tasks")}>
                <fetcher.Form method="post" action="/tasks" className="container mx-auto p-4 md:p-8">
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
                            {projects?.projects?.map((project,index)=>(
                                <option value={project._id} key={index}> {project.name} </option>
                            ))}
                        </select>

                        <label 
                            htmlFor="owners"
                        >
                            Owners: (Hold Ctrl/Cmd to select multiple)
                        </label>
                        <select 
                            multiple
                            type="text"
                            name="owners"
                            id="owners"
                            value={formData.owners}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    owners: [...e.target.selectedOptions].map(o => o.value)
                                })
                            }
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            required
                        >
                            {/* <option value={""}>Select Owners</option> */}
                            {users?.users?.map((owner,index)=>(
                                <option value={owner._id} key={index}> {owner.name} </option>  
                            ))}
                        </select>

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
                            Tags: (Hold Ctrl/Cmd to select multiple)
                        </label>
                        <select 
                            multiple
                            type="text"
                            name="tags"
                            id="tags"
                            value={formData.tags}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    tags: [...e.target.selectedOptions].map(t => t.value)
                                })
                            }
                            required
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md "
                        >
                            {/* <option value={""}>Select tags</option> */}
                            {tags?.tags.map((tag,index)=>(
                                <option value={tag._id} key={index}> {tag.name} </option>
                            ))}
                        </select>

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

                        {isEdit && (
                            <input type="hidden" name="id" value={id} />
                        )}

                        <button 
                            type="submit" 
                            name="intent" 
                            value={isEdit ? "update" : "create"} 
                            className=" mt-4 w-full bg-blue-500 text-white p-2 rounded-md"
                        > 
                            {isSubmitting ? "Processing..." : (isEdit ? "Edit Task" : "Create Task")}
                        </button>
                    </div>
                </fetcher.Form>
            </Modal>            
        </>
    )
}