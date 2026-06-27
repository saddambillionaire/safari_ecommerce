import { Modal, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type FeedbackModalProps = {
  visible: boolean;
  title: string;
  message: string;

  type?: "success" | "error";

  icon?: keyof typeof Ionicons.glyphMap;

  buttonText?: string;

  loading?: boolean;

  onClose: () => void;
};

const FeedbackModal = ({
  visible,
  title,
  message,
  type = "success",
  icon,
  buttonText = "OK",
  loading = false,
  onClose,
}: FeedbackModalProps) => {
  const iconName = icon ?? (type === "success" ? "checkmark" : "close");

  const iconColor = type === "success" ? "#1DB954" : "#EF4444";

  const backgroundColor =
    type === "success" ? "bg-green-500/15" : "bg-red-500/15";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/60 justify-center items-center px-6">
        <View className="bg-surface rounded-3xl p-6 w-full">
          <View className="items-center">
            <View className={`p-4 rounded-full ${backgroundColor}`}>
              <Ionicons name={iconName} size={28} color={iconColor} />
            </View>

            <Text className="text-text-primary text-xl font-bold mt-4">
              {title}
            </Text>

            <Text className="text-text-secondary text-center mt-3">
              {message}
            </Text>
          </View>

          <TouchableOpacity
            disabled={loading}
            className="mt-6 bg-primary py-4 rounded-2xl"
            onPress={onClose}
          >
            <Text className="text-center text-background font-bold">
              {loading ? "Chargement..." : buttonText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default FeedbackModal;
