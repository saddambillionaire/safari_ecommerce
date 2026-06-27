import AddressCard from "@/components/AddressCard";
import AddressesHeader from "@/components/AddressesHeader";
import AddressFormModal from "@/components/AddressFormModal";
import ErrorUI from "@/components/ErrorUI";
import LoadingUI from "@/components/LoadingUI";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import FeedbackModal from "@/components/modals/FeebackMessage";
import SafeScreen from "@/components/SafeScreen";
import { useAddresses } from "@/hooks/useAddressess";
import { Address, FeedbackState } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";


function AddressesScreen() {
  const {
    addAddress,
    addresses,
    deleteAddress,
    isAddingAddress,
    isDeletingAddress,
    isError,
    isLoading,
    isUpdatingAddress,
    updateAddress,
  } = useAddresses();

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  const [selectedAddress, setSelectedAddress] = useState<{
    id: string;
    label: string;
  } | null>(null);

  const [feedbackModal, setFeedbackModal] =
  useState<FeedbackState>({
    visible: false,
    title: "",
    message: "",
    type: "success",
  });

  const [addressForm, setAddressForm] = useState({
    label: "",
    nomComplet: "",
    ville: "",
    commune: "",
    quartier: "",
    avenue: "",
    reference: "",
    numeroTelephone: "",
    isDefault: false,
  });

  const handleAddAddress = () => {
    setShowAddressForm(true);
    setEditingAddressId(null);

    setAddressForm({
      label: "",
      nomComplet: "",
      ville: "",
      commune: "",
      quartier: "",
      avenue: "",
      reference: "",
      numeroTelephone: "",
      isDefault: false,
    });
  };

  const handleEditAddress = (address: Address) => {
    setShowAddressForm(true);
    setEditingAddressId(address._id);

    setAddressForm({
      label: address.label,
      nomComplet: address.nomComplet,
      ville: address.ville,
      commune: address.commune,
      quartier: address.quartier,
      avenue: address.avenue,
      reference: address.reference,
      numeroTelephone: address.numeroTelephone,
      isDefault: address.isDefault,
    });
  };

  const handleDeleteAddress = (addressId: string, label: string) => {
    setSelectedAddress({
      id: addressId,
      label,
    });
  };

  const handleSaveAddress = () => {
    if (
      !addressForm.nomComplet ||
      !addressForm.ville ||
      !addressForm.commune ||
      !addressForm.quartier ||
      !addressForm.avenue ||
      !addressForm.numeroTelephone
    ) {
      setFeedbackModal({
        visible: true,
        title: "Erreur",
        message: "Veuillez remplir tous les champs",
        type: "error",
      });

      return;
    }

    if (editingAddressId) {
      updateAddress(
        {
          addressId: editingAddressId,
          addressData: addressForm,
        },
        {
          onSuccess: () => {
            setShowAddressForm(false);
            setEditingAddressId(null);

            setFeedbackModal({
              visible: true,
              title: "Succès",
              message: "Adresse mise à jour avec succès",
              type: "success",
            });
          },

          onError: (error: any) => {
            setFeedbackModal({
              visible: true,
              title: "Erreur",
              message:
                error?.response?.data?.error ||
                "Échec de la mise à jour de l'adresse",
              type: "error",
            });
          },
        },
      );
    } else {
      addAddress(addressForm, {
        onSuccess: () => {
          setShowAddressForm(false);

          setFeedbackModal({
            visible: true,
            title: "Succès",
            message: "Adresse ajoutée avec succès",
            type: "success",
          });
        },

        onError: (error: any) => {
          setFeedbackModal({
            visible: true,
            title: "Erreur",
            message:
              error?.response?.data?.error || "Échec de l'ajout de l'adresse",
            type: "error",
          });
        },
      });
    }
  };

  const handleCloseAddressForm = () => {
    setShowAddressForm(false);
    setEditingAddressId(null);
  };

  if (isLoading) return <LoadingUI title="Chargement des adresses"/>;

  if (isError)
  return (
    <ErrorUI
      title="Échec du chargement des adresses"
      message="Impossible de récupérer vos adresses. Vérifiez votre connexion et réessayez."
    />
  );

  return (
    <SafeScreen>
      <AddressesHeader />

      {addresses.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="location-outline" size={80} color="#666" />

          <Text className="text-text-primary font-semibold text-xl mt-4">
            Aucune adresse enregistrée
          </Text>

          <Text className="text-text-secondary text-center mt-2">
            Ajoutez votre première adresse de livraison
          </Text>

          <TouchableOpacity
            className="bg-primary rounded-2xl px-8 py-4 mt-6"
            activeOpacity={0.8}
            onPress={handleAddAddress}
          >
            <Text className="text-background font-bold text-base">
              Ajouter une adresse
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View className="px-6 py-4">
            {addresses.map((address) => (
              <AddressCard
                key={address._id}
                address={address}
                onEdit={handleEditAddress}
                onDelete={handleDeleteAddress}
                isUpdatingAddress={isUpdatingAddress}
                isDeletingAddress={isDeletingAddress}
              />
            ))}

            <TouchableOpacity
              className="bg-primary rounded-2xl py-4 items-center mt-2"
              activeOpacity={0.8}
              onPress={handleAddAddress}
            >
              <View className="flex-row items-center">
                <Ionicons name="add-circle-outline" size={24} color="#121212" />

                <Text className="text-background font-bold text-base ml-2">
                  Ajouter une nouvelle adresse
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      <AddressFormModal
        visible={showAddressForm}
        isEditing={!!editingAddressId}
        addressForm={addressForm}
        isAddingAddress={isAddingAddress}
        isUpdatingAddress={isUpdatingAddress}
        onClose={handleCloseAddressForm}
        onSave={handleSaveAddress}
        onFormChange={setAddressForm}
      />

      <ConfirmationModal
  visible={!!selectedAddress}
  title="Supprimer l'adresse ?"
  message={`Voulez-vous vraiment supprimer "${selectedAddress?.label}" ?`}
  confirmText="Supprimer"
  cancelText="Annuler"
  type="danger"
  onCancel={() => setSelectedAddress(null)}
  onConfirm={() => {
    if (selectedAddress) {
      deleteAddress(selectedAddress.id);
    }

    setSelectedAddress(null);
  }}
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

export default AddressesScreen;
