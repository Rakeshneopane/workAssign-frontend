import { Link } from "react-router-dom";

export default function CTA() {
  return (
    <section className="relative overflow-hidden bg-blue-600 py-24">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700" />

      <div className="relative mx-auto max-w-5xl px-6 text-center text-white">

        <h2 className="text-5xl font-black">
          Ready to organize your team's workflow?
        </h2>

        <p className="mx-auto mt-8 max-w-3xl text-xl text-blue-100 leading-9">
          Whether you're managing a personal project or collaborating with an
          entire team, WorkAssign helps you stay organized from planning to
          delivery.
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-5">

          <Link
            to="/signup"
            className="rounded-xl bg-white px-8 py-4 font-semibold text-blue-700 shadow-xl transition hover:-translate-y-1"
          >
            Get Started
          </Link>

          <Link
            to="/login"
            className="rounded-xl border border-white px-8 py-4 font-semibold text-white transition hover:bg-white hover:text-blue-700"
          >
            Sign In
          </Link>

        </div>

      </div>
    </section>
  );
}