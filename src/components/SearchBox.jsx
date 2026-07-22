import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
// import { useNavigate, useRouteLoaderData } from "react-router-dom";
import {
  useNavigate,
  useRouteLoaderData,
  useLocation,
} from "react-router-dom";

export default function SearchBox(){
    
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);

    const navigate = useNavigate();

    
    const {projects, tasks, teams} = useRouteLoaderData("root");


    const location = useLocation();

    const titles = {
    "/dashboard": "Dashboard",
    "/dashboard/projects": "Projects",
    "/dashboard/tasks": "Tasks",
    "/dashboard/teams": "Teams",
    "/dashboard/reports": "Reports",
    };

    const pageTitle = titles[location.pathname] || "WorkAssign";

    useEffect(()=>{ 
        const debounceFn = setTimeout(()=>{
            if(search.length >= 1 ){
                const allData = [
                    ...projects?.projects.map(p=>({...p, type: "project", url: `/projects/${p._id}`})),
                    ...tasks?.tasks.map(t=>({...t, type: "task", url: `/tasks/${t._id}`})),
                    ...teams?.teams.map(tm=>({...tm, type: "team", url: `/teams/${tm._id}`}))  
                ];

                console.log("All Data", allData);

                const filteredData = allData.filter(data => {
                    const q = search.toLowerCase();

                    // Common
                    const matchName = data.name?.toLowerCase().includes(q);
                    const matchDescription = data.description?.toLowerCase().includes(q);

                    // Task-specific
                    const matchStatus = data.status?.toLowerCase().includes(q);
                    const matchOwners = data.owners?.some(o => o.name?.toLowerCase().includes(q));
                    const matchTeam = data.team?.name?.toLowerCase().includes(q);
                    const matchProject = data.project?.name?.toLowerCase().includes(q);

                    return matchName || matchDescription || matchStatus || matchOwners || matchTeam || matchProject;
                });
                setResults(filteredData);
            }
            else setResults([]);        
        }, 500); 

        return ()=>clearTimeout(debounceFn);
    },[search, projects, tasks, teams]);

    const handleSelect = (data) =>{
        setSearch("");
        setResults([]);

        navigate(`/dashboard/${data.url}`);
    }

    // return (
    //     <div className="relative w-full">
    //         {/* Icon */}
    //         <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />

    //         {/* Input */}
    //         <input 
    //             type="text"
    //             className="border pl-10 pr-3 py-2 w-full rounded-lg outline-none"
    //             value={search}
    //             onChange={(e)=> setSearch(e.target.value) }
    //             placeholder="Search"
    //         />
    //         { results.length > 0 && (
    //             <div className="absolute z-50 w-full border rounded-lg mt-1 shadow-lg bg-white max-h-80 overflow-y-auto">
    //                 {results.map((data) => (
    //                     <div 
    //                         key={data._id}
    //                         onClick={() => handleSelect(data)}
    //                         className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
    //                     >
    //                         <div className="flex justify-between items-start">
    //                             <span className="font-medium text-gray-800">{data.name}</span>
    //                             <span className={`text-xs uppercase font-semibold px-2 py-0.5 rounded-full ml-2 
    //                                 ${data.type === "project" ? "bg-blue-100 text-blue-600" : 
    //                                 data.type === "task"    ? "bg-yellow-100 text-yellow-600" : 
    //                                                         "bg-green-100 text-green-600"}`}>
    //                                 {data.type}
    //                             </span>
    //                         </div>

    //                         {/* Project details */}
    //                         {data.type === "project" && data.description && (
    //                             <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{data.description}</p>
    //                         )}

    //                         {/* Task details */}
    //                         {data.type === "task" && (
    //                             <div className="flex gap-3 mt-1 flex-wrap">
    //                                 {data.project?.name && (
    //                                     <span className="text-xs text-gray-400">
    //                                         📁 {data.project.name}
    //                                     </span>
    //                                 )}
    //                                 {data.team?.name && (
    //                                     <span className="text-xs text-gray-400">
    //                                         👥 {data.team.name}
    //                                     </span>
    //                                 )}
    //                                 {data.owners?.length > 0 && (
    //                                     <span className="text-xs text-gray-400">
    //                                         👤 {data.owners.map(o => o.name).join(", ")}
    //                                     </span>
    //                                 )}
    //                                 {data.status && (
    //                                     <span className={`text-xs font-medium
    //                                         ${data.status === "completed"   ? "text-green-500" : 
    //                                         data.status === "in-progress" ? "text-yellow-500" : 
    //                                         data.status === "blocked"     ? "text-red-500" : 
    //                                                                         "text-gray-400"}`}>
    //                                         ● {data.status}
    //                                     </span>
    //                                 )}
    //                             </div>
    //                         )}

    //                         {/* Team details */}
    //                         {data.type === "team" && data.description && (
    //                             <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{data.description}</p>
    //                         )}
    //                     </div>
    //                 ))}
    //             </div>
    //         )}
    //     </div>
        
    // )

    return (
        <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            {/* Left */}

            <div>

            <h1 className="text-3xl font-bold text-slate-900">
                {pageTitle}
            </h1>

            <p className="mt-1 text-slate-500">
                Welcome back! Here's what's happening today.
            </p>

            </div>

            {/* Right */}

            <div className="flex items-center gap-4">

            {/* Search */}

            <div className="relative w-full lg:w-96">

                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects, tasks, teams..."
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                {results.length > 0 && (
                <div className="absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">

                    {results.map((data) => (
                    <div
                        key={data._id}
                        onClick={() => handleSelect(data)}
                        className="cursor-pointer border-b border-slate-100 p-4 transition hover:bg-slate-50 last:border-none"
                    >
                        <div className="flex items-center justify-between">

                        <h3 className="font-semibold text-slate-800">
                            {data.name}
                        </h3>

                        <span
                            className={`rounded-full px-2 py-1 text-xs font-semibold
                            ${
                            data.type === "project"
                                ? "bg-blue-100 text-blue-700"
                                : data.type === "task"
                                ? "bg-green-100 text-green-700"
                                : "bg-purple-100 text-purple-700"
                            }`}
                        >
                            {data.type}
                        </span>

                        </div>

                        <p className="mt-1 text-sm text-slate-500 line-clamp-1">
                        {data.description ||
                            data.project?.name ||
                            data.team?.name ||
                            data.status}
                        </p>

                    </div>
                    ))}

                </div>
                )}

            </div>

            {/* Date */}

            <div className="hidden rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm md:block">
                {new Date().toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
                })}
            </div>

            </div>

        </header>
    );
}
