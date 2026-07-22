import {
  FiCheckCircle,
  FiShield,
  FiUsers,
  FiDatabase,
  FiBarChart2,
  FiGithub,
} from "react-icons/fi";

const technologies = [
  "React",
  "React Router",
  "Node.js",
  "Express",
  "MongoDB",
  "Tailwind CSS",
  "JWT Authentication",
  "Google OAuth",
];

const capabilities = [
  {
    icon: <FiCheckCircle />,
    title: "Project & Task Management",
  },
  {
    icon: <FiUsers />,
    title: "Team Collaboration",
  },
  {
    icon: <FiBarChart2 />,
    title: "Reporting Dashboard",
  },
  {
    icon: <FiDatabase />,
    title: "REST API Backend",
  },
  {
    icon: <FiShield />,
    title: "Role-Based Authorization",
  },
  {
    icon: <FiGithub />,
    title: "Production Ready Architecture",
  },
];

export default function TechStack() {
  return (
    <section id="stats" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Built With
          </span>

          <h2 className="mt-6 text-5xl font-black text-slate-900">
            Modern Technologies
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-600">
            WorkAssign is a full-stack application built with modern web
            technologies and real-world authentication and authorization.
          </p>
        </div>

        {/* Tech Pills */}

        <div className="mt-14 flex flex-wrap justify-center gap-4">

          {technologies.map((tech) => (
            <div
              key={tech}
              className="rounded-full border border-blue-100 bg-blue-50 px-5 py-3 font-medium text-blue-700 transition hover:bg-blue-600 hover:text-white"
            >
              {tech}
            </div>
          ))}

        </div>

        {/* Capabilities */}

        <div className="mt-20 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {capabilities.map((item) => (
            <div
              key={item.title}
              className="flex items-center gap-5 rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:border-blue-200 hover:bg-white hover:shadow-lg"
            >
              <div className="rounded-xl bg-blue-600 p-3 text-white">
                {item.icon}
              </div>

              <div>
                <h3 className="font-bold text-slate-900">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}