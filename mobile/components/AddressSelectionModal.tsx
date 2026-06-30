import { useAddresses } from "@/hooks/useAddressess";
import { Address } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface AddressSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onProceed: (address: Address) => void;
  isProcessing: boolean;
}

const AddressSelectionModal = ({
  visible,
  onClose,
  onProceed,
  isProcessing,
}: AddressSelectionModalProps) => {
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const { addresses, isLoading: addressesLoading } = useAddresses();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/30 justify-end">
        <View className="bg-background rounded-t-3xl h-3/5 overflow-hidden">
          {/* Modal Header */}
          <View className="flex-row items-center justify-between px-4 py-3 border-b border-surface">
            <Text className="text-text-primary text-xl font-semibold flex-1 pr-2">
              Choisissez l'adresse
            </Text>

            <TouchableOpacity
              onPress={onClose}
              className="bg-surface/70 rounded-full w-8 h-8 items-center justify-center"
            >
              <Ionicons name="close" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* ADDRESSES LIST */}
          <ScrollView className="flex-1 p-6">
            {addressesLoading ? (
              <View className="py-8">
                <ActivityIndicator size="large" color="#00D9FF" />
              </View>
            ) : (
              <View className="gap-4">
                {addresses?.map((address: Address) => (
                  <TouchableOpacity
                    key={address._id}
                    className={`bg-surface rounded-3xl p-6 border-2 ${
                      selectedAddress?._id === address._id
                        ? "border-primary"
                        : "border-background-lighter"
                    }`}
                    activeOpacity={0.7}
                    onPress={() => setSelectedAddress(address)}
                  >
                    <View className="flex-row items-start justify-between">
                      <View className="flex-1">
                        <View className="flex-row items-center mb-3">
                          <Text className="text-primary font-bold text-lg mr-2">
                            {address.label}
                          </Text>
                          {address.isDefault && (
                            <View className="bg-primary/20 rounded-full px-3 py-1">
                              <Text className="text-primary text-sm font-semibold">
                                Default
                              </Text>
                            </View>
                          )}
                        </View>
                        <Text className="text-text-primary font-semibold text-lg mb-2">
                          {address.nomComplet}
                        </Text>
                        <Text className="text-text-secondary text-base leading-6 mb-1">
                          {address.ville}
                        </Text>
                        <Text className="text-text-secondary text-base mb-2">
                          {address.commune} {address.quartier} {address.avenue}
                        </Text>
                        <Text className="text-text-secondary text-base">
                          {address.numeroTelephone}
                        </Text>
                      </View>
                      {selectedAddress?._id === address._id && (
                        <View className="bg-primary rounded-full p-2 ml-3">
                          <Ionicons
                            name="checkmark"
                            size={24}
                            color="#121212"
                          />
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>

          <View
            className="p-6 border-t border-surface"
            style={{
              paddingBottom: insets.bottom + 18,
            }}
          >
            <TouchableOpacity
              className="bg-primary rounded-2xl py-5"
              activeOpacity={0.9}
              onPress={() => {
                if (selectedAddress) onProceed(selectedAddress);
              }}
              disabled={!selectedAddress || isProcessing}
            >
              <View className="flex-row items-center justify-center">
                {isProcessing ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Text className="text-background font-bold text-xl mr-2">
                      Continuer vers le paiement
                    </Text>
                    <Ionicons name="arrow-forward" size={20} color="#121212" />
                  </>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddressSelectionModal;
