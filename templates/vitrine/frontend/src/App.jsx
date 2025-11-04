import { Link } from "react-router-dom";
import "./App.css";

import AppRoutes from "./routes/routes";
import AdminRoutes from "../src/neonx.admin/routes";

function App() {
  return (
    <div className="flex flex-col min-h-screen justify-between items-center">
      <header className="flex justify-between w-full px-6 py-4 bg-gray-900 text-white">
        <h1 className="text-2xl font-bold">NeonX</h1>
        <nav>
          <Link to="/" className="hover:underline">
            Accueil
          </Link>
        </nav>
      </header>

      <main className="flex-1 w-full">
        <AppRoutes />
        <AdminRoutes />
      </main>
      <footer className="w-full text-center py-4 text-sm text-gray-500 border-t">
        © {new Date().getFullYear()} NeonX. Tous droits réservés.
      </footer>
    </div>
  );
}

export default App;
