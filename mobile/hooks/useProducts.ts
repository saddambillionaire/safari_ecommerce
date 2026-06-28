import { useApi } from "@/lib/api";
import { Product } from "@/types";
import { useQuery } from "@tanstack/react-query";

const useProducts = () => {
  const api = useApi();

  const result = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
       try {
      const { data } = await api.get<Product[]>("/products");

      console.log("✅ Products fetched:", data.length);

      return data;
    } catch (error: any) {
      console.log("❌ Products error:", error.message);
      console.log("status:", error.response?.status);
      console.log("data:", error.response?.data);
      console.log("baseURL:", error.config?.baseURL);
      console.log("url:", error.config?.url);

      throw error;
    }
    } 
  });

  return result;
};

export default useProducts;


// import { useApi } from "@/lib/api";
// import { Product } from "@/types";
// import { useQuery } from "@tanstack/react-query";

// const useProducts = () => {
//   const api = useApi();

//   const result = useQuery({
//     queryKey: ["products"],
//     queryFn: async () => {
//       const { data } = await api.get<Product[]>("/products");
//       return data;
//     } 
//   });

//   return result;
// };

// export default useProducts;
