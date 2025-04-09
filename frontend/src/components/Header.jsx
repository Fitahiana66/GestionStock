import { LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext.jsx";

function Header() {
  const { logout } = useAuth();

  return (
    <header className="bg-white shadow p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
      <h1 className="text-lg sm:text-xl font-bold text-gray-800">
        Gestion de Stock
      </h1>
      <button
        onClick={logout}
        className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors"
      >
        <LogOut size={20} />{" "}
        <span className="text-sm sm:text-base">Déconnexion</span>
      </button>
    </header>
  );
}

export default Header;
