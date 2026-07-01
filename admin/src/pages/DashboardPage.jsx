import { useQuery } from "@tanstack/react-query";
import { orderApi, statsApi } from "../lib/api";
import {
  DollarSignIcon,
  PackageIcon,
  ShoppingBagIcon,
  UsersIcon,
} from "lucide-react";
import {
  capitalizeText,
  formatDate,
  getOrderStatusBadge,
} from "../lib/utils";

function DashboardPage() {
  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: orderApi.getAll,
  });

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: statsApi.getDashboard,
  });

  const recentOrders = ordersData?.orders?.slice(0, 5) || [];

  const statsCards = [
    {
      name: "Total Revenue",
      value: statsLoading
        ? "..."
        : `$${statsData?.totalRevenue?.toFixed(2) || 0}`,
      icon: <DollarSignIcon className="size-6" />,
      color: "#22c55e",
    },
    {
      name: "Total Orders",
      value: statsLoading ? "..." : statsData?.totalOrders || 0,
      icon: <ShoppingBagIcon className="size-6" />,
      color: "#3b82f6",
    },
    {
      name: "Total Customers",
      value: statsLoading ? "..." : statsData?.totalCustomers || 0,
      icon: <UsersIcon className="size-6" />,
      color: "#a855f7",
    },
    {
      name: "Total Products",
      value: statsLoading ? "..." : statsData?.totalProducts || 0,
      icon: <PackageIcon className="size-6" />,
      color: "#f97316",
    },
  ];

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-base-content/60">
          Overview of your store activity
        </p>
      </div>

      {/* STATS (REDESIGNED) */}
      <div className="space-y-3">
        {statsCards.map((stat) => (
          <div
            key={stat.name}
            className="bg-base-100 rounded-2xl p-4 flex items-center justify-between shadow-sm border border-base-200 hover:shadow-md transition"
          >
            {/* LEFT */}
            <div className="flex items-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: stat.color + "20" }}
              >
                <div style={{ color: stat.color }}>{stat.icon}</div>
              </div>

              <div className="ml-4">
                <p className="text-sm text-base-content/60">{stat.name}</p>
              </div>
            </div>

            {/* RIGHT VALUE */}
            <div className="text-xl font-bold">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* RECENT ORDERS (REDESIGNED TABLE) */}
      <div className="bg-base-100 rounded-2xl shadow-sm border border-base-200 overflow-hidden">

        {/* HEADER */}
        <div className="p-4 border-b border-base-200">
          <h2 className="text-lg font-bold">Recent Orders</h2>
          <p className="text-sm text-base-content/60">
            Latest customer purchases
          </p>
        </div>

        {ordersLoading ? (
          <div className="flex justify-center py-10">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="text-center py-10 text-base-content/60">
            No orders yet
          </div>
        ) : (
          <div className="divide-y divide-base-200">

            {recentOrders.map((order) => (
              <div
                key={order._id}
                className="p-4 flex items-center justify-between hover:bg-base-200/40 transition"
              >

                {/* LEFT */}
                <div>
                  <div className="font-semibold">
                    #{order._id.slice(-8).toUpperCase()}
                  </div>

                  <div className="text-sm text-base-content/60">
                    {order.shippingAddress.fullName}
                  </div>

                  <div className="text-xs text-base-content/50">
                    {order.orderItems.length} item(s)
                  </div>
                </div>

                {/* MIDDLE */}
                <div className="hidden md:block text-sm text-base-content/70">
                  {order.orderItems[0]?.name}
                  {order.orderItems.length > 1 &&
                    ` +${order.orderItems.length - 1} more`}
                </div>

                {/* RIGHT */}
                <div className="text-right space-y-1">
                  <div className="font-bold">
                    ${order.totalPrice.toFixed(2)}
                  </div>

                  <div
                    className={`badge ${getOrderStatusBadge(order.status)}`}
                  >
                    {capitalizeText(order.status)}
                  </div>

                  <div className="text-xs text-base-content/50">
                    {formatDate(order.createdAt)}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;

// import { useQuery } from "@tanstack/react-query";
// import { orderApi, statsApi } from "../lib/api";
// import { DollarSignIcon, PackageIcon, ShoppingBagIcon, UsersIcon } from "lucide-react";
// import { capitalizeText, formatDate, getOrderStatusBadge } from "../lib/utils";

// function DashboardPage() {
//   const { data: ordersData, isLoading: ordersLoading } = useQuery({
//     queryKey: ["orders"],
//     queryFn: orderApi.getAll,
//   });

//   const { data: statsData, isLoading: statsLoading } = useQuery({
//     queryKey: ["dashboardStats"],
//     queryFn: statsApi.getDashboard,
//   });

//   // it would be better to send the last 5 items from the api, instead of slicing it here
//   // but we're just keeping it simple here...
//   const recentOrders = ordersData?.orders?.slice(0, 5) || [];

//   const statsCards = [
//     {
//       name: "Total Revenue",
//       value: statsLoading ? "..." : `$${statsData?.totalRevenue?.toFixed(2) || 0}`,
//       icon: <DollarSignIcon className="size-8" />,
//     },
//     {
//       name: "Total Orders",
//       value: statsLoading ? "..." : statsData?.totalOrders || 0,
//       icon: <ShoppingBagIcon className="size-8" />,
//     },
//     {
//       name: "Total Customers",
//       value: statsLoading ? "..." : statsData?.totalCustomers || 0,
//       icon: <UsersIcon className="size-8" />,
//     },
//     {
//       name: "Total Products",
//       value: statsLoading ? "..." : statsData?.totalProducts || 0,
//       icon: <PackageIcon className="size-8" />,
//     },
//   ];

//   return (
//     <div className="space-y-6">
//       {/* STATS */}
//       <div className="stats stats-vertical lg:stats-horizontal shadow w-full bg-base-100">
//         {statsCards.map((stat) => (
//           <div key={stat.name} className="stat">
//             <div className="stat-figure text-primary">{stat.icon}</div>
//             <div className="stat-title">{stat.name}</div>
//             <div className="stat-value">{stat.value}</div>
//           </div>
//         ))}
//       </div>

//       {/* RECENT ORDERS */}
//       <div className="card bg-base-100 shadow-xl">
//         <div className="card-body">
//           <h2 className="card-title">Recent Orders</h2>

//           {ordersLoading ? (
//             <div className="flex justify-center py-8">
//               <span className="loading loading-spinner loading-lg" />
//             </div>
//           ) : recentOrders.length === 0 ? (
//             <div className="text-center py-8 text-base-content/60">No orders yet</div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="table">
//                 <thead>
//                   <tr>
//                     <th>Order ID</th>
//                     <th>Customer</th>
//                     <th>Items</th>
//                     <th>Amount</th>
//                     <th>Status</th>
//                     <th>Date</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {recentOrders.map((order) => (
//                     <tr key={order._id}>
//                       <td>
//                         <span className="font-medium">#{order._id.slice(-8).toUpperCase()}</span>
//                       </td>

//                       <td>
//                         <div>
//                           <div className="font-medium">{order.shippingAddress.fullName}</div>
//                           <div className="text-sm opacity-60">
//                             {order.orderItems.length} item(s)
//                           </div>
//                         </div>
//                       </td>

//                       <td>
//                         <div className="text-sm">
//                           {order.orderItems[0]?.name}
//                           {order.orderItems.length > 1 && ` +${order.orderItems.length - 1} more`}
//                         </div>
//                       </td>

//                       <td>
//                         <span className="font-semibold">${order.totalPrice.toFixed(2)}</span>
//                       </td>

//                       <td>
//                         <div className={`badge ${getOrderStatusBadge(order.status)}`}>
//                           {capitalizeText(order.status)}
//                         </div>
//                       </td>

//                       <td>
//                         <span className="text-sm opacity-60">{formatDate(order.createdAt)}</span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default DashboardPage;

// {/* STATS */}
// <div className="space-y-3">
//   {statsCards.map((stat) => (
//     <div
//       key={stat.name}
//       className="bg-base-100 rounded-2xl p-4 flex items-center justify-between shadow-sm border border-base-200 hover:shadow-md transition"
//     >
//       {/* LEFT SIDE */}
//       <div className="flex items-center">
//         <div
//           className="w-12 h-12 rounded-full flex items-center justify-center"
//           style={{
//             backgroundColor:
//               stat.name === "Total Revenue"
//                 ? "#22c55e20"
//                 : stat.name === "Total Orders"
//                 ? "#3b82f620"
//                 : stat.name === "Total Customers"
//                 ? "#a855f720"
//                 : "#f9731620",
//           }}
//         >
//           <div
//             className={
//               stat.name === "Total Revenue"
//                 ? "text-green-500"
//                 : stat.name === "Total Orders"
//                 ? "text-blue-500"
//                 : stat.name === "Total Customers"
//                 ? "text-purple-500"
//                 : "text-orange-500"
//             }
//           >
//             {stat.icon}
//           </div>
//         </div>

//         <div className="ml-4">
//           <p className="text-sm text-base-content/60">{stat.name}</p>
//         </div>
//       </div>

//       {/* RIGHT VALUE */}
//       <div className="text-xl font-bold text-base-content">
//         {stat.value}
//       </div>
//     </div>
//   ))}
// </div>