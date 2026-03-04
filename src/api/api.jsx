import { redirect } from "react-router-dom";

const apiFetch = async (url, options ={})=>{
    try {
        console.log("URL: ", url);

        const token = localStorage.getItem("authToken");

        const response = await fetch(url,{
            ...options,
            headers: {
                "Content-Type":"application/json",
                ...(token && {"Authorization": `Bearer ${token}`}),
                ...options.headers,
            },  
        });

        if(response.status === 401){
            localStorage.removeItem("authToken");
            throw redirect("/login");
        }

        // Check Content-Type header before parsing
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            console.error("Received non-JSON response:", await response.text());
            throw new Error("Server did not return JSON. Check your API URL.");
        }
        
        if(!response.ok){
            const errorData = await response.json();
            console.log("Error response:", errorData);
            throw new Error("API error");
        }

        return await response.json();
        
    } catch (error) {
        console.log("API fetch Error", error);
        throw error;
    }
}

export default apiFetch;