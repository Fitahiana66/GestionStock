import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext.jsx";
import { useState, useEffect } from "react";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import BaseLayout from "./layout/BaseLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Products from "./pages/Products.jsx";
import Warehouses from "./pages/Warehouses.jsx";
import Suppliers from "./pages/Suppliers.jsx";
import Orders from "./pages/Orders.jsx";
import Categories from "./pages/Categories.jsx";
import Historiques from "./pages/Historiques.jsx";

function App() {
  const { user, getProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      if (!user) {
        try {
          await getProfile();
        } catch (error) {
          console.log("Utilisateur non authentifier");
        }
      }
      setIsLoading(false);
    };

    verifyUser();
  }, [user, getProfile]);

  console.log("User : ", user);

  const ProtectedRoute = () => {
    if (isLoading) {
      return <div>Loading...</div>;
    }
    
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    
    return <Outlet />;
  };

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<BaseLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/products" element={<Products />} />
          <Route path="/warehouses" element={<Warehouses />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/historique" element={<Historiques />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;