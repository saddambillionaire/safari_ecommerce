export const capitalizeText = (text) => {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const getOrderStatusBadge = (status) => {
  switch (status?.toLowerCase()) {
    case "delivered":
      return "badge-success";
    case "shipped":
      return "badge-info";
    case "pending":
      return "badge-warning";
    default:
      return "badge-ghost";
  }
};

export const getStockStatusBadge = (stock) => {
  if (stock === 0) return { text: "En rupture de stock", class: "badge-error" };
  if (stock < 20) return { text: "Stock minime ", class: "badge-warning" };
  return { text: "En Stock", class: "badge-success" };
};

export const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
