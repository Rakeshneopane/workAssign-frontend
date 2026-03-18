import { createBrowserRouter, redirect } from 'react-router-dom';
import { BASE_URL } from './api/config.jsx';
import apiFetch from './api/api.jsx';

import App from './App.jsx'
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Home from "./pages/Home"
import { ProjectSection, ProjectForm,ProjectManagement } from './pages/Projects.jsx'
import { Tasks, TaskForm, TaskSection, TaskManagement }  from './pages/Tasks.jsx';

import { TeamSection, Teams, TeamForm, TeamManagement } from "./pages/Teams.jsx"
import { Reports } from "./pages/Reports.jsx";
import { Settings } from './pages/Setting.jsx';

import projectAction from './actions/projectActions.jsx';
import signupAction from './actions/signupAction.jsx';
import loginAction from './actions/loginAction.jsx';
import taskAction from './actions/taskAction.jsx';
import teamAction from './actions/teamAction.jsx';

async function rootLoader() {
    const token = localStorage.getItem("authToken");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    
    if(!token) return redirect("/login");

    try {
        // Define common requests
        const requests = [
            apiFetch(`${BASE_URL}/api/projects`),
            apiFetch(`${BASE_URL}/api/tasks`),
            apiFetch(`${BASE_URL}/api/teams`),
            apiFetch(`${BASE_URL}/api/tags`),
        ];

        // Only add the users request if the logged-in user is an admin
        if (user.role === "admin") {
            requests.push(apiFetch(`${BASE_URL}/api/auth/all`));
        }

        const [projects, tasks, teams, tags, users] = await Promise.all(requests);

        return { 
            projects, 
            tasks, 
            teams, 
            tags, 
            users: users || [] // Fallback for non-admins
        };
    } catch (error) {
        console.error("Root Loader Error:", error);
        // DO NOT return null. 
        return { projects: [], tasks: [], teams: [], tags: [], users: [] };
    }
}

async function authLoader() {
    const token = localStorage.getItem("authToken");
    if(token){
        return redirect("/");
    }
    return null;
}

const router = createBrowserRouter([
    {
        path: "/signup",
        element: <Signup />,
        loader: authLoader,
        action: signupAction, 
    },
    {
        path: "/login",
        element: <Login />,
        loader: authLoader,
        action: loginAction,
    },
    {
        path: "/",
        element: <App />,
        loader: rootLoader,
        hydrateFallbackElement: <p>Loading app... </p>,
        id: "root",


        children: [
        { 
            index: true, 
            element: <Home />,
        },
        {
            path: "/projects",
            element: <ProjectSection />,
            loader: async () => { return apiFetch(`${BASE_URL}/api/projects`); },
            action: projectAction,
            children: [
                {
                    path: "create", 
                    element: <ProjectForm />,
                },
                {
                    path: ":id/edit",
                    element: <ProjectForm />,
                    loader:async ({params})=>{ return apiFetch(`${BASE_URL}/api/projects/${params.id}`);},
                },
                
            ]
        },
        {
            path: "projects/:id",
            element: <ProjectManagement />,
            loader: async ({params})=>{ return apiFetch(`${BASE_URL}/api/projects/${params.id}`);},
        },
  
        {
            path: "/tasks",
            element: <Tasks />,
            loader: async () => { return apiFetch(`${BASE_URL}/api/tasks`); },
            action: taskAction,
        },
        {
            path: "/tasks/:id",
            element: <TaskManagement />,
            loader: async ({params}) => { return apiFetch(`${BASE_URL}/api/tasks/${params.id}`); },
            action: taskAction,
        },
        {
            path: "/tasks/:id/edit",
            element: <TaskForm />,
            loader: async ({params}) => { return apiFetch(`${BASE_URL}/api/tasks/${params.id}`); },
            action: taskAction,
        },
        {
            path: "/tasks/create",
            element: <TaskForm />,
            loader: async () => { return apiFetch(`${BASE_URL}/api/tasks`); },
            action: taskAction,
        },
        
        {
            path: "/team/create",
            element: <TeamForm />,
            action: teamAction,
        },
        {
            path: "/team/:id",
            element: <TeamManagement />,
            loader: async ({params})=>{ return apiFetch(`${BASE_URL}/api/teams/${params.id}`);} ,
            action: teamAction,
        },
         {
            path: "/team/:id/edit",
            element: <TeamForm />,
            loader: async ({params})=>{ return apiFetch(`${BASE_URL}/api/teams/${params.id}`);} ,
            action: teamAction,
        },
        {
            path: "/teams",
            element: <Teams />,
            loader: async () => { return apiFetch(`${BASE_URL}/api/teams`); },
            action: teamAction,
        },
        {
            path: "/reports",
            element: <Reports />,
            loader: async () => await Promise.all([
                apiFetch(`${BASE_URL}/api/report/last-week`),
                apiFetch(`${BASE_URL}/api/report/pending`),
            ]),
        },
        {
            path: "/setting",
            element: <Settings />, 
        },
        ]
    }
]);

export default router;

