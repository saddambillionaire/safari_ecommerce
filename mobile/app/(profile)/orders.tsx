import EmptyUI from "@/components/EmptyUI";
import ErrorUI from "@/components/ErrorUI";
import LoadingUI from "@/components/LoadingUI";
import FeedbackModal from "@/components/modals/FeebackMessage";
import RatingModal from "@/components/RatingModal";
import SafeScreen from "@/components/SafeScreen";
import { useOrders } from "@/hooks/useOrders";
import { useReviews } from "@/hooks/useReviews";
import { capitalizeFirstLetter, formatDate, getStatusColor } from "@/lib/utils";
import { Order } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

function OrdersScreen() {
  const { data: orders, isLoading, isError } = useOrders();
  const { createReviewAsync, isCreatingReview } = useReviews();

  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [productRatings, setProductRatings] = useState<{
    [key: string]: number;
  }>({});

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

  const handleOpenRating = (order: Order) => {
    setShowRatingModal(true);
    setSelectedOrder(order);

    // init ratings for all product to 0 - resettin the state for each product
    const initialRatings: { [key: string]: number } = {};
    order.orderItems.forEach((item) => {
      const productId = item.product._id;
      initialRatings[productId] = 0;
    });
    setProductRatings(initialRatings);
  };

  const handleSubmitRating = async () => {
    if (!selectedOrder) return;

    // check if all products have been rated
    const allRated = Object.values(productRatings).every(
      (rating) => rating > 0,
    );
    if (!allRated) {
      setFeedbackModal({
        visible: true,
        title: "Évaluation incomplète",
        message:
          "Veuillez attribuer une note à tous les produits avant de continuer.",
        type: "error",
      });
      return;
    }

    try {
      await Promise.all(
        selectedOrder.orderItems.map((item) => {
          createReviewAsync({
            productId: item.product._id,
            orderId: selectedOrder._id,
            rating: productRatings[item.product._id],
          });
        }),
      );

      setFeedbackModal({
        visible: true,
        title: "Merci pour votre avis !",
        message:
          "Votre avis sur tous les produits a bien été enregistré. Il nous aide à améliorer nos produits et services.",
        type: "success",
      });
      setShowRatingModal(false);
      setSelectedOrder(null);
      setProductRatings({});
    } catch (error: any) {
      setFeedbackModal({
        visible: true,
        title: "Erreur",
        message:
          "Impossible d'envoyer votre avis pour le moment. Veuillez réessayer.",
        type: "error",
      });
    }
  };

  return (
    <SafeScreen>
      {/* Header */}
      <View className="px-6 pb-5 border-b border-surface flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text className="text-text-primary text-2xl font-bold">
          Mes commandes
        </Text>
      </View>

      {isLoading ? (
        <LoadingUI title="Chargement des avis..." />
      ) : isError ? (
        <ErrorUI
          title="Impossible de charger les avis"
          message="Une erreur est survenue lors du chargement des avis. Veuillez réessayer dans quelques instants."
        />
      ) : !orders || orders.length === 0 ? (
        <EmptyUI
          title="Aucun avis disponible"
          message="Les avis des clients apparaîtront ici dès qu'ils seront publiés."
        />
      ) : (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View className="px-6 py-4">
            {orders.map((order) => {
              const totalItems = order.orderItems.reduce(
                (sum, item) => sum + item.quantity,
                0,
              );
              const firstImage = order.orderItems[0]?.image || "";

              return (
                <View
                  key={order._id}
                  className="bg-surface rounded-3xl p-5 mb-4"
                >
                  <View className="flex-row mb-4">
                    <View className="relative">
                      <Image
                        source={firstImage}
                        style={{ height: 80, width: 80, borderRadius: 8 }}
                        contentFit="cover"
                      />

                      {/* BADGE FOR MORE ITEMS */}
                      {order.orderItems.length > 1 && (
                        <View className="absolute -top-1 -right-1 bg-primary rounded-full size-7 items-center justify-center">
                          <Text className="text-background text-xs font-bold">
                            +{order.orderItems.length - 1}
                          </Text>
                        </View>
                      )}
                    </View>

                    <View className="flex-1 ml-4">
                      <Text className="text-text-primary font-bold text-base mb-1">
                        Commande #{order._id.slice(-8).toUpperCase()}
                      </Text>
                      <Text className="text-text-secondary text-sm mb-2">
                        {formatDate(order.createdAt)}
                      </Text>
                      <View
                        className="self-start px-3 py-1.5 rounded-full"
                        style={{
                          backgroundColor: getStatusColor(order.status) + "20",
                        }}
                      >
                        <Text
                          className="text-xs font-bold"
                          style={{ color: getStatusColor(order.status) }}
                        >
                          {capitalizeFirstLetter(order.status)}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* ORDER ITEMS SUMMARY */}
                  {order.orderItems.map((item) => (
                    <Text
                      key={item._id}
                      className="text-text-secondary text-sm flex-1"
                      numberOfLines={1}
                    >
                      {item.name} × {item.quantity}
                    </Text>
                  ))}

                  <View className="border-t border-background-lighter pt-3 flex-row justify-between items-center">
                    <View>
                      <Text className="text-text-secondary text-xs mb-1">
                        {totalItems} articles
                      </Text>
                      <Text className="text-primary font-bold text-xl">
                        ${order.totalPrice.toFixed(2)}
                      </Text>
                    </View>

                    {order.status === "delivered" &&
                      (order.hasReviewed ? (
                        <View className="bg-primary/20 px-5 py-3 rounded-full flex-row items-center">
                          <Ionicons
                            name="checkmark-circle"
                            size={18}
                            color="#1DB954"
                          />
                          <Text className="text-primary font-bold text-sm ml-2">
                            Avis laissé
                          </Text>
                        </View>
                      ) : (
                        <TouchableOpacity
                          className="bg-primary px-5 py-3 rounded-full flex-row items-center"
                          activeOpacity={0.7}
                          onPress={() => handleOpenRating(order)}
                        >
                          <Ionicons name="star" size={18} color="#121212" />
                          <Text className="text-background font-bold text-sm ml-2">
                            Donner une note
                          </Text>
                        </TouchableOpacity>
                      ))}
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      )}

      <RatingModal
        visible={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        order={selectedOrder}
        productRatings={productRatings}
        onSubmit={handleSubmitRating}
        isSubmitting={isCreatingReview}
        onRatingChange={(productId, rating) =>
          setProductRatings((prev) => ({ ...prev, [productId]: rating }))
        }
      />
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
}
export default OrdersScreen;
