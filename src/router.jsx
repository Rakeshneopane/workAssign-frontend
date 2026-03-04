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
    console.log("ROOT LOADER STARTED");

    const token = localStorage.getItem("authToken");
    if(!token){
        return redirect("/login");
    }

    try {
        const [ projects, tasks, teams ]= await Promise.all([
            apiFetch(`${BASE_URL}/api/projects`),
            apiFetch(`${BASE_URL}/api/tasks`),
            apiFetch(`${BASE_URL}/api/teams`),
        ]);

        console.log(projects, tasks, teams);

        return { projects, tasks, teams };
    } catch (error) {
        console.log(error);
        return null;
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
            loader: async () => { return apiFetch(`${BASE_URL}/api/tasks`); },
        },
        {
            path: "/projects",
            element: <ProjectSection />,
            loader: async () => { return apiFetch(`${BASE_URL}/api/projects`); },
            action: projectAction,
        },
         {
            path: "/project/create",
            element: <ProjectForm />,
            action: projectAction,
            loader: async () => { return apiFetch(`${BASE_URL}/api/projects`); },
        },
        {
            path: "/project/:id",
            element: <ProjectManagement />,
            loader: async ({params})=>{ return apiFetch(`${BASE_URL}/api/projects/${params.id}`);} ,
            action: projectAction,
        },
        {
            path: "/project/:id/edit",
            element: <ProjectForm />,
            loader: async ({params})=>{ return apiFetch(`${BASE_URL}/api/projects/${params.id}`);} ,
            action: projectAction,
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

