import { Ionicons } from "@expo/vector-icons";
import SafeScreen from "./SafeScreen";
import { View, Text } from "react-native";

type ErrorUIProps = {
  title: string;
  message: string;
};

export default function ErrorUI({ title, message }: ErrorUIProps) {
  return (
    <SafeScreen>
      <View className="flex-1 items-center justify-center px-6">
        <Ionicons name="alert-circle-outline" size={64} color="#FF6B6B" />

        <Text className="text-text-primary font-semibold items-center justify-center text-xl mt-4">
          {title}
        </Text>

        <Text className="text-text-secondary text-center mt-2">{message}</Text>
      </View>
    </SafeScreen>
  );
}
