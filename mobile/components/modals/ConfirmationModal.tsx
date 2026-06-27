import { ConfirmationModalProps } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { Modal, Text, TouchableOpacity, View } from "react-native";

const ConfirmationModal = ({
  visible,
  title,
  message,
  icon,
  type = "danger",
  confirmText = "Confirmer",
  cancelText = "Annuler",
  onConfirm,
  onCancel,
}: ConfirmationModalProps) => {
  const iconName =
    icon ?? (type === "danger" ? "trash-outline" : "warning-outline");

  const iconColor = type === "danger" ? "#EF4444" : "#F59E0B";

  const iconBackground =
    type === "danger" ? "bg-red-500/15" : "bg-yellow-500/15";

  const confirmButton = type === "danger" ? "bg-red-500" : "bg-yellow-500";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 bg-black/60 justify-center items-center px-6">
        <View className="bg-surface rounded-3xl p-6 w-full">
          <View className="items-center">
            <View className={`p-4 rounded-full ${iconBackground}`}>
              <Ionicons name={iconName} size={28} color={iconColor} />
            </View>

            <Text className="text-text-primary text-xl font-bold mt-4">
              {title}
            </Text>

            <Text className="text-text-secondary text-center mt-3">
              {message}
            </Text>
          </View>

          <View className="flex-row mt-8">
            <TouchableOpacity
              className="flex-1 bg-background-lighter py-4 rounded-2xl mr-2"
              onPress={onCancel}
            >
              <Text className="text-center text-text-primary font-semibold">
                {cancelText}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-1 py-4 rounded-2xl ml-2 ${confirmButton}`}
              onPress={onConfirm}
            >
              <Text className="text-center text-white font-semibold">
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmationModal;
