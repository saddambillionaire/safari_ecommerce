import { useRef } from "react";
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

  // produit actuellement en cours d'ajout/suppression
  const wishlistLoadingProductId = useRef<string | null>(null);

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
      wishlistLoadingProductId.current = productId;

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

    onSettled: () => {
      wishlistLoadingProductId.current = null;
    },
  });

  const removeFromWishlistMutation = useMutation({
    mutationFn: async (productId: string) => {
      wishlistLoadingProductId.current = productId;

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

    onSettled: () => {
      wishlistLoadingProductId.current = null;
    },
  });

  const isInWishlist = (productId: string) => {
    return wishlist.some(
      (product) => product._id === productId
    );
  };

  const toggleWishlist = (productId: string) => {
    if (isInWishlist(productId)) {
      removeFromWishlistMutation.mutate(productId);
    } else {
      addToWishlistMutation.mutate(productId);
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

    // ✅ loading seulement pour le produit concerné
    isWishlistLoading: (productId: string) =>
      wishlistLoadingProductId.current === productId,

    // optionnel pour debug
    isWishlistPending:
      addToWishlistMutation.isPending ||
      removeFromWishlistMutation.isPending,
  };
};

export default useWishlist;

