import { Product } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import useWishlist from "@/hooks/useWishlist";
import useCart from "@/hooks/useCart";
import React from "react";

interface ProductsGridProps {
  isLoading: boolean;
  isError: boolean;
  products: Product[];
}

const ProductsGrid = ({ products, isLoading, isError }: ProductsGridProps) => {
  const {
    isInWishlist,
    toggleWishlist,
    isAddingToWishlist,
    isRemovingFromWishlist,
  } = useWishlist();

  const { isAddingToCart, addToCart } = useCart();

  const handleAddToCart = (productId: string, productName: string) => {
    addToCart(
      { productId, quantity: 1 },
      {
        onSuccess: () => {
          Alert.alert("Success", `${productName} added to cart!`);
        },
        onError: (error: any) => {
          Alert.alert(
            "Error",
            error?.response?.data?.error ||
              "Echec survenu lors de l'ajout au charriot",
          );
        },
      },
    );
  };

  const renderProduct = ({ item: product }: { item: Product }) => {
    const isAdding = isAddingToCart(product._id);

    return (
      <TouchableOpacity
        className="bg-surface rounded-3xl overflow-hidden mb-3"
        style={{ width: "48%" }}
        activeOpacity={0.8}
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

          {/* WISHLIST BUTTON */}
          <TouchableOpacity
            className="absolute top-3 right-3 bg-black/30 p-2 rounded-full"
            activeOpacity={0.7}
            onPress={() => toggleWishlist(product._id)}
            disabled={isAddingToWishlist || isRemovingFromWishlist}
          >
            {isAddingToWishlist || isRemovingFromWishlist ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Ionicons
                name={isInWishlist(product._id) ? "heart" : "heart-outline"}
                size={18}
                color={
                  isInWishlist(product._id)
                    ? "#1DB954" // Spotify green
                    : "#FFFFFF"
                }
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
              {product.averageRating.toFixed(1)}
            </Text>
            <Text className="text-text-secondary text-xs ml-1">
              ({product.totalReviews})
            </Text>
          </View>

          {/* PRICE + CART */}
          <View className="flex-row items-center justify-between">
            <Text className="text-primary font-bold text-lg">
              <Text className="text-primary font-bold text-lg">
                ${product.price ? product.price.toFixed(2) : "0.00"}
              </Text>
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
    return (
      <View className="py-20 items-center justify-center">
        <ActivityIndicator size="large" color="#121212" />
        <Text className="text-text-secondary mt-4">
          Chargement des produits...
        </Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="py-20 items-center justify-center">
        <Ionicons name="alert-circle-outline" size={48} color="#FF6B6B" />
        <Text className="text-text-primary font-semibold mt-4">
          Echec de chargement des produits
        </Text>
        <Text className="text-text-secondary text-sm mt-2">
          Veuillez réessayer plus tard
        </Text>
      </View>
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

function NoProductsFound() {
  return (
    <View className="py-20 items-center justify-center">
      <Ionicons name="search-outline" size={48} color="#666" />
      <Text className="text-text-primary font-semibold mt-4">
        Pas de produits trouvés
      </Text>
      <Text className="text-text-secondary text-sm mt-2">
        Réessayez votre filtre des produits
      </Text>
    </View>
  );
}
