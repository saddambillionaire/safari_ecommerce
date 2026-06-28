import { Product } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import useWishlist from "@/hooks/useWishlist";
import useCart from "@/hooks/useCart";
import React from "react";
import { router } from "expo-router";
import LoadingUI from "./LoadingUI";
import ErrorUI from "./ErrorUI";
import EmptyUI from "./EmptyUI";
import { toast } from "@/lib/toast";

interface ProductsGridProps {
  isLoading: boolean;
  isError: boolean;
  products: Product[];
}

const ProductsGrid = ({ products, isLoading, isError }: ProductsGridProps) => {
  const { isInWishlist, toggleWishlist, isWishlistLoading } = useWishlist();

  const { addToCart, isAddingToCart } = useCart();

  const handleAddToCart = (productId: string, productName: string) => {
    addToCart(
      {
        productId,
        quantity: 1,
      },
      {
        onSuccess: () => {
          toast.success(`${productName} a été ajouté au charriot.`);
        },

        onError: (error: any) => {
          toast.error(
            error?.response?.data?.error || "Échec de l'ajout au panier.",
          );
        },
      },
    );
  };

  const renderProduct = ({ item: product }: { item: Product }) => {
    const isAdding = isAddingToCart(product._id);

    const wishlistLoading = isWishlistLoading(product._id);

    return (
      <TouchableOpacity
        className="bg-surface rounded-3xl overflow-hidden mb-3"
        style={{ width: "48%" }}
        activeOpacity={0.8}
        onPress={() => router.push(`/product/${product._id}`)}
      >
        {/* IMAGE */}
        <View className="relative">
          <Image
            source={{
              uri: product.images?.[0],
            }}
            className="w-full h-44 bg-background-lighter"
            resizeMode="cover"
          />

          {/* WISHLIST */}
          <TouchableOpacity
            className="absolute top-3 right-3 bg-black/30 p-2 rounded-full"
            activeOpacity={0.7}
            onPress={() => toggleWishlist(product._id)}
            disabled={wishlistLoading}
          >
            {wishlistLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Ionicons
                name={isInWishlist(product._id) ? "heart" : "heart-outline"}
                size={18}
                color={isInWishlist(product._id) ? "#1DB954" : "#FFFFFF"}
              />
            )}
          </TouchableOpacity>
        </View>

        {/* DETAILS */}
        <View className="p-3">
          <Text className="text-text-secondary text-xs mb-1">
            {product.category}
          </Text>

          <Text
            className="text-text-primary font-bold text-sm mb-2"
            numberOfLines={2}
          >
            {product.name}
          </Text>

          <View className="flex-row items-center mb-2">
            <Ionicons name="star" size={12} color="#FFC107" />

            <Text className="text-text-primary text-xs font-semibold ml-1">
              {product.averageRating?.toFixed(1) ?? "0.0"}
            </Text>

            <Text className="text-text-secondary text-xs ml-1">
              ({product.totalReviews ?? 0})
            </Text>
          </View>

          {/* PRICE + CART */}
          <View className="flex-row items-center justify-between">
            <Text className="text-primary font-bold text-lg">
              $
              {typeof product.price === "number"
                ? product.price.toFixed(2)
                : "0.00"}
            </Text>

            <TouchableOpacity
              className="bg-primary rounded-full w-8 h-8 items-center justify-center"
              activeOpacity={0.7}
              onPress={() => handleAddToCart(product._id, product.name)}
              disabled={isAdding}
            >
              {isAdding ? (
                <ActivityIndicator size="small" color="#121212" />
              ) : (
                <Ionicons name="add" size={18} color="#121212" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return <LoadingUI title="Chargement des produits" />;
  }

  if (isError) {
    return (
      <ErrorUI
        title="Impossible de charger les produits"
        message="Une erreur est survenue lors du chargement des produits. Vérifiez votre connexion Internet ou réessayez dans quelques instants."
      />
    );
  }

  return (
    <FlatList
      data={products}
      renderItem={renderProduct}
      keyExtractor={(item) => item._id}
      numColumns={2}
      columnWrapperStyle={{
        justifyContent: "space-between",
      }}
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}
      ListEmptyComponent={NoProductsFound}
    />
  );
};

export default ProductsGrid;

const NoProductsFound = () => (
  <EmptyUI
    title="Aucun produit disponible"
    message="Aucun produit ne correspond à votre recherche pour le moment."
  />
);
