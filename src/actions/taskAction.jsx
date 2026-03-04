import apiFetch from "../api/api";
import { BASE_URL } from "../api/config";

export default async function taskAction({request}){
    const formData = await request.formData();
    const intent = formData.get("intent");

    if(intent === "create") return createTask(formData);

    if(intent === "update") return updateTask(formData);

    if(intent === "delete") return deleteTask(formData);

    return null;
}

async function createTask(formData) {

    const task ={
        name: formData.get("name"),
        project: formData.get("project"),
        owners: formData.getAll("owners"),
        team: formData.get("team"),
        tags: [formData.get("tags")],
        timeToComplete: formData.get("timeToComplete"),
        status: formData.get("status"),
    }

    console.log(task);

    await apiFetch(`${BASE_URL}/api/tasks`, {
        method: "POST",
        body: JSON.stringify(task),
    });
    
    return { success : "Task saved successfully" }
} 

async function updateTask(formData) {
    const id = formData.get("id"); 

    const task ={
        name: formData.get("name"),
        project: formData.get("project"),
        owners: formData.getAll("owners"),
        team: formData.get("team"),
        tags: [formData.get("tags")],
        timeToComplete: formData.get("timeToComplete"),
        status: formData.get("status"),
    }

    await apiFetch(`${BASE_URL}/api/tasks/${id}`, {
        method: "PUT",
        body: JSON.stringify(task),
    });
} 
async function deleteTask(formData) {
    const id = formData.get("id");
    
    await apiFetch(`${BASE_URL}/api/tasks/${id}`, {
        method: "DELETE",
    });
} 