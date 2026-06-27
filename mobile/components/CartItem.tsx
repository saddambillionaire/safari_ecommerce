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
  isUpdating,
  isRemoving,
}: CartItemProps) => {
  return (
    <View className="bg-surface rounded-3xl overflow-hidden">
      <View className="p-4 flex-row">
        {/* IMAGE */}
        <View className="relative">
          <Image
            source={item.product.images[0]}
            contentFit="cover"
            style={{ width: 112, height: 112, borderRadius: 16 }}
          />

          <View className="absolute top-2 right-2 bg-primary rounded-full px-2 py-0.5">
            <Text className="text-background text-xs font-bold">
              ×{item.quantity}
            </Text>
          </View>
        </View>

        {/* CONTENT */}
        <View className="flex-1 ml-4 justify-between">
          <View>
            <Text
              className="text-text-primary font-bold text-lg"
              numberOfLines={2}
            >
              {item.product.name}
            </Text>

            <View className="flex-row items-center mt-2">
              <Text className="text-primary font-bold text-2xl">
                ${(item.product.price * item.quantity).toFixed(2)}
              </Text>

              <Text className="text-text-secondary text-sm ml-2">
                ${item.product.price.toFixed(2)} each
              </Text>
            </View>
          </View>

          {/* ACTIONS */}
          <View className="flex-row items-center mt-3">
            {/* Minus */}
            <TouchableOpacity
              className="bg-background-lighter rounded-full w-9 h-9 items-center justify-center"
              onPress={() => onDecrease(item.product._id, item.quantity)}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="remove" size={18} color="#fff" />
              )}
            </TouchableOpacity>

            {/* Quantity */}
            <View className="mx-4 min-w-[32px] items-center">
              <Text className="text-text-primary font-bold text-lg">
                {item.quantity}
              </Text>
            </View>

            {/* Plus */}
            <TouchableOpacity
              className="bg-primary rounded-full w-9 h-9 items-center justify-center"
              onPress={() => onIncrease(item.product._id)}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <ActivityIndicator size="small" color="#121212" />
              ) : (
                <Ionicons name="add" size={18} color="#121212" />
              )}
            </TouchableOpacity>

            {/* Delete */}
            <TouchableOpacity
              className="ml-auto bg-red-500/10 rounded-full w-9 h-9 items-center justify-center"
              onPress={() => onRemove(item.product._id, item.product.name)}
              disabled={isRemoving}
            >
              <Ionicons name="trash-outline" size={18} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CartItem;
