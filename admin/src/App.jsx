import { Navigate, Route, Routes } from "react-router";
import LoginPage from "./pages/LoginPage";
import { useAuth } from "@clerk/clerk-react";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/ProductsPage";
import OrdersPage from "./pages/OrdersPage";
import CustomersPage from "./pages/CustomersPage";
import DashboardLayout from "./layouts/DashboardLayout";

import PageLoader from "./components/PageLoader"; // Loading spinner/page shown while auth state is being checked

function App() {
  // Get authentication status from Clerk
  const { isSignedIn, isLoaded } = useAuth();

  // Wait until Clerk finishes loading user authentication data
  if (!isLoaded) return <PageLoader />;

  return (
    // this routes tag encloses two routes, in the second, its the parent route that permits to all its nested children to start with slash /
    <Routes>

      {/* Login route */}
      <Route
        path="/login"
        // element tells React Router what component to render when the path above matches.
        element={
          // If user is already logged in, send them to dashboard
          isSignedIn
            ? <Navigate to={"/dashboard"} />
            : <LoginPage />
        }
      />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          // Only authenticated users can access these routes
          isSignedIn
            ? <DashboardLayout />
            : <Navigate to={"/login"} />
        }
      >

        {/* Redirect "/" to "/dashboard" */}
        <Route
          index
          element={<Navigate to={"dashboard"} />}
        />

        {/* Dashboard page */}
        <Route
          path="dashboard"
          element={<DashboardPage />}
        />

        {/* Products page */}
        <Route
          path="products"
          element={<ProductsPage />}
        />

        {/* Orders page */}
        <Route
          path="orders"
          element={<OrdersPage />}
        />

        {/* Customers page */}
        <Route
          path="customers"
          element={<CustomersPage />}
        />

      </Route>

    </Routes>
  );
}

export default App; 
