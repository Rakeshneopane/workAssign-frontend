import {
  FiFolderPlus,
  FiClipboard,
  FiUsers,
  FiTrendingUp,
} from "react-icons/fi";

const steps = [
  {
    icon: <FiFolderPlus size={28} />,
    title: "Create a Project",
    description:
      "Start by creating a project and defining your team's objectives.",
  },
  {
    icon: <FiClipboard size={28} />,
    title: "Assign Tasks",
    description:
      "Break work into tasks, assign owners and set deadlines.",
  },
  {
    icon: <FiUsers size={28} />,
    title: "Collaborate",
    description:
      "Keep everyone aligned with shared teams and responsibilities.",
  },
  {
    icon: <FiTrendingUp size={28} />,
    title: "Track Progress",
    description:
      "Monitor project health through reports and progress tracking.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">

          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Workflow
          </span>

          <h2 className="mt-6 text-5xl font-black text-slate-900">
            From planning to delivery
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
            WorkAssign keeps your entire workflow organized—from the first idea
            to the final delivery.
          </p>

        </div>

        <div className="relative mt-24 grid gap-10 md:grid-cols-2 xl:grid-cols-4">

          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative rounded-3xl bg-white p-8 shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white">
                {step.icon}
              </div>

              <h3 className="mt-8 text-2xl font-bold">
                {step.title}
              </h3>

              <p className="mt-4 text-slate-600 leading-7">
                {step.description}
              </p>

              <div className="absolute -top-5 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                {index + 1}
              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}