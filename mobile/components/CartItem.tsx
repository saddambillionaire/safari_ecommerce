import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import type { CartItemProps } from "@/types";

const CartItem = ({
  item,
  onIncrease,
  onDecrease,
  onRemove,
  isIncreasing,
  isDecreasing,
}: CartItemProps) => {
  const productId = item.product._id;

  return (
    <View className="bg-surface rounded-3xl overflow-hidden">
      <View className="flex-row p-4">
        {/* LEFT */}
        <View>
          <View className="relative">
            <Image
              source={item.product.images[0]}
              contentFit="cover"
              style={{
                width: 110,
                height: 110,
                borderRadius: 18,
              }}
            />

            <View className="absolute top-2 right-2 rounded-full bg-primary px-2 py-1">
              <Text className="text-xs font-bold text-background">
                ×{item.quantity}
              </Text>
            </View>
          </View>

          <View className="mt-2 flex-row items-center self-start rounded-3xl bg-[#303030] px-3 py-2">
            <Ionicons name="pricetag-outline" size={14} color="#9CA3AF" />
            <Text className="ml-2 text-xs font-medium text-text-secondary">
              ${item.product.price.toFixed(2)} / unité
            </Text>
          </View>
        </View>

        {/* RIGHT */}
        <View className="ml-4 flex-1 justify-between">
          {/* HEADER */}
          <View className="flex-row justify-between">
            <View className="flex-1 pr-3">
              <Text
                numberOfLines={2}
                className="text-lg font-bold text-text-primary"
              >
                {item.product.name}
              </Text>

              <Text className="mt-2 text-2xl font-bold text-primary">
                ${(item.product.price * item.quantity).toFixed(2)}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => onRemove(productId, item.product.name)}
              className="h-11 w-11 items-center justify-center rounded-xl bg-[#303030]"
            >
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>

          {/* CONTROLS */}
          <View className="mt-4 flex-row items-center justify-end">
            <TouchableOpacity
              disabled={isDecreasing}
              onPress={() => onDecrease(productId, item.quantity)}
              className="h-11 w-11 items-center justify-center rounded-xl bg-[#303030]"
            >
              {isDecreasing ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Ionicons name="remove" size={20} color="#D1D5DB" />
              )}
            </TouchableOpacity>

            <View className="mx-3 h-11 w-11 items-center justify-center rounded-xl bg-[#262626]">
              <Text className="text-lg font-bold text-text-primary">
                {item.quantity}
              </Text>
            </View>

            <TouchableOpacity
              disabled={isIncreasing}
              onPress={() => onIncrease(productId)}
              className="h-11 w-11 items-center justify-center rounded-xl bg-primary"
            >
              {isIncreasing ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Ionicons name="add" size={20} color="#121212" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CartItem;
