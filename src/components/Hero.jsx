import { Link } from "react-router-dom";
import dashboardPreview from "../assets/image2.png";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Background Blobs */}
      <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />
      <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-indigo-200/30 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 py-24 lg:grid-cols-2">

        {/* LEFT */}

        <div>

          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            🚀 Modern Project Management Platform
          </span>

          <h1 className="mt-8 text-6xl font-black leading-tight text-slate-900">
            Organize Work.
            <br />
            Deliver Projects.
            <br />
            Faster.
          </h1>

          <p className="mt-8 text-xl leading-9 text-slate-600">
            WorkAssign helps teams manage projects, assign tasks,
            collaborate efficiently and monitor progress through one
            intuitive dashboard.
          </p>

          <div className="mt-10 flex gap-5">

            <Link
              to="/signup"
              className="rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white shadow-lg transition hover:-translate-y-1 hover:bg-blue-700"
            >
              Get Started
            </Link>

            <Link
              to="/login"
              className="rounded-xl border border-slate-300 bg-white px-8 py-4 font-semibold transition hover:border-blue-500 hover:text-blue-600"
            >
              Sign In
            </Link>

          </div>

          {/* Quick Stats */}

          <div className="mt-12 flex gap-10">

            <div>
              <h2 className="text-4xl font-bold text-blue-600">Projects</h2>
              <p className="text-slate-500">Track every milestone</p>
            </div>

            <div>
              <h2 className="text-4xl font-bold text-blue-600">Teams</h2>
              <p className="text-slate-500">Collaborate together</p>
            </div>

            <div>
              <h2 className="text-4xl font-bold text-blue-600">Reports</h2>
              <p className="text-slate-500">Measure progress</p>
            </div>

          </div>

        </div>

        {/* RIGHT */}

        <div className="relative hidden lg:flex justify-center">

          <div className="absolute h-[450px] w-[450px] rounded-full bg-blue-300/30 blur-3xl" />

          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl transition duration-500 hover:-translate-y-2 hover:shadow-blue-200">

            <div className="flex items-center gap-2 border-b bg-slate-100 px-5 py-4">

              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-yellow-400" />
              <div className="h-3 w-3 rounded-full bg-green-400" />

            </div>

            <img
              src={dashboardPreview}
              alt="Dashboard Preview"
              className="w-[700px]"
            />

          </div>

        </div>

      </div>
    </section>
  );
}