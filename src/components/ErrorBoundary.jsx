import {useRouteError, Link} from 'react-router-dom';

export function ErrorBoundary(){
    const error = useRouteError();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
            <h1 className="text-3xl font-bold text-red-600 mb-2">Something went wrong</h1>
            <p className="text-gray-600 mb-6">
                {error?.message || "An unexpected error occurred."}
            </p>
            <Link 
                to="/" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
                Go Home
            </Link>
        </div>
    );
}