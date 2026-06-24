import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Cart } from "@/types";
import { useApi } from "@/lib/api";
import { useRef } from "react";

const useCart = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  // 👉 tracks which product is currently being added
  const addingProductId = useRef<string | null>(null);

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
    }: {
      productId: string;
      quantity: number;
    }) => {
      const { data } = await api.put<{ cart: Cart }>(
        `/cart/${productId}`,
        { quantity }
      );
      return data.cart;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (productId: string) => {
      const { data } = await api.delete<{ cart: Cart }>(
        `/cart/${productId}`
      );
      return data.cart;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.delete<{ cart: Cart }>("/cart");
      return data.cart;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });
  const cartTotal =
  cart?.items?.reduce((sum, item) => {
    const price = item.productId?.price ?? 0;
    return sum + price * item.quantity;
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
    clearCart: clearCartMutation.mutate,

    // ✅ FIX: per-product loading
    isAddingToCart: (productId: string) =>
      addingProductId.current === productId,

    isUpdating: updateQuantityMutation.isPending,
    isRemoving: removeFromCartMutation.isPending,
    isClearing: clearCartMutation.isPending,
  };
};

export default useCart;

