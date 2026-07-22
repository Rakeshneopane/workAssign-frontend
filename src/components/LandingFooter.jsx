import { Link } from "react-router-dom";
import {
  FiGithub,
  FiLinkedin,
  FiMail,
} from "react-icons/fi";

export default function LandingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">

        <div className="grid gap-12 md:grid-cols-3">

          {/* Logo */}

          <div>

            <h2 className="text-3xl font-bold text-blue-400">
              WorkAssign
            </h2>

            <p className="mt-4 text-slate-400 leading-7">
              A modern project management platform built with React,
              Express, MongoDB and Tailwind CSS.
            </p>

          </div>

          {/* Navigation */}

          <div>

            <h3 className="font-semibold text-white">
              Navigation
            </h3>

            <div className="mt-5 flex flex-col gap-3">

              <Link to="/" className="text-slate-400 hover:text-white">
                Home
              </Link>

              <Link to="/login" className="text-slate-400 hover:text-white">
                Login
              </Link>

              <Link to="/signup" className="text-slate-400 hover:text-white">
                Create Account
              </Link>

            </div>

          </div>

          {/* Contact */}

          <div>

            <h3 className="font-semibold">
              Connect
            </h3>

            <div className="mt-5 flex gap-5 text-2xl">

              <a href="https://github.com/Rakeshneopane" target="_blank" rel="noopener noreferrer">
                  <FiGithub className="hover:text-blue-600 transition" />
              </a>

              <a href="https://www.linkedin.com/in/rakesh-neopane/" target="_blank" rel="noopener noreferrer">
                  <FiLinkedin className="hover:text-blue-600 transition" />
              </a>

              <a href="mailto:rakeshneopane@gmail.com">
                  <FiMail className="hover:text-blue-600 transition" />
              </a>

            </div>

          </div>

        </div>

        <div className="mt-14 border-t border-slate-800 pt-8 text-center text-slate-500">

          © {new Date().getFullYear()} WorkAssign.
          Built with React • Express • MongoDB • Tailwind CSS

        </div>

      </div>
    </footer>
  );
}