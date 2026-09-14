import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import MainLayout from "../components/layout/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import Profile from "../pages/profile/Profile";
import Users from "../pages/users/Users";
import Categories from "../pages/categories/Categories";
import Products from "../pages/products/Products";
import ProductDetail from "../pages/products/ProductDetail";
import Stock from "../pages/stock/Stock";
import Reports from "../pages/reports/Reports";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public route */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Protected route */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Profile route */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Profile />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Users route */}
      <Route
        path="/users"
        element={
          <ProtectedRoute allowedRoles={["admin", "manager"]}>
            <MainLayout>
              <Users />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Categories route */}
      <Route
        path="/categories"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Categories />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Products route */}
      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Products />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Product Detail route */}
      <Route
        path="/products/:productId"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ProductDetail />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Stock route */}
      <Route
        path="/stock"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Stock />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Reports route */}
      <Route
        path="/reports"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <MainLayout>
              <Reports />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Unknown routes */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
