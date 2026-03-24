import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate, useRouteLoaderData } from "react-router-dom";

export default function SearchBox(){
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);

    const navigate = useNavigate();

    const {projects, tasks, teams} = useRouteLoaderData("root");

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

        navigate(data.url);
    }

    return (
        <div className="relative w-full">
            {/* Icon */}
            <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />

            {/* Input */}
            <input 
                type="text"
                className="border pl-10 pr-3 py-2 w-full rounded-lg outline-none"
                value={search}
                onChange={(e)=> setSearch(e.target.value) }
                placeholder="Search"
            />
            { results.length > 0 && (
                <div className="absolute z-50 w-full border rounded-lg mt-1 shadow-lg bg-white max-h-80 overflow-y-auto">
                    {results.map((data) => (
                        <div 
                            key={data._id}
                            onClick={() => handleSelect(data)}
                            className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                        >
                            <div className="flex justify-between items-start">
                                <span className="font-medium text-gray-800">{data.name}</span>
                                <span className={`text-xs uppercase font-semibold px-2 py-0.5 rounded-full ml-2 
                                    ${data.type === "project" ? "bg-blue-100 text-blue-600" : 
                                    data.type === "task"    ? "bg-yellow-100 text-yellow-600" : 
                                                            "bg-green-100 text-green-600"}`}>
                                    {data.type}
                                </span>
                            </div>

                            {/* Project details */}
                            {data.type === "project" && data.description && (
                                <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{data.description}</p>
                            )}

                            {/* Task details */}
                            {data.type === "task" && (
                                <div className="flex gap-3 mt-1 flex-wrap">
                                    {data.project?.name && (
                                        <span className="text-xs text-gray-400">
                                            📁 {data.project.name}
                                        </span>
                                    )}
                                    {data.team?.name && (
                                        <span className="text-xs text-gray-400">
                                            👥 {data.team.name}
                                        </span>
                                    )}
                                    {data.owners?.length > 0 && (
                                        <span className="text-xs text-gray-400">
                                            👤 {data.owners.map(o => o.name).join(", ")}
                                        </span>
                                    )}
                                    {data.status && (
                                        <span className={`text-xs font-medium
                                            ${data.status === "completed"   ? "text-green-500" : 
                                            data.status === "in-progress" ? "text-yellow-500" : 
                                            data.status === "blocked"     ? "text-red-500" : 
                                                                            "text-gray-400"}`}>
                                            ● {data.status}
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Team details */}
                            {data.type === "team" && data.description && (
                                <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{data.description}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
        
    )
}
