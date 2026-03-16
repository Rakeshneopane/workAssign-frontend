import { Outlet } from "react-router-dom";
import SearchBox from "./components/SearchBox";
import SideBar from "./components/Sidebar";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <div className="overflow-x-hidden">
      {/* Sidebar */}
      <SideBar />

      {/* Main content wrapper */}
      <div className="md:ml-64 min-h-screen flex flex-col">

        {/* Header */}
        <header className="p-4">
          <SearchBox />
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>

        <ToastContainer 
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />

        {/* Footer */}
        <footer className="p-4 text-center">
          <Footer />
        </footer>

      </div>
    </div>
  );
}
