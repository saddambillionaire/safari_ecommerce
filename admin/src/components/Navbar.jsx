// Clerk component that shows the current user's profile/avatar menu
import { UserButton } from "@clerk/clerk-react";

// React Router hook to get information about the current URL
import { useLocation } from "react-router";

// Icons used in the navigation menu and navbar
import {
  ClipboardListIcon,
  HomeIcon,
  PanelLeftIcon,
  ShoppingBagIcon,
  UsersIcon,
} from "lucide-react";

// Navigation links used by the sidebar and navbar title
// eslint-disable-next-line
export const NAVIGATION = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <HomeIcon className="size-5" />,
  },
  {
    name: "Products",
    path: "/products",
    icon: <ShoppingBagIcon className="size-5" />,
  },
  {
    name: "Orders",
    path: "/orders",
    icon: <ClipboardListIcon className="size-5" />,
  },
  {
    name: "Customers",
    path: "/customers",
    icon: <UsersIcon className="size-5" />,
  },
];

function Navbar() {
  // Gives access to the current route information
  const location = useLocation();

  return (
    // Main navbar container
    <div className="navbar w-full bg-base-300">

      {/* Button that opens/closes the drawer (sidebar) */}
      <label
        htmlFor="my-drawer"
        className="btn btn-square btn-ghost"
        aria-label="open sidebar"
      >
        <PanelLeftIcon className="size-5" />
      </label>

      {/* Navbar title section */}
      <div className="flex-1 px-4">
        <h1 className="text-xl font-bold">

          {/* 
            Find the navigation item whose path matches the current URL.
            Example:
            location.pathname = "/products"
            => displays "Products"

            ?.name prevents errors if no item is found.
            || "Dashboard" is the fallback title.
          */}
          {NAVIGATION.find(
            (item) => item.path === location.pathname
          )?.name || "Dashboard"}
        </h1>
      </div>

      {/* User profile/avatar dropdown from Clerk */}
      <div className="mr-5">
        <UserButton />
      </div>
    </div>
  );
}

export default Navbar;
