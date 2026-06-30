import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/lib/api";
import { Cart } from "@/types";
import { useRef } from "react";

const useCart = () => {
  const api = useApi();
  const queryClient = useQueryClient();
  const addingProductId = useRef<string | null>(null);
  const updating = useRef<{
    productId: string | null;
    action: "increase" | "decrease" | null;
  }>({
    productId: null,
    action: null,
  });

  const {
    data: cart,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const { data } = await api.get<{ cart: Cart }>("/cart");
      return data.cart;
    },
  });

  const addToCartMutation = useMutation({
    mutationFn: async ({
      productId,
      quantity = 1,
    }: {
      productId: string;
      quantity?: number;
    }) => {
      addingProductId.current = productId;

      const { data } = await api.post<{ cart: Cart }>("/cart", {
        productId,
        quantity,
      });

      return data.cart;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },

    onSettled: () => {
      addingProductId.current = null;
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({
      productId,
      quantity,
      action,
    }: {
      productId: string;
      quantity: number;
      action: "increase" | "decrease";
    }) => {
      updating.current = {
        productId,
        action,
      };

      const { data } = await api.put<{ cart: Cart }>(`/cart/${productId}`, {
        quantity,
      });

      return data.cart;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },

    onSettled: () => {
      updating.current = {
        productId: null,
        action: null,
      };
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (productId: string) => {
      const { data } = await api.delete<{ cart: Cart }>(`/cart/${productId}`);
      return data.cart;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.delete<{ cart: Cart }>("/cart");
      return data.cart;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const cartTotal =
    cart?.items
      ?.filter((i) => i?.product?.price != null)
      .reduce((sum, item) => {
        return sum + item.product.price * item.quantity;
      }, 0) ?? 0;

  const cartItemCount =
    cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  return {
    cart,
    isLoading,
    isError,
    cartTotal,
    cartItemCount,
    addToCart: addToCartMutation.mutate,
    updateQuantity: updateQuantityMutation.mutate,
    removeFromCart: removeFromCartMutation.mutate,
    clearCart: clearCartMutation.mutateAsync,
    isAddingToCart: (productId: string) =>
      addToCartMutation.isPending && addingProductId.current === productId,
    isIncreasing: (productId: string) =>
      updateQuantityMutation.isPending &&
      updating.current.productId === productId &&
      updating.current.action === "increase",

    isDecreasing: (productId: string) =>
      updateQuantityMutation.isPending &&
      updating.current.productId === productId &&
      updating.current.action === "decrease",

    isClearing: clearCartMutation.isPending,
  };
};
export default useCart;

// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { useApi } from "@/lib/api";
// import { Cart } from "@/types";

// const useCart = () => {
//   const api = useApi();
//   const queryClient = useQueryClient();

//   const {
//     data: cart,
//     isLoading,
//     isError,
//   } = useQuery({
//     queryKey: ["cart"],
//     queryFn: async () => {
//       const { data } = await api.get<{ cart: Cart }>("/cart");
//       return data.cart;
//     },
//   });

//   const addToCartMutation = useMutation({
//     mutationFn: async ({ productId, quantity = 1 }: { productId: string; quantity?: number }) => {
//       const { data } = await api.post<{ cart: Cart }>("/cart", { productId, quantity });
//       return data.cart;
//     },
//     onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
//   });

//   const updateQuantityMutation = useMutation({
//     mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
//       const { data } = await api.put<{ cart: Cart }>(`/cart/${productId}`, { quantity });
//       return data.cart;
//     },
//     onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
//   });

//   const removeFromCartMutation = useMutation({
//     mutationFn: async (productId: string) => {
//       const { data } = await api.delete<{ cart: Cart }>(`/cart/${productId}`);
//       return data.cart;
//     },
//     onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
//   });

//   const clearCartMutation = useMutation({
//     mutationFn: async () => {
//       const { data } = await api.delete<{ cart: Cart }>("/cart");
//       return data.cart;
//     },
//     onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
//   });

//   const cartTotal =
//     cart?.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0) ?? 0;

//   const cartItemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

//   return {
//     cart,
//     isLoading,
//     isError,
//     cartTotal,
//     cartItemCount,
//     addToCart: addToCartMutation.mutate,
//     updateQuantity: updateQuantityMutation.mutate,
//     removeFromCart: removeFromCartMutation.mutate,
//     clearCart: clearCartMutation.mutate,
//     isAddingToCart: addToCartMutation.isPending,
//     isUpdating: updateQuantityMutation.isPending,
//     isRemoving: removeFromCartMutation.isPending,
//     isClearing: clearCartMutation.isPending,
//   };
// };
// export default useCart;
