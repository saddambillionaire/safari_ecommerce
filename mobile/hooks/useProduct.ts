import { useQuery } from "@tanstack/react-query";
import { Product } from "@/types";
import { useApi } from "@/lib/api";

export const useProduct = (productId: string) => {
  const api = useApi();

  const result = useQuery<Product>({
    queryKey: ["product", productId],
    queryFn: async () => {
      const { data } = await api.get(`/products/${productId}`);
      return data;
    },
    enabled: !!productId,
  });

  return result;
};
