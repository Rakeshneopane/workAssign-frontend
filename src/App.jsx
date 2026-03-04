import { Outlet } from "react-router-dom";
import SearchBox from "./components/SearchBox";
import SideBar from "./components/Sidebar";
import Footer from "./components/Footer";

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

        {/* Footer */}
        <footer className="p-4 text-center">
          <Footer />
        </footer>

      </div>
    </div>
  );
}
