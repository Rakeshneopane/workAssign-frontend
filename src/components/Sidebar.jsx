import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { BASE_URL } from '../api/config.jsx';
export default function SideBar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () =>{
    const isOAuth = localStorage.getItem("authMethod") === "oauth";

     try {
        await fetch(`${BASE_URL}/api/auth/logout`, {
            method: "POST",
            credentials: isOAuth ? "include" : "same-origin",
            headers: { 
                "Content-Type": "application/json",
                ...(!isOAuth && { "Authorization": `Bearer ${localStorage.getItem("authToken")}` })
            }
        });
    } catch (err) {
        // proceed even if backend call fails
    } finally {
        localStorage.removeItem("authToken");
        localStorage.removeItem("authMethod");
        localStorage.removeItem("user");
        navigate("/login");
    }
  };

  return (
    <>
      <div className="md:hidden p-3 bg-gray-200">
        <button
          onClick={() => setOpen(!open)}
          className="text-gray text-xl"
        >
          ☰
        </button>
      </div>

      <aside
        className={`
        bg-gray-200 h-screen w-64 p-5 fixed top-0 left-0 z-50
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
      >
        <NavLink
          to="/"
          className="flex items-center justify-center gap-2 font-bold text-blue-800 p-3 text-xl"
        >
          <img
            src="/workAssign.svg"
            alt="WorkAssign"
            className="w-10 h-10"
          />
          <span className="p-1"> WorkAssign </span>
        </NavLink>

        <ul className="flex flex-col text-center gap-2 mt-4">
          {[
            ["Dashboard", "/"],
            ["Tasks", "/tasks"],
            ["Projects", "/projects"],
            ["Teams", "/teams"],
            ["Reports", "/reports"],
            // ["Setting", "/setting"]
          ].map(([label, path]) => (
            <li key={path}>
              <NavLink
                to={path}
                onClick={()=>setOpen(false)}
                className={({ isActive }) =>
                  `block transition-all duration-200 ${
                    isActive
                      ? "text-blue-800 font-bold p-3"
                      : "text-gray-800 p-3 hover:text-blue-600"
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        <button
          onClick={handleLogout}
          className="w-full mt-8 bg-blue-700 text-white py-2 px-4 rounded-lg hover:bg-blue-900 transition"
        >
          Logout
        </button>
      </aside>
    </>
  );
}
