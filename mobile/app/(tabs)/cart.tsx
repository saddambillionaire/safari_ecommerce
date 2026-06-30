import SafeScreen from "@/components/SafeScreen";
import { useAddresses } from "@/hooks/useAddressess";
import useCart from "@/hooks/useCart";
import { useApi } from "@/lib/api";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useStripe } from "@stripe/stripe-react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import OrderSummary from "@/components/OrderSummary";
import AddressSelectionModal from "@/components/AddressSelectionModal";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import FeedbackModal from "@/components/modals/FeebackMessage";

import * as Sentry from "@sentry/react-native";
import LoadingUI from "@/components/LoadingUI";
import ErrorUI from "@/components/ErrorUI";
import EmptyUI from "@/components/EmptyUI";
import CartItem from "@/components/CartItem";
import { Address } from "@/types";

const CartScreen = () => {
  const api = useApi();

  const [confirmationModal, setConfirmationModal] = useState({
    visible: false,
    title: "",
    message: "",
    icon: "trash-outline" as keyof typeof Ionicons.glyphMap,
    type: "danger" as "danger" | "warning",
    confirmText: "Confirmer",
    cancelText: "Annuler",
    onConfirm: () => {},
  });

  const {
    cart,
    cartItemCount,
    cartTotal,
    clearCart,
    isError,
    isLoading,
    updateQuantity,
    removeFromCart,
    isIncreasing,
    isDecreasing,
  } = useCart();

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

  const { addresses } = useAddresses();

  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const [paymentLoading, setPaymentLoading] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false);

  const cartItems = cart?.items || [];
  const subtotal = cartTotal;
  const shipping = 10.0; // $10 shipping fee
  const tax = subtotal * 0.16; // 16% tax
  const total = subtotal + shipping + tax;

  const handleQuantityChange = (
    productId: string,
    currentQuantity: number,
    delta: number,
  ) => {
    updateQuantity({
      productId,
      quantity: currentQuantity + delta,
      action: delta > 0 ? "increase" : "decrease",
    });
  };

  const handleRemoveItem = (productId: string, productName: string) => {
    setConfirmationModal({
      visible: true,
      title: "Rétirer l'article",
      message: `Voulez-vous vraiment rétier ${productName} du charriot?`,
      icon: "trash-outline",
      type: "danger",
      confirmText: "Remove",
      cancelText: "Cancel",
      onConfirm: () => {
        removeFromCart(productId);

        setConfirmationModal((prev) => ({
          ...prev,
          visible: false,
        }));
      },
    });
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    // check if user has addresses
    if (!addresses || addresses.length === 0) {
      setFeedbackModal({
        visible: true,
        title: "Aucune adresse",
        message:
          "Veuillez ajouter une adresse de livraison avant de passer votre commande.",
        type: "error",
      });

      return;
    }

    // show address selection modal
    setAddressModalVisible(true);
  };

  const handleProceedWithPayment = async (selectedAddress: Address) => {
    setAddressModalVisible(false);

    // log chechkout initiated
    Sentry.logger.info("Passation de commande initiée", {
      itemCount: cartItemCount,
      total: total.toFixed(2),
      ville: selectedAddress.ville,
    });

    try {
      setPaymentLoading(true);

      // create payment intent with cart items and shipping address
      const { data } = await api.post("/payment/create-intent", {
        cartItems,
        shippingAddress: {
          nomComplet: selectedAddress.nomComplet,
          commune: selectedAddress.commune,
          quartier: selectedAddress.quartier,
          avenue: selectedAddress.avenue,
          reference: selectedAddress.reference,
          numeroTelephone: selectedAddress.numeroTelephone,
        },
      });

      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: data.clientSecret,
        merchantDisplayName: "Safari-mart",
      });

      if (initError) {
        Sentry.logger.error(
          "L'initialisation de la feuille de paiement a échoué",
          {
            errorCode: initError.code,
            errorMessage: initError.message,
            cartTotal: total,
            itemCount: cartItems.length,
          },
        );

        setFeedbackModal({
          visible: true,
          title: "Erreur",
          message: initError.message,
          type: "error",
        });
      }

      // present payment sheet
      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        Sentry.logger.error("Paiement annulé", {
          errorCode: presentError.code,
          errorMessage: presentError.message,
          cartTotal: total,
          itemCount: cartItems.length,
        });

        setFeedbackModal({
          visible: true,
          title: "Paiement annulé",
          message: presentError.message,
          type: "error",
        });
      } else {
        Sentry.logger.info("Succès de paiement", {
          total: total.toFixed(2),
          itemCount: cartItems.length,
        });

        (setFeedbackModal({
          visible: true,
          title: "Paiement réussi",
          message:
            "Votre paiement a été effectué avec succès. Votre commande est en cours de traitement.",
          type: "success",
        }),
          [{ text: "OK", onPress: () => {} }]);
        clearCart();
      }
    } catch (error) {
      Sentry.logger.error("Le paiement a échoué", {
        error: error instanceof Error ? error.message : "Erreur inconue",
        cartTotal: total,
        itemCount: cartItems.length,
      });

      setFeedbackModal({
        visible: true,
        title: "Erreur",
        message: "Impossible de traiter le paiement.",
        type: "error",
      });
    } finally {
      setPaymentLoading(false);
    }
  };

  if (isLoading) return <LoadingUI title="Chargement de votre panier..." />;
  if (isError)
    return (
      <ErrorUI
        title="Erreur de chargement"
        message="Impossible d’afficher votre panier. Vérifiez votre connexion et réessayez."
      />
    );
  if (cartItems.length === 0)
    return (
      <EmptyUI
        title="Panier vide"
        message="Votre panier est vide pour le moment. Ajoutez des articles pour continuer vos achats."
      />
    );

  return (
    <SafeScreen>
      <Text className="px-6 pb-5 text-text-primary text-3xl font-bold tracking-tight">
        Charriot
      </Text>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 240 }}
      >
        <View className="px-6">
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item._id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: 6 }} />}
            renderItem={({ item }) => (
              <CartItem
                item={item}
                onIncrease={(productId) => {
                  handleQuantityChange(productId, item.quantity, +1);
                }}
                onDecrease={(productId, quantity) => {
                  handleQuantityChange(productId, quantity, -1);
                }}
                onRemove={handleRemoveItem}
                isIncreasing={isIncreasing(item.product._id)}
                isDecreasing={isDecreasing(item.product._id)}
              />
            )}
          />
        </View>

        <OrderSummary
          subtotal={subtotal}
          shipping={shipping}
          tax={tax}
          total={total}
        />
      </ScrollView>

      <View
        className="absolute bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t
       border-surface pt-4 pb-32 px-6"
      >
        {/* Quick Stats */}
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <Ionicons name="cart" size={20} color="#1DB954" />
            <Text className="text-text-secondary ml-2">
              {cartItemCount} {cartItemCount === 1 ? "article" : "articles"}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Text className="text-text-primary font-bold text-xl">
              ${total.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Checkout Button */}
        <TouchableOpacity
          className="bg-primary rounded-2xl overflow-hidden"
          activeOpacity={0.9}
          onPress={handleCheckout}
          disabled={paymentLoading}
        >
          <View className="py-5 flex-row items-center justify-center">
            {paymentLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Text className="text-background font-bold text-xl mr-2">
                  Passer la commande
                </Text>
                <Ionicons name="arrow-forward" size={20} color="#121212" />
              </>
            )}
          </View>
        </TouchableOpacity>
      </View>

      <AddressSelectionModal
        visible={addressModalVisible}
        onClose={() => setAddressModalVisible(false)}
        onProceed={handleProceedWithPayment}
        isProcessing={paymentLoading}
      />
      <ConfirmationModal
        visible={confirmationModal.visible}
        title={confirmationModal.title}
        message={confirmationModal.message}
        type={confirmationModal.type}
        icon={confirmationModal.icon}
        confirmText="Supprimer"
        cancelText="Annuler"
        onCancel={() =>
          setConfirmationModal((prev) => ({
            ...prev,
            visible: false,
          }))
        }
        onConfirm={confirmationModal.onConfirm}
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
};

export default CartScreen;
