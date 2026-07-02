import { useQuery } from "@tanstack/react-query";
import { orderApi, statsApi } from "../lib/api";
import { formatDate, getOrderStatusBadge, capitalizeText } from "../lib/utils";

// icons
import {
  FaMoneyBillWave,
  FaBoxOpen,
  FaUsers,
} from "react-icons/fa";
import { FiShoppingBag } from "react-icons/fi";

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
      name: "Revenus",
      value: statsLoading
        ? <span className="loading loading-spinner loading-xs" />
        : `$${statsData?.totalRevenue?.toFixed(2) || 0}`,
      icon: FaMoneyBillWave,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      name: "Commandes",
      value: statsLoading
        ? <span className="loading loading-spinner loading-xs" />
        : statsData?.totalOrders || 0,
      icon: FiShoppingBag,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      name: "Clients",
      value: statsLoading
        ? <span className="loading loading-spinner loading-xs" />
        : statsData?.totalCustomers || 0,
      icon: FaUsers,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      name: "Produits",
      value: statsLoading
        ? <span className="loading loading-spinner loading-xs" />
        : statsData?.totalProducts || 0,
      icon: FaBoxOpen,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Intro text */}
        <div>
          <p className="text-base sm:text-lg font-semibold text-gray-900">
            Bienvenue sur votre tableau de bord.
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Vous trouverez ci-dessous un aperçu de l’activité récente de votre
            boutique.
          </p>
        </div>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.name}
                className="rounded-2xl border border-gray-200 bg-white p-3.5 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  {/* Circular icon */}
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center ${stat.iconBg}`}
                  >
                    <Icon className={`w-4 h-4 ${stat.iconColor}`} />
                  </div>

                  <div className="flex-1">
                    <p className="text-[11px] uppercase tracking-wide text-gray-500">
                      {stat.name}
                    </p>
                    <p className="text-base font-semibold text-gray-900 mt-0.5">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ================= TABLE ================= */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-900">
              Commandes récentes
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Les 5 dernières commandes passées sur la plateforme.
            </p>
          </div>

          {/* Content */}
          {ordersLoading ? (
            <div className="flex justify-center py-8">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-8 text-sm text-gray-500">
              Aucune commande pour le moment.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr className="text-[11px] uppercase tracking-wide text-gray-500">
                    <th className="font-medium text-left">ID</th>
                    <th className="font-medium text-left">Client</th>
                    <th className="font-medium text-left">Articles</th>
                    <th className="font-medium text-left">Montant</th>
                    <th className="font-medium text-left">Statut</th>
                    <th className="font-medium text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-t border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-2.5 pr-3 text-xs font-medium text-gray-900">
                        #{order._id.slice(-8).toUpperCase()}
                      </td>

                      <td className="py-2.5 pr-3">
                        <div className="text-xs font-medium text-gray-900">
                          {order.shippingAddress.fullName}
                        </div>
                        <div className="text-[11px] text-gray-500">
                          {order.orderItems.length} article(s)
                        </div>
                      </td>

                      <td className="py-2.5 pr-3 text-xs text-gray-700">
                        {order.orderItems[0]?.name}
                        {order.orderItems.length > 1 && (
                          <span className="text-gray-500">
                            {" "}
                            +{order.orderItems.length - 1}
                          </span>
                        )}
                      </td>

                      <td className="py-2.5 pr-3 text-xs font-semibold text-gray-900">
                        ${order.totalPrice.toFixed(2)}
                      </td>

                      <td className="py-2.5 pr-3">
                        {/* Soft status badges, similar to icon backgrounds */}
                        <div
                          className={`badge text-[11px] ${getOrderStatusBadge(
                            order.status
                          )}`}
                        >
                          {capitalizeText(order.status)}
                        </div>
                      </td>

                      <td className="py-2.5 pr-3 text-[11px] text-gray-500">
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

// utils.ts
export function getOrderStatusBadge(status) {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-amber-100 text-amber-700 border-0";
    case "shipped":
      return "bg-indigo-100 text-indigo-700 border-0";
    case "delivered":
      return "bg-green-100 text-green-700 border-0";
    default:
      return "bg-gray-100 text-gray-600 border-0";
  }
}

export default DashboardPage;

// import { useQuery } from "@tanstack/react-query";
// import { orderApi, statsApi } from "../lib/api";
// import { formatDate, getOrderStatusBadge, capitalizeText } from "../lib/utils";

// // icons (better set, but still simple)
// import {
//   FaMoneyBillWave,
//   FaBoxOpen,
//   FaUsers,
// } from "react-icons/fa";

// import { FiShoppingBag } from "react-icons/fi"; // improved cart icon

// function DashboardPage() {
//   const { data: ordersData, isLoading: ordersLoading } = useQuery({
//     queryKey: ["orders"],
//     queryFn: orderApi.getAll,
//   });

//   const { data: statsData, isLoading: statsLoading } = useQuery({
//     queryKey: ["dashboardStats"],
//     queryFn: statsApi.getDashboard,
//   });

//   const recentOrders = ordersData?.orders?.slice(0, 5) || [];

//   const statsCards = [
//     {
//       name: "Revenus",
//       value: statsLoading
//         ? <span className="loading loading-spinner loading-xs" />
//         : `$${statsData?.totalRevenue?.toFixed(2) || 0}`,
//       icon: FaMoneyBillWave,
//       color: "#22c55e",
//     },
//     {
//       name: "Commandes",
//       value: statsLoading ? <span className="loading loading-spinner loading-xs" /> : statsData?.totalOrders || 0,
//       icon: FiShoppingBag, // ✅ improved cart icon
//       color: "#3b82f6",
//     },
//     {
//       name: "Clients",
//       value: statsLoading ? <span className="loading loading-spinner loading-xs" /> : statsData?.totalCustomers || 0,
//       icon: FaUsers,
//       color: "#a855f7",
//     },
//     {
//       name: "Produits",
//       value: statsLoading ? <span className="loading loading-spinner loading-xs" /> : statsData?.totalProducts || 0,
//       icon: FaBoxOpen,
//       color: "#f59e0b",
//     },
//   ];

//   return (
//     <div className="space-y-6 p-2">

//       {/* ================= STATS ================= */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

//         {statsCards.map((stat) => {
//           const Icon = stat.icon;

//           return (
//             <div
//               key={stat.name}
//               className="card bg-base-100 border-[#1DB954] border shadow-sm p-4 flex items-start justify-between"
//             >
//               <div className="flex items-center">

//                 {/* ICON */}
//                 <div
//                   className="w-11 h-11 rounded-full flex items-center justify-center"
//                   style={{ backgroundColor: stat.color + "20" }}
//                 >
//                   <Icon size={18} color={stat.color} />
//                 </div>

//                 <div className="ml-3">
//                   <p className="text-xs opacity-60">{stat.name}</p>
//                   <p className="text-lg font-semibold">
//                     {stat.value}
//                   </p>
//                 </div>

//               </div>
//             </div>
//           );
//         })}
//       </div>

    
//       {/* ================= TABLE ================= */}
// <div className="rounded-2xl p-px bg-[#1DB954]">
//   <div className="card bg-base-100 shadow-xl rounded-2xl">
//     <div className="card-body">
//       <div className="border-b border-base-300 pb-3 mb-2">
//         <h2 className="card-title">Commandes récentes</h2>
//       </div>

//       {ordersLoading ? (
//         <div className="flex justify-center py-6">
//           <span className="loading loading-spinner loading-lg" />
//         </div>
//       ) : recentOrders.length === 0 ? (
//         <div className="text-center py-6 opacity-60">
//           Aucune commande
//         </div>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="table">
//             <thead>
//               <tr>
//                 <th>ID</th>
//                 <th>Client</th>
//                 <th>Articles</th>
//                 <th>Montant</th>
//                 <th>Statut</th>
//                 <th>Date</th>
//               </tr>
//             </thead>

//             <tbody>
//               {recentOrders.map((order) => (
//                 <tr key={order._id}>
//                   <td className="font-medium">
//                     #{order._id.slice(-8).toUpperCase()}
//                   </td>

//                   <td>
//                     <div className="font-medium">
//                       {order.shippingAddress.fullName}
//                     </div>
//                     <div className="text-sm opacity-60">
//                       {order.orderItems.length} article(s)
//                     </div>
//                   </td>

//                   <td className="text-sm">
//                     {order.orderItems[0]?.name}
//                     {order.orderItems.length > 1 &&
//                       ` +${order.orderItems.length - 1}`}
//                   </td>

//                   <td className="font-semibold">
//                     ${order.totalPrice.toFixed(2)}
//                   </td>

//                   <td>
//                     <div className={`badge ${getOrderStatusBadge(order.status)}`}>
//                       {capitalizeText(order.status)}
//                     </div>
//                   </td>

//                   <td className="text-sm opacity-60">
//                     {formatDate(order.createdAt)}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   </div>
// </div>

//     </div>
//   );
// }

// export default DashboardPage;











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