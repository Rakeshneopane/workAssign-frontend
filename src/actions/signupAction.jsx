import apiFetch from "../api/api";
import { redirect } from "react-router-dom";
import { BASE_URL } from "../api/config";

export default async function signupAction({request}){
    const formData = await request.formData();
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    try {
        const res = await apiFetch(`${BASE_URL}/api/auth/signup`, {
            method: "POST",
            body: JSON.stringify({name, email, password})
        });     
        
        localStorage.setItem("authToken", res.token);

        return redirect("/dashboard");


    } catch (error) {
        console.log("Error occured while signing up, Please try again.", error);
        return { error: error?.message || "Signup failed. Please try again." };
    }
}