import { useUser } from "@clerk/clerk-react";
import { ShoppingBagIcon } from "lucide-react";
import { Link, useLocation } from "react-router";
import { NAVIGATION } from "./Navbar";

function Sidebar() {
  const location = useLocation();
  const { user } = useUser();

  return (
    <div className="drawer-side is-drawer-close:overflow-visible">
      <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>

      <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
        <div className="p-4 w-full">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-primary rounded-xl flex items-center justify-center shrink-0">
              <ShoppingBagIcon className="w-6 h-6 text-primary-content" />
            </div>
            <span className="text-xl font-bold is-drawer-close:hidden">Admin</span>
          </div>
        </div>

        <ul className="menu w-full grow flex flex-col gap-2">
          {NAVIGATION.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`is-drawer-close:tooltip is-drawer-close:tooltip-right 
                    ${isActive ? "bg-primary text-primary-content" : ""}
                  `}
                >
                  {item.icon}
                  <span className="is-drawer-close:hidden">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>

       <div className="p-[1px] rounded-2xl bg-[#1DB954] is-drawer-close:hidden">
  <div className="bg-base-100 rounded-2xl px-4 py-3">
    <div className="flex items-center gap-3">
      <div className="avatar shrink-0">
        <img
          src={user?.imageUrl}
          alt={user?.name}
          className="w-9 h-9 rounded-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate leading-5">
          {user?.firstName} {user?.lastName}
        </p>

        <p className="text-xs opacity-60 truncate mt-0.5">
          {user?.emailAddresses?.[0]?.emailAddress}
        </p>
      </div>
    </div>
  </div>
</div>
      </div>
    </div>
  );
}
export default Sidebar;
