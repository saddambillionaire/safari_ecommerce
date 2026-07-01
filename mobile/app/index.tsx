import { Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { ActivityIndicator, View, Text } from "react-native";
import SafeScreen from "@/components/SafeScreen";

export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return;

  // if (!isLoaded) {
  //   return (
  //     <SafeScreen>
  //       <View className="flex-1 items-center justify-center px-6">
  //         <ActivityIndicator size="large" color="#1DB954" />

  //         <Text className="mt-5 text-xl font-bold text-text-primary">
  //           Chargement...
  //         </Text>

  //         <Text className="mt-2 text-center text-text-secondary">
  //           Veuillez patienter quelques instants.
  //         </Text>
  //       </View>
  //     </SafeScreen>
  //   );
  // }

  return <Redirect href={isSignedIn ? "/(tabs)" : "/(auth)"} />;
}
