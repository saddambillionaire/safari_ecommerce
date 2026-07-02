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
              Les dernières commandes passées sur la plateforme.
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
                          {order.shippingAddress.nomComplet}
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

export default DashboardPage;

