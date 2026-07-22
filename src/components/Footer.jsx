import { Link } from "react-router-dom";
import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";

export default function Footer() {
    return (
        <footer className="mt-16 border-t border-slate-200 bg-white">
            <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-8 md:flex-row md:items-center md:justify-between">

                {/* Brand */}
                <div>
                    <h3 className="text-xl font-bold text-slate-900">
                        WorkAssign
                    </h3>

                    <p className="mt-2 max-w-sm text-sm text-slate-500">
                        A modern project management platform for organizing
                        projects, teams, and tasks in one place.
                    </p>
                </div>

                {/* Quick Links */}
                <div className="flex gap-8">

                    <div>
                        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-900">
                            Navigation
                        </h4>

                        <div className="space-y-2 text-sm">

                            <Link
                                to="/"
                                className="block text-slate-500 hover:text-blue-600"
                            >
                                Home
                            </Link>

                            <Link
                                to="/dashboard"
                                className="block text-slate-500 hover:text-blue-600"
                            >
                                Dashboard
                            </Link>

                        </div>
                    </div>

                    <div>
                        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-900">
                            Contact
                        </h4>

                        <div className="flex gap-4 text-xl text-slate-500">

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

            </div>

            <div className="border-t border-slate-200 py-5 text-center text-sm text-slate-500">
                &copy; {new Date().getFullYear()} WorkAssign. Built with React, React Router & Tailwind CSS.
            </div>
        </footer>
    );
}