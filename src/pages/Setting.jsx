// view edit delete

import { ProjectSection } from "./Projects";
import { TeamSection } from "./Teams";
import { TaskSection } from "./Tasks";
import { useRouteLoaderData } from "react-router-dom";
import { AdminOnly } from "../components/AdminGuard";

function OperationsOnProject({role}){
    
    return(
        <div>
            <ProjectSection />
        </div>
    )
}

export function Settings(){
    const { projects,teams,tasks } = useRouteLoaderData("root");
    
    const user = JSON.parse(localStorage.getItem("user"));
    const role = user.role === "admin";
    console.log(role);

    console.log("Projects: ", projects, "teams: ", teams, "tasks: ", tasks);
    return (
        <>
        <h1>Setting</h1>
        <p>Manage Projects, teams and tasks. </p>

        <OperationsOnProject />
        <TaskSection />
        <TeamSection />
        </>
    )
}