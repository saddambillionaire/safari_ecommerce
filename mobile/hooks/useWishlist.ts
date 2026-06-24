import { useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useApi } from "@/lib/api";
import { Product } from "@/types";

const useWishlist = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  const [wishlistLoadingProductId, setWishlistLoadingProductId] =
    useState<string | null>(null);

  const {
    data: wishlist = [],
    isLoading,
    isError,
  } = useQuery<Product[]>({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const { data } = await api.get<{
        wishlist: Product[];
      }>("/users/wishlist");

      return data.wishlist ?? [];
    },
  });

  const addToWishlistMutation = useMutation({
    mutationFn: async (productId: string) => {
      const { data } = await api.post<{
        wishlist: string[];
      }>("/users/wishlist", { productId });

      return data.wishlist;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["wishlist"],
      });
    },
  });

  const removeFromWishlistMutation = useMutation({
    mutationFn: async (productId: string) => {
      const { data } = await api.delete<{
        wishlist: string[];
      }>(`/users/wishlist/${productId}`);

      return data.wishlist;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["wishlist"],
      });
    },
  });

  const isInWishlist = (productId: string) => {
    return wishlist.some(
      (product) => product._id === productId
    );
  };

  const toggleWishlist = (productId: string) => {
    setWishlistLoadingProductId(productId);

    if (isInWishlist(productId)) {
      removeFromWishlistMutation.mutate(productId, {
        onSettled: () => {
          setWishlistLoadingProductId(null);
        },
      });
    } else {
      addToWishlistMutation.mutate(productId, {
        onSettled: () => {
          setWishlistLoadingProductId(null);
        },
      });
    }
  };

  return {
    wishlist,
    isLoading,
    isError,

    wishlistCount: wishlist.length,

    isInWishlist,
    toggleWishlist,

    addToWishlist: addToWishlistMutation.mutate,
    removeFromWishlist: removeFromWishlistMutation.mutate,

    isAddingToWishlist:
      addToWishlistMutation.isPending,

    isRemovingFromWishlist:
      removeFromWishlistMutation.isPending,

    wishlistLoadingProductId,
  };
};

export default useWishlist;

