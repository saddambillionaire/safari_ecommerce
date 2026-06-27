import { ActivityIndicator, Text, View } from "react-native";
import { Redirect, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import SafeScreen from "@/components/SafeScreen";

export default function AuthRoutesLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <SafeScreen>
        <View className="flex-1 items-center justify-center px-6">
        <ActivityIndicator size="large" />

        <Text className="mt-5 text-xl font-bold text-text-primary">
          Chargement...
        </Text>

        <Text className="mt-2 text-center text-text-secondary">
          Vérification de votre session...
        </Text>
      </View>
      </SafeScreen>
    );
  }

  if (isSignedIn) {
    return <Redirect href="/(tabs)" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
