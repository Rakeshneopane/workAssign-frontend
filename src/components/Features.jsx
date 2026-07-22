import {
  FiFolder,
  FiCheckSquare,
  FiUsers,
  FiBarChart2,
} from "react-icons/fi";

const features = [
  {
    icon: <FiFolder size={34} />,
    title: "Project Management",
    description:
      "Create projects, organize work, and monitor progress from a single dashboard.",
  },
  {
    icon: <FiCheckSquare size={34} />,
    title: "Task Tracking",
    description:
      "Assign tasks, owners, due dates and priorities while keeping everyone aligned.",
  },
  {
    icon: <FiUsers size={34} />,
    title: "Team Collaboration",
    description:
      "Manage teams, collaborate efficiently and clearly define responsibilities.",
  },
  {
    icon: <FiBarChart2 size={34} />,
    title: "Reports & Insights",
    description:
      "Visualize progress, completed work and upcoming deadlines with built-in reports.",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="bg-white py-24"
    >
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">

          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Features
          </span>

          <h2 className="mt-6 text-5xl font-black text-slate-900">
        Manage projects from idea to delivery
        </h2>

        <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-600">
        WorkAssign helps teams organize projects, assign responsibilities,
        collaborate effectively and track progress—all in one workspace.
        </p>

        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-4">

          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-3xl border border-slate-200 bg-slate-50 p-8 transition duration-300 hover:-translate-y-2 hover:border-blue-200 hover:bg-white hover:shadow-xl"
            >

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white transition group-hover:scale-110">
                {feature.icon}
              </div>

              <h3 className="mt-8 text-2xl font-bold text-slate-900">
                {feature.title}
              </h3>

              <p className="mt-4 leading-7 text-slate-600">
                {feature.description}
              </p>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}