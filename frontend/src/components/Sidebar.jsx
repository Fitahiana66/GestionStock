import { NavLink } from "react-router-dom";
import { 
  Home, 
  Boxes, 
  Package, 
  Truck, 
  Users, 
  ShoppingCart, 
  Clock, 
  AlignJustify 
} from "lucide-react";
import { useState } from "react";

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      <aside
        className={`hidden md:block bg-gray-800 text-white h-screen p-4 transition-all duration-300 ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
        <div className={`flex ${isCollapsed ? "justify-center" : "justify-between"} items-center mb-6`}>
          <h2
            className={`text-2xl font-bold transition-opacity duration-300 ${
              isCollapsed ? "hidden" : "flex"
            }`}
          >
            Menu
          </h2>
          <button onClick={toggleSidebar} className="focus:outline-none">
            <AlignJustify size={20} />
          </button>
        </div>
        <nav>
          <ul className="space-y-2">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center gap-2 p-2 rounded ${
                    isActive ? "bg-gray-700" : "hover:bg-gray-700"
                  }`
                }
              >
                <Home size={20} />
                <span
                  className={`${
                    isCollapsed ? "hidden" : "flex"
                  } transition-all duration-300`}
                >
                  Tableau de bord
                </span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/categories"
                className={({ isActive }) =>
                  `flex items-center gap-2 p-2 rounded ${
                    isActive ? "bg-gray-700" : "hover:bg-gray-700"
                  }`
                }
              >
                <Boxes size={20} />
                <span
                  className={`${
                    isCollapsed ? "hidden" : "flex"
                  } transition-all duration-300`}
                >
                  Catégories
                </span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  `flex items-center gap-2 p-2 rounded ${
                    isActive ? "bg-gray-700" : "hover:bg-gray-700"
                  }`
                }
              >
                <Package size={20} />
                <span
                  className={`${
                    isCollapsed ? "hidden" : "flex"
                  } transition-all duration-300`}
                >
                  Produits
                </span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/warehouses"
                className={({ isActive }) =>
                  `flex items-center gap-2 p-2 rounded ${
                    isActive ? "bg-gray-700" : "hover:bg-gray-700"
                  }`
                }
              >
                <Truck size={20} />
                <span
                  className={`${
                    isCollapsed ? "hidden" : "flex"
                  } transition-all duration-300`}
                >
                  Entrepôts
                </span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/suppliers"
                className={({ isActive }) =>
                  `flex items-center gap-2 p-2 rounded ${
                    isActive ? "bg-gray-700" : "hover:bg-gray-700"
                  }`
                }
              >
                <Users size={20} />
                <span
                  className={`${
                    isCollapsed ? "hidden" : "flex"
                  } transition-all duration-300`}
                >
                  Fournisseurs
                </span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/orders"
                className={({ isActive }) =>
                  `flex items-center gap-2 p-2 rounded ${
                    isActive ? "bg-gray-700" : "hover:bg-gray-700"
                  }`
                }
              >
                <ShoppingCart size={20} />
                <span
                  className={`${
                    isCollapsed ? "hidden" : "flex"
                  } transition-all duration-300`}
                >
                  Commandes
                </span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/historique"
                className={({ isActive }) =>
                  `flex items-center gap-2 p-2 rounded ${
                    isActive ? "bg-gray-700" : "hover:bg-gray-700"
                  }`
                }
              >
                <Clock size={20} />
                <span
                  className={`${
                    isCollapsed ? "hidden" : "flex"
                  } transition-all duration-300`}
                >
                  Historiques
                </span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-2 flex justify-around items-center z-10">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `p-2 rounded ${isActive ? "bg-gray-700" : "hover:bg-gray-700"}`
          }
        >
          <Home size={20} />
        </NavLink>
        <NavLink
          to="/categories"
          className={({ isActive }) =>
            `p-2 rounded ${isActive ? "bg-gray-700" : "hover:bg-gray-700"}`
          }
        >
          <Boxes size={20} />
        </NavLink>
        <NavLink
          to="/products"
          className={({ isActive }) =>
            `p-2 rounded ${isActive ? "bg-gray-700" : "hover:bg-gray-700"}`
          }
        >
          <Package size={20} />
        </NavLink>
        <NavLink
          to="/warehouses"
          className={({ isActive }) =>
            `p-2 rounded ${isActive ? "bg-gray-700" : "hover:bg-gray-700"}`
          }
        >
          <Truck size={20} />
        </NavLink>
        <NavLink
          to="/suppliers"
          className={({ isActive }) =>
            `p-2 rounded ${isActive ? "bg-gray-700" : "hover:bg-gray-700"}`
          }
        >
          <Users size={20} />
        </NavLink>
        <NavLink
          to="/orders"
          className={({ isActive }) =>
            `p-2 rounded ${isActive ? "bg-gray-700" : "hover:bg-gray-700"}`
          }
        >
          <ShoppingCart size={20} />
        </NavLink>
        <NavLink
          to="/historique"
          className={({ isActive }) =>
            `p-2 rounded ${isActive ? "bg-gray-700" : "hover:bg-gray-700"}`
          }
        >
          <Clock size={20} />
        </NavLink>
      </nav>
    </>
  );
}

export default Sidebar;