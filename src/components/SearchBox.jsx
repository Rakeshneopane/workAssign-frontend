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
            if(search.length > 1 ){
                const allData = [
                    ...projects?.projects.map(p=>({...p, type: "project", url: `/project/${p._id}`})),
                    ...tasks?.tasks.map(t=>({...t, type: "task", url: `/tasks/${t._id}`})),
                    ...teams?.teams.map(tm=>({...tm, type: "team", url: `/team/${tm._id}`}))  
                ];

                console.log("All Data", allData);

                const filteredData = allData.filter(data => 
                    data.name.toLowerCase().includes(search.toLowerCase())
                );
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
                    <div className="absolute z-50 w-full border rounded-lg mt-1 shadow-lg bg-white">
                        {results.map((data) => (
                            <div 
                                key={data._id}
                                onClick={()=>handleSelect(data)}
                                className="p-3 hover:bg-gray-100 cursor-pointer flex justify-between"
                            >
                                <span>{data.name}</span>
                                <span className="text-xs text-gray-300 uppercase">{data.type}</span>
                            </div>
                        ))}
                    </div>
                )
            }
        </div>
        
    )
}
