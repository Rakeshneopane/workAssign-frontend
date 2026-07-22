import {useRouteError, Link, isRouteErrorResponse } from 'react-router-dom';

export function ErrorBoundary(){
    const error = useRouteError();

    const title = isRouteErrorResponse(error)
        ? `${error.status} - ${error.statusText}`
        : "Something went wrong";

    const message = isRouteErrorResponse(error)
        ? error.data
        : error?.message || "An unexpected error occurred.";

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
            <h1 className="text-3xl font-bold text-red-600 mb-2">{message || `Something went wrong`}</h1>
            {/* <p className="text-gray-600 mb-6">
                {message}
            </p> */}
            <Link 
                to="/dashboard" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
                Go Home
            </Link>
        </div>
    );
}