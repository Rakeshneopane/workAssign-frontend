import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { BASE_URL } from "../api/config";

import {
  FiHome,
  FiFolder,
  FiCheckSquare,
  FiUsers,
  FiBarChart2,
  FiLogOut,
} from "react-icons/fi";

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

  const menu = [
      {
          label: "Dashboard",
          icon: <FiHome size={20}/>,
          path: "/dashboard",
      },
      {
          label: "Projects",
          icon: <FiFolder size={20}/>,
          path: "/dashboard/projects",
      },
      {
          label: "Tasks",
          icon: <FiCheckSquare size={20}/>,
          path: "/dashboard/tasks",
      },
      {
          label: "Teams",
          icon: <FiUsers size={20}/>,
          path: "/dashboard/teams",
      },
      {
          label: "Reports",
          icon: <FiBarChart2 size={20}/>,
          path: "/dashboard/reports",
      },
  ];

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      <div className="md:hidden border-b border-slate-200 bg-white p-3">
        {/* <NavLink
          to="/dashboard"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3"
        >
          ☰
        </NavLink> */}
        <button
          onClick={() => {
            console.log("clicked");
            setOpen(!open);
          }}
          className="text-xl"
        >
          ☰
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex w-64 flex-col
          bg-white border-r border-slate-200
          px-5 py-6
          transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <NavLink
          to="/dashboard"
          className="flex items-center gap-3"
        >
          <img
            src="/workAssign.svg"
            className="h-10 w-10"
            alt="WorkAssign"
          />

          <div>
            <h2 className="text-xl font-bold text-blue-700">
              WorkAssign
            </h2>

            <p className="text-xs text-slate-500">
              Project Management
            </p>
          </div>
        </NavLink>

        <nav className="mt-8 flex-1 space-y-2">
          {menu.map(item => (

              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/dashboard"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-4 rounded-xl px-4 py-3 transition
                  ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                  }`
                }
              >

              {item.icon}

              <span>{item.label}</span>

              </NavLink>

            ))}
        </nav>

        <div className="mt-auto border-t border-slate-200 pt-6">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>

            <div>
              <p className="font-semibold text-slate-900">
                {user?.name || "User"}
              </p>

              <p className="text-sm text-slate-500">
                {user?.role || "Member"}
              </p>
            </div>

          </div>

          <button
            onClick={handleLogout}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 py-3 font-medium text-white transition hover:bg-red-600"
          >
            <FiLogOut />
            Logout
          </button>

        </div>
      </aside>
    </>
  );
}
