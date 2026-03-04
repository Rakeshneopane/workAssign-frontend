import apiFetch from "../api/api";
import { BASE_URL } from "../api/config";

export default async function projectAction({request}){
    const formData = await request.formData();
    const intent = formData.get("intent");

    if(intent === "create") return createProjects(formData);

    if(intent === "update") return updateProjects(formData);

    if(intent === "delete") return deleteProjects(formData);

    return null;
}

async function createProjects(formData) {
    await apiFetch(`${BASE_URL}/api/projects`, {
        method: "POST",
        body: JSON.stringify({
            name: formData.get("name"),
            description: formData.get("description"),
        }),
    });
} 

async function updateProjects(formData) {
    const id = formData.get("id");

    await apiFetch(`${BASE_URL}/api/projects/${id}`, {
        method: "PUT",
        body: JSON.stringify({
            name: formData.get("name"),
            description: formData.get("description"),
        }),
    });
} 
async function deleteProjects(formData) {
    const id = formData.get("id");
    
    await apiFetch(`${BASE_URL}/api/projects/${id}`, {
        method: "DELETE",
    });
} 