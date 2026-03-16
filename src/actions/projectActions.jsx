import apiFetch from "../api/api";
import { BASE_URL } from "../api/config";

export default async function projectAction({request}){
    const formData = await request.formData();
    const intent = formData.get("intent");

    if(intent === "create") return await createProjects(formData);

    if(intent === "update") return await updateProjects(formData);

    if(intent === "delete") return await deleteProjects(formData);

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

    return { success: true, message: "Project created successfully!" };
} 

async function updateProjects(formData) {
    const id = formData.get("id");
    if (!id) throw new Error("Project id missing");

    await apiFetch(`${BASE_URL}/api/projects/${id}`, {
        method: "PUT",
        body: JSON.stringify({
            name: formData.get("name"),
            description: formData.get("description"),
        }),
    });

    return { success: true, message: "Project updated successfully!" };
} 

async function deleteProjects(formData) {
    const id = formData.get("id");
    
    await apiFetch(`${BASE_URL}/api/projects/${id}`, {
        method: "DELETE",
    });
    return { success: true, message: "Project deleted successfully!" };
} 