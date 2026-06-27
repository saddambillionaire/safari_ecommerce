import ErrorUI from "@/components/ErrorUI";
import FeedbackModal from "@/components/modals/FeebackMessage";
import LoadingUI from "@/components/LoadingUI";
import SafeScreen from "@/components/SafeScreen";
import useCart from "@/hooks/useCart";
import { useProduct } from "@/hooks/useProduct";
import useWishlist from "@/hooks/useWishlist";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  Modal,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

// 🔥 SINGLE SOURCE OF TRUTH (alignment system)
const PAGE_WIDTH = width - 48;

const ProductDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: product, isError, isLoading } = useProduct(id);
  const { addToCart, isAddingToCart } = useCart();

  const { isInWishlist, toggleWishlist, isWishlistLoading } = useWishlist();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const [feedbackModal, setFeedbackModal] = useState({
    visible: false,
    title: "",
    message: "",
    type: "success" as "success" | "error",
  });

  const handleAddToCart = () => {
    if (!product) return;

    addToCart(
      {
        productId: product._id,
        quantity,
      },
      {
        onSuccess: () => {
          setFeedbackModal({
            visible: true,
            title: "Succès",
            message: `${product.name} a été ajouté au panier.`,
            type: "success",
          });
        },

        onError: (error: any) => {
          setFeedbackModal({
            visible: true,
            title: "Erreur",
            message:
              error?.response?.data?.error ||
              "Impossible d'ajouter le produit au panier.",
            type: "error",
          });
        },
      },
    );
  };

  if (isLoading) return <LoadingUI title="Chargement du produit" />;
  if (isError || !product)
    return <ErrorUI title="Ce produit a été supprimé ou n'existe pas" />;

  const inStock = product.stock > 0;

  return (
    <SafeScreen>
      {/* HEADER */}
      <View className="absolute top-0 left-0 right-0 z-10 px-6 pt-20 pb-4 flex-row items-center justify-between">
        <TouchableOpacity
          className="bg-black/50 backdrop-blur-xl w-12 h-12 rounded-full items-center justify-center"
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          className={`w-12 h-12 rounded-full items-center justify-center ${
            isInWishlist(product._id)
              ? "bg-primary"
              : "bg-black/50 backdrop-blur-xl"
          }`}
          onPress={() => toggleWishlist(product._id)}
          disabled={isWishlistLoading(product._id)}
          activeOpacity={0.7}
        >
          {isWishlistLoading(product._id) ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Ionicons
              name={isInWishlist(product._id) ? "heart" : "heart-outline"}
              size={24}
              color={isInWishlist(product._id) ? "#121212" : "#FFFFFF"}
            />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 180,
          paddingHorizontal: 24, // 🔥 GLOBAL ALIGNMENT FIX
        }}
      >
        {/* IMAGE CARD */}
        <View className="mt-3">
          <View className="bg-surface rounded-3xl overflow-hidden">
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              decelerationRate="fast"
              snapToInterval={PAGE_WIDTH}
              onScroll={(e) => {
                const index = Math.round(
                  e.nativeEvent.contentOffset.x / PAGE_WIDTH,
                );
                setSelectedImageIndex(index);
              }}
              scrollEventThrottle={16}
            >
              {product.images.map((image, index) => (
                <View
                  key={index}
                  style={{
                    width: PAGE_WIDTH,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingVertical: 8,
                  }}
                >
                  <Image
                    source={image}
                    contentFit="cover"
                    style={{
                      width: PAGE_WIDTH - 24,
                      height: PAGE_WIDTH - 24,
                      borderRadius: 22,
                    }}
                  />
                </View>
              ))}
            </ScrollView>

            {/* DOTS */}
            <View className="flex-row justify-center items-center pb-3 pt-1">
              {product.images.map((_, index) => (
                <View
                  key={index}
                  className={`mx-1 rounded-full ${
                    index === selectedImageIndex
                      ? "bg-primary w-7 h-2"
                      : "bg-text-secondary/30 w-2 h-2"
                  }`}
                />
              ))}
            </View>
          </View>
        </View>

        {/* PRODUCT INFORMATION */}
        <View className="mt-5 bg-surface rounded-3xl p-6">
          <View className="self-start bg-primary/15 px-4 py-2 rounded-full mb-4">
            <Text className="text-primary text-xs font-bold">
              {product.category}
            </Text>
          </View>

          <Text className="text-text-primary text-3xl font-bold">
            {product.name}
          </Text>

          <View className="flex-row items-center mt-5">
            <View className="bg-background rounded-full px-3 py-2 flex-row items-center">
              <Ionicons name="star" size={16} color="#FFC107" />

              <Text className="text-text-primary font-bold ml-2">
                {product.averageRating.toFixed(1)}
              </Text>

              <Text className="text-text-secondary ml-2">
                ({product.totalReviews} reviews)
              </Text>
            </View>

            <View className="ml-3 flex-row items-center">
              <View
                className={`w-2 h-2 rounded-full mr-2 ${
                  inStock ? "bg-green-500" : "bg-red-500"
                }`}
              />

              <Text
                className={`font-semibold ${
                  inStock ? "text-green-500" : "text-red-500"
                }`}
              >
                {inStock ? `${product.stock} in stock` : "Out of stock"}
              </Text>
            </View>
          </View>

          <Text className="text-primary text-5xl font-bold mt-6">
            ${product.price.toFixed(2)}
          </Text>

          <View className="h-px bg-background my-6" />

          <Text className="text-text-primary text-lg font-bold mb-4">
            Quantity
          </Text>

          <View className="bg-background rounded-2xl p-4 mb-6">
            <View className="flex-row items-center justify-between">
              <TouchableOpacity
                className="w-12 h-12 rounded-full bg-surface items-center justify-center"
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={!inStock}
              >
                <Ionicons
                  name="remove"
                  size={22}
                  color={inStock ? "#FFFFFF" : "#666"}
                />
              </TouchableOpacity>

              <Text className="text-3xl font-bold text-text-primary">
                {quantity}
              </Text>

              <TouchableOpacity
                className="w-12 h-12 rounded-full bg-primary items-center justify-center"
                onPress={() =>
                  setQuantity(Math.min(product.stock, quantity + 1))
                }
                disabled={!inStock || quantity >= product.stock}
              >
                <Ionicons
                  name="add"
                  size={22}
                  color={
                    !inStock || quantity >= product.stock ? "#666" : "#121212"
                  }
                />
              </TouchableOpacity>
            </View>

            {quantity >= product.stock && inStock && (
              <Text className="text-orange-500 text-center mt-4">
                Maximum stock reached
              </Text>
            )}
          </View>

          <View className="h-px bg-background mb-6" />

          <Text className="text-text-primary text-lg font-bold">
            Description
          </Text>

          <Text className="text-text-secondary text-base leading-7 mt-3">
            {product.description}
          </Text>
        </View>
      </ScrollView>

      {/* PURCHASE CARD */}
      <View className="absolute bottom-0 left-0 right-0 px-6 pb-6">
        <View className="bg-surface rounded-3xl border border-background p-6">
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-text-secondary text-sm">Prix total</Text>

              <Text className="text-primary text-3xl font-bold mt-1">
                ${(product.price * quantity).toFixed(2)}
              </Text>
            </View>

            <View className="items-end">
              <Text className="text-text-secondary text-sm">Quantité</Text>

              <Text className="text-text-primary text-xl font-bold mt-1">
                {quantity}
              </Text>
            </View>
          </View>

          {/* ACTION ROW */}
          <View className="flex-row items-stretch gap-3">
            {/* MINUS (GREY ONLY) */}
            <TouchableOpacity
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={!inStock}
              className="w-14 h-14 rounded-2xl items-center justify-center"
              style={{ backgroundColor: "#666" }}
              activeOpacity={0.7}
            >
              <Ionicons name="remove" size={20} color="#FFFFFF" />
            </TouchableOpacity>

            {/* PLUS (PRIMARY) */}
            <TouchableOpacity
              onPress={() => setQuantity(Math.min(product.stock, quantity + 1))}
              disabled={!inStock || quantity >= product.stock}
              className="w-14 h-14 rounded-2xl bg-primary items-center justify-center"
              activeOpacity={0.7}
            >
              <Ionicons name="add" size={20} color="#121212" />
            </TouchableOpacity>

            {/* ADD TO CART (WIDER + TIGHTER PADDING) */}
            <TouchableOpacity
              className={`flex-1 h-14 rounded-2xl flex-row items-center justify-center px-4 ${
                !inStock ? "bg-surface" : "bg-primary"
              }`}
              style={{
                flexGrow: 1.3, // 🔥 makes it slightly wider than default flex
              }}
              activeOpacity={0.8}
              onPress={handleAddToCart}
              disabled={!inStock || isAddingToCart(product._id)}
            >
              {isAddingToCart(product._id) ? (
                <ActivityIndicator size="small" color="#121212" />
              ) : (
                <Ionicons name="cart" size={22} color="#121212" />
              )}

              <Text
                className={`ml-2 text-base font-bold ${
                  !inStock ? "text-text-secondary" : "text-background"
                }`}
              >
                {!inStock ? "Pas de stock" : "Ajouter au charriot"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* MODAL */}
      <FeedbackModal
  visible={feedbackModal.visible}
  title={feedbackModal.title}
  message={feedbackModal.message}
  type={feedbackModal.type}
  onClose={() =>
    setFeedbackModal((prev) => ({
      ...prev,
      visible: false,
    }))
  }
