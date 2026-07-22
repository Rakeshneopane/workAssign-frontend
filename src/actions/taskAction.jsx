import apiFetch from "../api/api";
import { BASE_URL } from "../api/config";

export default async function taskAction({ request }) {
    const formData = await request.formData();
    const intent = formData.get("intent");

    if (intent === "create") return createTask(formData);

    if (intent === "update") return updateTask(formData);

    if (intent === "delete") return deleteTask(formData);

    return null;
}

async function createTask(formData) {
    try {
        const task = {
            name: formData.get("name"),
            project: formData.get("project"),
            owners: formData.getAll("owners"),
            team: formData.get("team"),
            tags: formData.getAll("tags"),
            timeToComplete: Number(formData.get("timeToComplete")),
            status: formData.get("status"),
        };

        await apiFetch(`${BASE_URL}/api/tasks`, {
            method: "POST",
            body: JSON.stringify(task),
        });

        return {
            success: true,
            message: "Task created successfully!",
        };
    } catch (err) {
        return {
            success: false,
            message: err.message,
        };
    }
}

async function updateTask(formData) {
    try {
        const id = formData.get("id");

        const task = {
            name: formData.get("name"),
            project: formData.get("project"),
            owners: formData.getAll("owners"),
            team: formData.get("team"),
            tags: formData.getAll("tags"),
            timeToComplete: Number(formData.get("timeToComplete")),
            status: formData.get("status"),
        };

        await apiFetch(`${BASE_URL}/api/tasks/${id}`, {
            method: "PUT",
            body: JSON.stringify(task),
        });

        return {
            success: true,
            message: "Task updated successfully!",
        };
    } catch (err) {
        return {
            success: false,
            message: err.message,
        };
    }
}

async function deleteTask(formData) {
    try {
        const id = formData.get("id");

        await apiFetch(`${BASE_URL}/api/tasks/${id}`, {
            method: "DELETE",
        });

        return {
            success: true,
            message: "Task deleted successfully!",
        };
    } catch (err) {
        return {
            success: false,
            message: err.message,
        };
    }
}