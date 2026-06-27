import { Redirect, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@clerk/clerk-expo";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SafeScreen from "@/components/SafeScreen";
import { ActivityIndicator, View, Text} from "react-native";

const TabsLayout = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const insets = useSafeAreaInsets();

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

  if (!isSignedIn) {
    return <Redirect href="/(auth)" />;
  }
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#1DB954",
        tabBarInactiveTintColor: "#B3B3B3",
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "black",
          borderTopWidth: 0,
          height: 28 + insets.bottom,
          paddingTop: 4,
          marginHorizontal: 10,
          marginBottom: insets.bottom,
          borderRadius: 24,
          overflow: "hidden",
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Acceuil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Charriot",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
