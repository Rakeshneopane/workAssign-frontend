import { Link } from "react-router-dom";

export default function LandingNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        <Link
          to="/"
          className="flex items-center gap-3"
        >
          <img
            src="/workAssign.svg"
            alt="WorkAssign"
            className="h-10"
          />

          <span className="text-2xl font-bold text-blue-600">
            WorkAssign
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">

          <a href="#features" className="hover:text-blue-600">
            Features
          </a>

          <a href="#stats" className="hover:text-blue-600">
            Statistics
          </a>

          <Link to="/login">
            Login
          </Link>

          <Link
            to="/signup"
            className="rounded-xl bg-blue-600 px-5 py-2 font-medium text-white"
          >
            Get Started
          </Link>

        </nav>

      </div>
    </header>
  );
}