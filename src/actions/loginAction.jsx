import apiFetch from "../api/api";
import { BASE_URL } from "../api/config";
import { redirect } from "react-router-dom";

export default async function loginAction({ request }) {
    const formData = await request.formData();
    const email = formData.get("email");
    const password = formData.get("password");
    
    try {
        const response = await apiFetch(`${BASE_URL}/api/auth/login`, {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });

        console.log(response);

        localStorage.setItem("authToken", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));

        return redirect("/");
    } catch (error) {
        console.error("Login error:", error);
        return {error: "Login failed. Please try again."}
        
    }
}