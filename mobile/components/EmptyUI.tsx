import { Ionicons } from "@expo/vector-icons";
import { View, Text } from "react-native";

type EmptyUIProps = {
  title: string;
  message: string
};

export default function EmptyUI({ title, message }: EmptyUIProps) {
  return (
    <View className="flex-1 bg-background">
      <View className="px-6 pt-16 pb-5">
        <Text className="text-text-primary text-3xl font-bold tracking-tight">
          Cart
        </Text>
      </View>
      <View className="flex-1 items-center justify-center px-6">
        <Ionicons name="cart-outline" size={80} color="#666" />
        <Text className="text-text-primary font-semibold text-xl mt-4">
          {title}
        </Text>
        <Text className="text-text-secondary text-center mt-2">{message}</Text>
      </View>
    </View>
  );
}
