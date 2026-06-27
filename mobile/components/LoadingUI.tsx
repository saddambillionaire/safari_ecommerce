import { ActivityIndicator, View, Text } from "react-native";
import AddressesHeader from "./AddressesHeader";
import SafeScreen from "./SafeScreen";

type LoadingUIProps = {
  title: string;
};

export default function LoadingUI({ title }: LoadingUIProps) {
  return (
    <SafeScreen>
      <View className="flex-1 items-center justify-center px-6">
        <ActivityIndicator size="large" color="#1DB954" />
        <Text className="text-text-secondary mt-4">{title}</Text>
      </View>
    </SafeScreen>
  );
}
