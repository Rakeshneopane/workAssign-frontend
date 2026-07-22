import apiFetch from "../api/api";
import { BASE_URL } from "../api/config";

export default async function teamAction({ request }) {
    const formData = await request.formData();
    const intent = formData.get("intent");

    if (intent === "create") return createTeam(formData);

    if (intent === "update") return updateTeam(formData);

    if (intent === "delete") return deleteTeam(formData);

    return null;
}

async function createTeam(formData) {
    try {
        await apiFetch(`${BASE_URL}/api/teams`, {
            method: "POST",
            body: JSON.stringify({
                name: formData.get("name"),
                description: formData.get("description"),
            }),
        });

        return {
            success: true,
            message: "Team created successfully!",
        };
    } catch (err) {
        return {
            success: false,
            message: err.message,
        };
    }
}

async function updateTeam(formData) {
    try {
        const id = formData.get("id");

        await apiFetch(`${BASE_URL}/api/teams/${id}`, {
            method: "PUT",
            body: JSON.stringify({
                name: formData.get("name"),
                description: formData.get("description"),
            }),
        });

        return {
            success: true,
            message: "Team updated successfully!",
        };
    } catch (err) {
        return {
            success: false,
            message: err.message,
        };
    }
}

async function deleteTeam(formData) {
    try {
        const id = formData.get("id");

        await apiFetch(`${BASE_URL}/api/teams/${id}`, {
            method: "DELETE",
        });

        return {
            success: true,
            message: "Team deleted successfully!",
        };
    } catch (err) {
        return {
            success: false,
            message: err.message,
        };
    }
}