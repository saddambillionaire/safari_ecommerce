// src/pages/OrdersPage.tsx
import { orderApi } from "../lib/api";
import { formatDate, getOrderStatusBadge, capitalizeText } from "../lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

function OrdersPage() {
  const queryClient = useQueryClient();

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: orderApi.getAll,
  });

  const updateStatusMutation = useMutation({
    mutationFn: orderApi.updateStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });

  const handleStatusChange = (orderId, newStatus) => {
    updateStatusMutation.mutate({ orderId, status: newStatus });
  };

  const orders = ordersData?.orders || [];

  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Intro text */}
        <div>
          <p className="text-base sm:text-lg font-semibold text-gray-900">
            Gestion des commandes.
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Consultez et mettez à jour le statut des commandes clients.
          </p>
        </div>

        {/* ORDERS TABLE */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-900">
              Toutes les commandes
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Liste complète des commandes passées sur la plateforme.
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-10">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-10 text-sm text-gray-500">
              Aucune commande pour le moment.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr className="text-[11px] uppercase tracking-wide text-gray-500">
                    <th className="font-medium text-left">ID commande</th>
                    <th className="font-medium text-left">Client</th>
                    <th className="font-medium text-left">Articles</th>
                    <th className="font-medium text-left">Total</th>
                    <th className="font-medium text-left">État</th>
                    <th className="font-medium text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const totalQuantity = order.orderItems.reduce(
                      (sum, item) => sum + item.quantity,
                      0
                    );

                    return (
                      <tr
                        key={order._id}
                        className="border-t border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-2.5 pr-3 text-xs font-medium text-gray-900">
                          #{order._id.slice(-8).toUpperCase()}
                        </td>

                        <td className="py-2.5 pr-3">
                          <div className="text-xs font-medium text-gray-900">
                            {order.shippingAddress.nomComplet}
                          </div>
                          <div className="text-[11px] text-gray-500">
                            {order.shippingAddress.ville},{" "}
                            {order.shippingAddress.commune}
                          </div>
                          <div className="text-[11px] text-gray-500">
                            {order.shippingAddress.quartier},{" "}
                            {order.shippingAddress.avenue}
                          </div>
                          <div className="text-[11px] text-gray-500">
                            {order.shippingAddress.reference},{" "}
                            {order.shippingAddress.numeroTelephone}
                          </div>
                        </td>

                        <td className="py-2.5 pr-3 text-xs text-gray-700">
                          <div className="font-medium">
                            {totalQuantity} item(s)
                          </div>
                          <div className="text-[11px] text-gray-500">
                            {order.orderItems[0]?.name}
                            {order.orderItems.length > 1 && (
                              <span className="text-gray-500">
                                {" "}
                                +{order.orderItems.length - 1}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-2.5 pr-3 text-xs font-semibold text-gray-900">
                          ${order.totalPrice.toFixed(2)}
                        </td>

                        <td className="py-2.5 pr-3">
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
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrdersPage;

// import { orderApi } from "../lib/api";
// import { formatDate } from "../lib/utils";

// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// function OrdersPage() {
//   const queryClient = useQueryClient();

//   const { data: ordersData, isLoading } = useQuery({
//     queryKey: ["orders"],
//     queryFn: orderApi.getAll,
//   });

//   const updateStatusMutation = useMutation({
//     mutationFn: orderApi.updateStatus,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["orders"] });
//       queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
//     },
//   });

//   const handleStatusChange = (orderId, newStatus) => {
//     updateStatusMutation.mutate({ orderId, status: newStatus });
//   };

//   const orders = ordersData?.orders || [];

//   return (
//     <div className="space-y-6">
//       {/* HEADER */}
//       <div className="flex flex-col gap-2">
//         <h1 className="text-2xl font-bold">Commandes</h1>
//         <p className="text-base-content/70">Gérer les commandes des clients</p>
//       </div>

//       {/* ORDERS TABLE */}
//       <div className="card bg-base-100 shadow-xl">
//         <div className="card-body">
//           {isLoading ? (
//             <div className="flex justify-center py-12">
//               <span className="loading loading-spinner loading-lg" />
//             </div>
//           ) : orders.length === 0 ? (
//             <div className="text-center py-12 text-base-content/60">
//               <p className="text-xl font-semibold mb-2">Pas de commandes encore disponibles</p>
//               <p className="text-sm">Les commandes apparaitront ici après avoir fait des commandes</p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="table">
//                 <thead>
//                   <tr>
//                     <th>ID commande</th>
//                     <th>Client</th>
//                     <th>Articles</th>
//                     <th>Total</th>
//                     <th>Etat</th>
//                     <th>Date</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {orders.map((order) => {
//                     const totalQuantity = order.orderItems.reduce(
//                       (sum, item) => sum + item.quantity,
//                       0
//                     );

//                     return (
//                       <tr key={order._id}>
//                         <td>
//                           <span className="font-medium">#{order._id.slice(-8).toUpperCase()}</span>
//                         </td>

//                         <td>
//   <div className="flex flex-col gap-2" scro>
//     <div className="font-medium">
//       {order.shippingAddress.nomComplet}
//     </div>

//     <div className="text-sm opacity-60">
//       {order.shippingAddress.ville}, {order.shippingAddress.commune}
//     </div>

//     <div className="text-sm opacity-60">
//       {order.shippingAddress.quartier}, {order.shippingAddress.avenue}
//     </div>
//     <div className="text-sm opacity-60">
//       {order.shippingAddress.reference}, {order.shippingAddress.numeroTelephone}
//     </div>
   
//   </div>
// </td>

//                         <td>
//                           <div className="font-medium">{totalQuantity} items</div>
//                           <div className="text-sm opacity-60">
//                             {order.orderItems[0]?.name}
//                             {order.orderItems.length > 1 && ` +${order.orderItems.length - 1} more`}
//                           </div>
//                         </td>

//                         <td>
//                           <span className="font-semibold">${order.totalPrice.toFixed(2)}</span>
//                         </td>

//                         <td>
//                           <select
//                             value={order.status}
//                             onChange={(e) => handleStatusChange(order._id, e.target.value)}
//                             className="select select-sm"
//                             disabled={updateStatusMutation.isPending}
//                           >
//                             <option value="pending">Pending</option>
//                             <option value="shipped">Shipped</option>
//                             <option value="delivered">Delivered</option>
//                           </select>
//                         </td>

//                         <td>
//                           <span className="text-sm opacity-60">{formatDate(order.createdAt)}</span>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
// export default OrdersPage;
