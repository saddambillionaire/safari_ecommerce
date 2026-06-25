import { Ionicons } from "@expo/vector-icons";
import SafeScreen from "./SafeScreen";
import AddressesHeader from "./AddressesHeader";
import { View, Text } from "react-native";

type ErrorUIProps = {
  title: string;
};

export default function ErrorUI({ title }: ErrorUIProps) {
  return (
    <SafeScreen>
      <AddressesHeader />

      <View className="flex-1 items-center justify-center px-6">
        <Ionicons name="alert-circle-outline" size={64} color="#FF6B6B" />

        <Text className="text-text-primary font-semibold text-xl mt-4">
          {title}
        </Text>

        <Text className="text-text-secondary text-center mt-2">
          Veuillez vérifier votre connexion internet et réessayer plus tard
        </Text>
      </View>
    </SafeScreen>
  );
}
