import { Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { ActivityIndicator, View, Text } from "react-native";
import SafeScreen from "@/components/SafeScreen";

export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return;

  return <Redirect href={isSignedIn ? "/(tabs)" : "/(auth)"} />;
}
