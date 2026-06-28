import React, { useEffect, useRef, useState } from "react";
import { Animated, PanResponder, Text, View, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { toast } from "@/lib/toast";

type ToastType = "success" | "error" | "info";

export default function FeedbackToast() {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<ToastType>("info");

  const translateY = useRef(new Animated.Value(120)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    toast._setListener(({ message, type }) => {
      show(message, type);
    });
  }, []);

  const hide = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 120,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setVisible(false));
  };

  const show = (msg: string, t: ToastType = "info") => {
    setMessage(msg);
    setType(t);
    setVisible(true);

    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        damping: 14,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(hide, 2500);
  };

  useEffect(() => {
    toast._setListener(({ message, type }) => {
      show(message, type);
    });
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => {
        return gesture.dy > 10;
      },
      onPanResponderMove: (_, gesture) => {
        if (gesture.dy > 0) {
          translateY.setValue(gesture.dy);
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > 60) {
          hide();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  if (!visible) return null;

  const config = {
    success: {
      icon: "checkmark-circle",
      color: "#22c55e",
    },
    error: {
      icon: "close-circle",
      color: "#ef4444",
    },
    info: {
      icon: "information-circle",
      color: "#3b82f6",
    },
  }[type];

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.wrapper,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <BlurView intensity={80} tint="dark" style={styles.blur}>
        <View style={[styles.content, { borderColor: config.color }]}>
          <Ionicons name={config.icon as any} size={22} color={config.color} />
          <Text style={styles.text}>{message}</Text>
        </View>
      </BlurView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 60,
    alignSelf: "center",
    width: "90%",
  },
  blur: {
    borderRadius: 18,
    overflow: "hidden",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  text: {
    color: "#fff",
    fontWeight: "600",
    flex: 1,
  },
});

// import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";

// export const toastConfig = {
//   success: (props: any) => (
//     <BaseToast
//       {...props}
//       style={{
//         borderLeftColor: "#22C55E",
//         backgroundColor: "#1E1E1E",
//         borderRadius: 16,
//         marginHorizontal: 16,
//       }}
//       contentContainerStyle={{
//         paddingHorizontal: 16,
//       }}
//       text1Style={{
//         color: "#FFFFFF",
//         fontSize: 16,
//         fontWeight: "700",
//       }}
//       text2Style={{
//         color: "#D1D5DB",
//         fontSize: 14,
//       }}
//     />
//   ),

//   error: (props: any) => (
//     <ErrorToast
//       {...props}
//       style={{
//         borderLeftColor: "#EF4444",
//         backgroundColor: "#1E1E1E",
//         borderRadius: 16,
//         marginHorizontal: 16,
//       }}
//       contentContainerStyle={{
//         paddingHorizontal: 16,
//       }}
//       text1Style={{
//         color: "#FFFFFF",
//         fontSize: 16,
//         fontWeight: "700",
//       }}
//       text2Style={{
//         color: "#D1D5DB",
//         fontSize: 14,
//       }}
//     />
//   ),
// };

// export default function FeedbackToast() {
//   return <Toast config={toastConfig} />;
// }
