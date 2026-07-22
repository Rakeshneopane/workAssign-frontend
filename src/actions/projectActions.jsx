import apiFetch from "../api/api";
import { BASE_URL } from "../api/config";

export default async function projectAction({ request }) {
    console.log("Project action called");

    const formData = await request.formData();
    const intent = formData.get("intent");

    console.log(intent);

    if (intent === "create") return createProjects(formData);

    if (intent === "update") return updateProjects(formData);

    if (intent === "delete") return deleteProjects(formData);

    return null;
}

async function createProjects(formData) {
    try {
        await apiFetch(`${BASE_URL}/api/projects`, {
            method: "POST",
            body: JSON.stringify({
                name: formData.get("name"),
                description: formData.get("description"),
            }),
        });

        return {
            success: true,
            message: "Project created successfully!",
        };
    } catch (err) {
        return {
            success: false,
            message: err.message,
        };
    }
}

async function updateProjects(formData) {
    try {
        const id = formData.get("id");

        if (!id) {
            throw new Error("Project id missing");
        }

        await apiFetch(`${BASE_URL}/api/projects/${id}`, {
            method: "PUT",
            body: JSON.stringify({
                name: formData.get("name"),
                description: formData.get("description"),
            }),
        });

        return {
            success: true,
            message: "Project updated successfully!",
        };
    } catch (err) {
        return {
            success: false,
            message: err.message,
        };
    }
}

async function deleteProjects(formData) {
    try {
        const id = formData.get("id");

        await apiFetch(`${BASE_URL}/api/projects/${id}`, {
            method: "DELETE",
        });

        return {
            success: true,
            message: "Project deleted successfully!",
        };
    } catch (err) {
        return {
            success: false,
            message: err.message,
        };
    }
}