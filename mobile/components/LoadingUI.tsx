import { ActivityIndicator, View, Text } from "react-native";
import AddressesHeader from "./AddressesHeader";
import SafeScreen from "./SafeScreen";

export default function LoadingUI() {
  return (
    <SafeScreen>
      <AddressesHeader />
      <View className="flex-1 items-center justify-center px-6">
        <ActivityIndicator size="large" color="#1DB954" />
        <Text className="text-text-secondary mt-4">
          Chargement des addresses...
        </Text>
      </View>
    </SafeScreen>
  );
}
