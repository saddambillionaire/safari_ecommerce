// Outlet is a placeholder where child routes will be rendered
import { Outlet } from "react-router";

// UI components
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function DashboardLayout() {
  return (
    // Main drawer container (DaisyUI component)
    // lg:drawer-open => sidebar stays open on large screens
    <div className="drawer lg:drawer-open">

      {/* Controls opening/closing of the drawer/sidebar */}
      <input
        id="my-drawer"
        type="checkbox"
        className="drawer-toggle"
        defaultChecked // drawer is open by default
      />

      {/* Main page content */}
      <div className="drawer-content">

        {/* Top navigation bar */}
        <Navbar />

        {/* Page-specific content */}
        <main className="p-6">

          {/* Child route content is rendered here.
             Example:
             /dashboard  -> DashboardPage
             /products   -> ProductsPage
             /orders     -> OrdersPage
          */}
          <Outlet />

        </main>
      </div>

      {/* Left sidebar navigation */}
      <Sidebar />
    </div>
  );
}

export default DashboardLayout;

// React Router does:
// in app.jsx
// Match / → render DashboardLayout
// Match dashboard → render DashboardPage
// Put DashboardPage inside <Outlet />