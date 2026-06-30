import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import ProductsGrid from "@/components/ProductsGrid";
import useProducts from "@/hooks/useProducts";
import SafeScreen from "@/components/SafeScreen";
import { useUser } from "@clerk/clerk-expo";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";

const CATEGORIES = [
  { name: "All", icon: "grid-outline" as const },
  { name: "Electronics", image: require("@/assets/images/electronics.png") },
  { name: "Fashion", image: require("@/assets/images/fashion.png") },
  { name: "Sports", image: require("@/assets/images/sports.png") },
  { name: "Books", image: require("@/assets/images/books.png") },
];

const ShopScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { user } = useUser();

  const { data: products, isLoading, isError } = useProducts();

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let filtered = products;

    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory,
      );
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    return filtered;
  }, [products, selectedCategory, searchQuery]);

  const count = filteredProducts.length;
  const label = count === 1 ? "article" : "articles";

  return (
    <SafeScreen>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* APP BAR */}
        <View className="px-6 pt-4 pb-4 flex-row items-center justify-between">
          <Text className="text-primary text-3xl font-black">Safari-mart</Text>

          <View className="flex-row items-center">
            <TouchableOpacity className="mr-4">
              <Ionicons
                name="notifications-outline"
                size={24}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <TouchableOpacity className="mr-4">
              <Ionicons name="heart-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity>
              <Ionicons name="cart-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* DIVIDER */}
        <View className="h-[1px] bg-surface-light mx-6 mb-5" />

        {/* USER CARD */}
        <View className="px-6 mb-4">
          <LinearGradient
            colors={["#1DB954", "#169C46", "#0F6B31"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 24,
              padding: 20,
            }}
          >
            <View className="flex-row items-center">
              <Image
                source={user?.imageUrl}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  borderWidth: 2,
                  borderColor: "rgba(255,255,255,0.3)",
                }}
              />

              <View className="ml-4 flex-1">
                <Text className="text-white text-md font-medium">
                  Bonjour 👋
                </Text>

                <Text
                  className="text-white text-2xl font-bold mt-1"
                  numberOfLines={1}
                >
                  {user?.firstName} {user?.lastName}
                </Text>

                <Text className="text-white/80 text-sm mt-2" numberOfLines={2}>
                  Découvrez les meilleures offres ici.
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* SEARCH BAR */}
        <View className="px-6 mb-3">
          <View className="bg-surface rounded-3xl px-4 h-12 flex-row items-center">
            <Ionicons
              name="search"
              size={20}
              color="#888"
              style={{ marginRight: 12 }}
            />

            <TextInput
              placeholder="Rechercher un produit..."
              placeholderTextColor="#888"
              className="flex-1 text-text-primary text-sm"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* CATEGORIES */}
        <View className="px-6 mb-6 style={{ marginTop: 10 }">
          <Text className="text-text-primary text-xl font-bold mb-4">
            Catégories
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {CATEGORIES.map((category) => {
              const isSelected = selectedCategory === category.name;

              return (
                <TouchableOpacity
                  key={category.name}
                  onPress={() => setSelectedCategory(category.name)}
                  className={`mr-3 px-5 py-3 rounded-full flex-row items-center ${
                    isSelected ? "bg-primary" : "bg-surface"
                  }`}
                >
                  {category.icon ? (
                    <Ionicons
                      name={category.icon}
                      size={18}
                      color={isSelected ? "#121212" : "#FFFFFF"}
                    />
                  ) : (
                    <Image
                      source={category.image}
                      style={{
                        width: 20,
                        height: 20,
                      }}
                    />
                  )}

                  <Text
                    className={`ml-2 font-semibold ${
                      isSelected ? "text-background" : "text-text-primary"
                    }`}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* PRODUCTS */}
        <View className="px-6 mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-text-primary text-lg font-bold">
              Produits
            </Text>

            <Text className="text-text-secondary text-sm">
              <Text className="text-text-secondary text-sm">
                {count} {label}
              </Text>
            </Text>
          </View>

          <ProductsGrid
            products={filteredProducts}
            isLoading={isLoading}
            isError={isError}
          />
        </View>
      </ScrollView>
    </SafeScreen>
  );
};

export default ShopScreen;
