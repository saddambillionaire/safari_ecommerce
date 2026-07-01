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
      name: "Revenu total",
      value: statsLoading
        ? "..."
        : `$${statsData?.totalRevenue?.toFixed(2) || 0}`,
      icon: <DollarSignIcon className="size-7" />,
      color: "text-emerald-500",
    },
    {
      name: "Commandes",
      value: statsLoading ? "..." : statsData?.totalOrders || 0,
      icon: <ShoppingBagIcon className="size-7" />,
      color: "text-blue-500",
    },
    {
      name: "Clients",
      value: statsLoading ? "..." : statsData?.totalCustomers || 0,
      icon: <UsersIcon className="size-7" />,
      color: "text-violet-500",
    },
    {
      name: "Produits",
      value: statsLoading ? "..." : statsData?.totalProducts || 0,
      icon: <PackageIcon className="size-7" />,
      color: "text-orange-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-base-content/60 mt-1">
          Vue globale de ton activité e-commerce
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {statsCards.map((stat) => (
          <div
            key={stat.name}
            className="card bg-base-100 shadow-md hover:shadow-xl transition-all border border-base-200"
          >
            <div className="card-body flex flex-row items-center justify-between">
              <div>
                <div className="text-sm text-base-content/60">
                  {stat.name}
                </div>
                <div className="text-2xl font-bold mt-1">{stat.value}</div>
              </div>

              <div className={`${stat.color} opacity-80`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* RECENT ORDERS */}
      <div className="card bg-base-100 shadow-md border border-base-200">
        <div className="card-body">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Commandes récentes</h2>
            <span className="text-sm text-base-content/60">
              Dernières activités
            </span>
          </div>

          {ordersLoading ? (
            <div className="flex justify-center py-10">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-10 text-base-content/60">
              Aucune commande pour le moment
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl">
              <table className="table">
                <thead className="text-base-content/70">
                  <tr>
                    <th>ID</th>
                    <th>Client</th>
                    <th>Produits</th>
                    <th>Montant</th>
                    <th>Statut</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {recentOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="hover:bg-base-200 transition"
                    >
                      <td className="font-medium">
                        #{order._id.slice(-8).toUpperCase()}
                      </td>

                      <td>
                        <div className="font-medium">
                          {order.shippingAddress.fullName}
                        </div>
                        <div className="text-xs text-base-content/60">
                          {order.orderItems.length} article(s)
                        </div>
                      </td>

                      <td className="text-sm text-base-content/70">
                        {order.orderItems[0]?.name}
                        {order.orderItems.length > 1 &&
                          ` +${order.orderItems.length - 1} autres`}
                      </td>

                      <td className="font-semibold">
                        ${order.totalPrice.toFixed(2)}
                      </td>

                      <td>
                        <span
                          className={`badge ${getOrderStatusBadge(
                            order.status
                          )}`}
                        >
                          {capitalizeText(order.status)}
                        </span>
                      </td>

                      <td className="text-sm text-base-content/60">
                        {formatDate(order.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
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