/>
      
    </SafeScreen>
  );
};

export default ProductDetailScreen;


{/* <Modal
        visible={feedbackModal.visible}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setFeedbackModal((prev) => ({ ...prev, visible: false }))
        }
      >
        <View className="flex-1 bg-black/60 justify-center items-center px-6">
          <View className="bg-surface rounded-3xl p-6 w-full">
            <View className="items-center">
              <View
                className={`p-4 rounded-full ${
                  feedbackModal.type === "success"
                    ? "bg-green-500/15"
                    : "bg-red-500/15"
                }`}
              >
                <Ionicons
                  name={
                    feedbackModal.type === "success" ? "checkmark" : "close"
                  }
                  size={28}
                  color={
                    feedbackModal.type === "success" ? "#1DB954" : "#EF4444"
                  }
                />
              </View>

              <Text className="text-text-primary text-xl font-bold mt-4">
                {feedbackModal.title}
              </Text>

              <Text className="text-text-secondary text-center mt-3">
                {feedbackModal.message}
              </Text>
            </View>

            <TouchableOpacity
              className="mt-6 bg-primary py-4 rounded-2xl"
              onPress={() =>
                setFeedbackModal((prev) => ({ ...prev, visible: false }))
              }
            >
              <Text className="text-center text-background font-bold">OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal> */}