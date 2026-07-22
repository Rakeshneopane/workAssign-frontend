import { useState } from "react";
import { Form, useActionData, Link } from "react-router-dom";
import { BASE_URL } from "../api/config.jsx";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const actionData = useActionData();

  return (
    <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-2">
      {/* ===================== */}
      {/* Mobile / Tablet Hero */}
      {/* ===================== */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 px-6 py-12 text-center text-white lg:hidden">
        <div className="mx-auto max-w-md">
          <img
            src="/workAssign.svg"
            alt="WorkAssign"
            className="mx-auto mb-6 h-16"
          />

          <h1 className="text-4xl font-black leading-tight">
            Manage Projects
            <br />
            Assign Work
            <br />
            Grow Faster
          </h1>

          <p className="mt-5 text-blue-100">
            Organize projects, assign tasks, collaborate with your team and
            track progress—all in one place.
          </p>
        </div>
      </div>

      {/* ===================== */}
      {/* Desktop Branding */}
      {/* ===================== */}
      <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 p-12">
        <div className="max-w-lg text-white">
          <img
            src="/workAssign.svg"
            alt="WorkAssign"
            className="mb-8 h-16"
          />

          <h1 className="text-5xl font-black leading-tight">
            Manage Projects
            <br />
            Assign Work
            <br />
            Grow Faster
          </h1>

          <p className="mt-6 text-lg text-blue-100">
            WorkAssign helps teams organize projects, assign tasks,
            collaborate efficiently, and track progress—all in one place.
          </p>
        </div>
      </div>

      {/* ===================== */}
      {/* Login Form */}
      {/* ===================== */}
      <div className="flex justify-center px-5 py-10 sm:px-8 lg:items-center lg:px-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link
            to="/"
            className="mb-8 flex items-center justify-center gap-3"
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

          {/* Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
            <h1 className="text-center text-3xl font-black text-slate-900 sm:text-4xl">
              Welcome back
            </h1>

            <p className="mt-2 text-center text-slate-500">
              Please enter your details to sign in
            </p>

            <Form method="post" className="mt-8 space-y-5">
              {actionData?.error && (
                <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600">
                  {actionData.error}
                </div>
              )}

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-300 px-4 py-3.5 pr-16 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white shadow-lg shadow-blue-100 transition hover:-translate-y-0.5 hover:bg-blue-700 active:scale-[0.98]"
              >
                Log In
              </button>
            </Form>

            {/* Signup */}
            <p className="mt-8 text-center text-sm text-slate-500">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold text-blue-600 hover:underline"
              >
                Sign up
              </Link>
            </p>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-sm text-slate-400">or</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            {/* Google Login */}
            <a
              href={`${BASE_URL}/api/auth/google`}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                className="h-5 w-5"
              >
                <path
                  fill="#FFC107"
                  d="M43.6 20H24v8h11.3C33.6 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-9 20-20 0-1.3-.1-2.7-.4-4z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.9 6.3 14.7z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.6 26.8 36 24 36c-5.2 0-9.6-3-11.3-7.4l-6.6 5C9.5 39 16.3 44 24 44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.6 20H24v8h11.3c-.9 2.5-2.6 4.6-4.8 6l6.2 5.2C40.5 35.8 44 30.3 44 24c0-1.3-.1-2.7-.4-4z"
                />
              </svg>

              Continue with Google
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}