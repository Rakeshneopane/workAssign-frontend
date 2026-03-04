import { Children } from "react";

export function AdminOnly({children}){
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;

    if(user?.role !== "admin") return null;
    
    return <>{children}</>;
}