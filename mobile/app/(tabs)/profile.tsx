import SafeScreen from "@/components/SafeScreen";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const MENU_ITEMS = [
  {
    id: 1,
    icon: "person-outline",
    title: "Modifier le profile",
    color: "#3B82F6",
    action: "/profile",
  },
  {
    id: 2,
    icon: "list-outline",
    title: "Commandes",
    color: "#10B981",
    action: "/orders",
  },
  {
    id: 3,
    icon: "location-outline",
    title: "Addresses",
    color: "#F59E0B",
    action: "/addresses",
  },
  {
    id: 4,
    icon: "heart-outline",
    title: "Liste des favoris",
    color: "#EF4444",
    action: "/wishlist",
  },
] as const;

const ProfileScreen = () => {
  const { signOut } = useAuth();
  const { user } = useUser();

  const handleMenuPress = (action: (typeof MENU_ITEMS)[number]["action"]) => {
    if (action === "/profile") return;
    router.push(action);
  };
  return (
    <SafeScreen>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* APP BAR */}
        <View className="px-6 pt-4 pb-6 flex-row items-center justify-between">
          <Text className="text-text-primary text-3xl font-bold">Profile</Text>
        </View>

        {/* PROFILE CARD */}
        <View className="mx-6 mb-6 bg-surface rounded-3xl p-6">
          <View className="items-center">
            <View className="relative">
              <Image
                source={user?.imageUrl}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                }}
                transition={200}
              />

              <View className="absolute bottom-0 right-0 bg-primary rounded-full size-8 items-center justify-center border-2 border-background">
                <Ionicons name="checkmark" size={18} color="#121212" />
              </View>
            </View>

            <Text className="text-text-primary text-2xl font-bold mt-4">
              {user?.firstName} {user?.lastName}
            </Text>

            <Text className="text-text-secondary text-sm mt-1">
              {user?.emailAddresses?.[0]?.emailAddress || "Pas d'email"}
            </Text>
          </View>
        </View>

        {/* ACTIONS RAPIDES */}
        <View className="mx-6 mb-6">
          <Text className="text-text-primary text-lg font-bold mb-3">
            Gestion de compte
          </Text>

          {MENU_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.7}
              onPress={() => handleMenuPress(item.action)}
              className="bg-surface rounded-2xl p-4 mb-3 flex-row items-center justify-between"
            >
              <View className="flex-row items-center">
                <View
                  className="w-12 h-12 rounded-full items-center justify-center"
                  style={{
                    backgroundColor: item.color + "20",
                  }}
                >
                  <Ionicons name={item.icon} size={22} color={item.color} />
                </View>

                <Text className="text-text-primary font-semibold text-base ml-4">
                  {item.title}
                </Text>
              </View>

              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          ))}
        </View>

        {/* SETTINGS */}
        <View className="mx-6 mb-6">
          <Text className="text-text-primary text-lg font-bold mb-3">
            Préferences
          </Text>

          <View className="bg-surface rounded-2xl overflow-hidden">
            <TouchableOpacity
              className="flex-row items-center justify-between p-4"
              activeOpacity={0.7}
            >
              <View className="flex-row items-center">
                <Ionicons
                  name="notifications-outline"
                  size={22}
                  color="#FFFFFF"
                />

                <Text className="text-text-primary font-semibold ml-3">
                  Notifications
                </Text>
              </View>

              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>

            <View className="h-px bg-background-lighter mx-4" />

            <TouchableOpacity
              className="flex-row items-center justify-between p-4"
              activeOpacity={0.7}
              onPress={() => router.push("/privacy-security")}
            >
              <View className="flex-row items-center">
                <Ionicons
                  name="shield-checkmark-outline"
                  size={22}
                  color="#FFFFFF"
                />

                <Text className="text-text-primary font-semibold ml-3">
                  Privacy & Security
                </Text>
              </View>

              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* SIGN OUT */}
        <TouchableOpacity
          className="mx-6 bg-red-500/10 rounded-2xl py-5 flex-row items-center justify-center border border-red-500/20"
          activeOpacity={0.8}
          onPress={() => signOut()}
        >
          <Ionicons name="log-out-outline" size={22} color="#EF4444" />

          <Text className="text-red-500 font-bold text-base ml-2">
            Sign Out
          </Text>
        </TouchableOpacity>

        {/* VERSION */}
        <Text className="text-center text-text-tertiary text-xs mt-6">
          Version 1.0.0
        </Text>
      </ScrollView>
    </SafeScreen>
  );
};

export default ProfileScreen;

// REACT NATIVE IMAGE VS EXPO IMAGE:

// React Native Image (what we have used so far):
// import { Image } from "react-native";

// <Image source={{ uri: url }} />

// Basic image component
// No built-in caching optimization
// Requires source={{ uri: string }}

// Expo Image (from expo-image):
// import { Image } from "expo-image";

// <Image source={url} />

// Caching - automatic disk/memory caching
// Placeholder - blur hash, thumbnail while loading
// Transitions - crossfade, fade animations
// Better performance - optimized native rendering
// Simpler syntax: source={url} or source={{ uri: url }}
// Supports contentFit instead of resizeMode

// Example with expo-image:
// <Image   source={user?.imageUrl}  placeholder={blurhash}  transition={200}  contentFit="cover"  className="size-20 rounded-full"/>

// Recommendation: For production apps, expo-image is better — faster, cached, smoother UX.
// React Native's Image works fine for simple cases though.
