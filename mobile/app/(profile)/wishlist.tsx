import { useState } from "react";
import SafeScreen from "@/components/SafeScreen";
import useCart from "@/hooks/useCart";
import useWishlist from "@/hooks/useWishlist";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

function WishlistScreen() {
  const {
    wishlist,
    isLoading,
    isError,
    removeFromWishlist,
    isWishlistLoading,
  } = useWishlist();

  const { addToCart, isAddingToCart } = useCart();

  const [feedbackModal, setFeedbackModal] = useState<{
    visible: boolean;
    title: string;
    message: string;
    type: "success" | "error";
  }>({
    visible: false,
    title: "",
    message: "",
    type: "success",
  });

  const [selectedProduct, setSelectedProduct] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const handleRemoveFromWishlist = (productId: string, productName: string) => {
    setSelectedProduct({
      id: productId,
      name: productName,
    });
  };

  const handleAddToCart = (productId: string, productName: string) => {
    addToCart(
      {
        productId,
        quantity: 1,
      },
      {
        onSuccess: () => {
          setFeedbackModal({
            visible: true,
            title: "Succès",
            message: `${productName} ajouté au charriot!`,
            type: "success",
          });
        },
        onError: (error: any) => {
          setFeedbackModal({
            visible: true,
            title: "Erreur",
            message:
              error?.response?.data?.error ||
              "Echec lors de l'ajout au charriot",
            type: "error",
          });
        },
      },
    );
  };

  if (isLoading) return <LoadingUI />;
  if (isError) return <ErrorUI />;

  return (
    <SafeScreen>
      {/* HEADER */}
      <View className="px-6 pb-5 border-b border-surface flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>

        <Text className="text-text-primary text-2xl font-bold">
          Liste des favoris
        </Text>

        <Text className="text-text-secondary text-sm ml-auto">
          {wishlist.length} {wishlist.length === 1 ? "item" : "items"}
        </Text>
      </View>

      {wishlist.length === 0 ? (
        <View className="flex-1 justify-center items-center px-8">
          <View className="bg-primary/10 p-8 rounded-full">
            <Ionicons name="heart-outline" size={70} color="#00D9FF" />
          </View>

          <Text className="text-text-primary text-2xl font-bold mt-8">
            Aucun favori
          </Text>

          <Text className="text-text-secondary text-center mt-3 leading-6">
            Sauvegardez les produits que vous aimez pour les retrouver
            rapidement plus tard.
          </Text>

          <TouchableOpacity
            className="bg-primary mt-8 px-8 py-4 rounded-2xl"
            activeOpacity={0.8}
            onPress={() => router.push("/(tabs)")}
          >
            <Text className="text-background font-bold">
              Explorer les produits
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 120,
          }}
        >
          {wishlist.map((item) => (
            <View key={item._id} className="bg-surface rounded-3xl p-4 mb-4">
              <View className="flex-row">
                {/* IMAGE + PRICE */}
                <View className="items-center">
                  <Image
                    source={item.images[0]}
                    style={{
                      width: 110,
                      height: 110,
                      borderRadius: 20,
                    }}
                    contentFit="cover"
                  />

                  <Text className="text-primary text-xl font-extrabold mt-3">
                    ${item.price.toFixed(2)}
                  </Text>
                </View>

                {/* CONTENT */}
                <View className="flex-1 ml-4 justify-between">
                  <View>
                    <View className="flex-row items-start">
                      <Text
                        numberOfLines={2}
                        className="flex-1 text-text-primary font-bold text-base"
                      >
                        {item.name}
                      </Text>

                      <TouchableOpacity
                        className="ml-2"
                        onPress={() =>
                          handleRemoveFromWishlist(item._id, item.name)
                        }
                        disabled={isWishlistLoading(item._id)}
                      >
                        {isWishlistLoading(item._id) ? (
                          <ActivityIndicator size="small" color="#1DB954" />
                        ) : (
                          <Ionicons name="heart" size={22} color="#1DB954" />
                        )}
                      </TouchableOpacity>
                    </View>

                    {item.stock > 0 ? (
                      <View className="self-start mt-2 bg-green-500/15 px-3 py-1 rounded-full">
                        <Text className="text-green-500 text-xs font-bold">
                          {item.stock} Disponible
                        </Text>
                      </View>
                    ) : (
                      <View className="self-start mt-2 bg-red-500/15 px-3 py-1 rounded-full">
                        <Text className="text-red-500 text-xs font-bold">
                          Rupture de stock
                        </Text>
                      </View>
                    )}
                  </View>

                  {item.stock > 0 && (
                    <TouchableOpacity
                      className="bg-primary rounded-xl py-3 items-center"
                      activeOpacity={0.8}
                      onPress={() => handleAddToCart(item._id, item.name)}
                      disabled={isAddingToCart(item._id)}
                    >
                      {isAddingToCart(item._id) ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <View className="flex-row items-center justify-center">
                          <Ionicons
                            name="cart-outline"
                            size={18}
                            color="#121212"
                          />
                          <Text className="text-background font-bold ml-2">
                            Ajouter au charriot
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* REMOVE CONFIRMATION MODAL */}
      <Modal
        visible={!!selectedProduct}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedProduct(null)}
      >
        <View className="flex-1 bg-black/60 justify-center items-center px-6">
          <View className="bg-surface rounded-3xl p-6 w-full">
            <View className="items-center">
              <View className="bg-red-500/15 p-4 rounded-full">
                <Ionicons name="heart" size={28} color="#1DB954" />
              </View>

              <Text className="text-text-primary text-xl font-bold mt-4">
                Retirer des favoris ?
              </Text>

              <Text className="text-text-secondary text-center mt-3">
                Voulez-vous vraiment retirer{" "}
                <Text className="font-bold text-text-primary">
                  {selectedProduct?.name}
                </Text>{" "}
                de votre liste des favoris ?
              </Text>
            </View>

            <View className="flex-row mt-8">
              <TouchableOpacity
                className="flex-1 bg-background-lighter py-4 rounded-2xl mr-2"
                onPress={() => setSelectedProduct(null)}
              >
                <Text className="text-center text-text-primary font-semibold">
                  Annuler
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 bg-red-500 py-4 rounded-2xl ml-2"
                onPress={() => {
                  if (selectedProduct) {
                    removeFromWishlist(selectedProduct.id);
                  }
                  setSelectedProduct(null);
                }}
              >
                <Text className="text-center text-white font-semibold">
                  Retirer
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
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
      </Modal>
    </SafeScreen>
  );
}

export default WishlistScreen;

function LoadingUI() {
  return (
    <SafeScreen>
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#1DB954" />
        <Text className="text-text-secondary mt-4">
          Chargement des favoris...
        </Text>
      </View>
    </SafeScreen>
  );
}

function ErrorUI() {
  return (
    <SafeScreen>
      <View className="flex-1 items-center justify-center px-6">
        <Ionicons name="alert-circle-outline" size={64} color="#FF6B6B" />

        <Text className="text-text-primary font-semibold text-xl mt-4">
          Impossible de charger les favoris
        </Text>

        <Text className="text-text-secondary text-center mt-2">
          Vérifiez votre connexion et réessayez.
        </Text>
      </View>
    </SafeScreen>
  );
}
