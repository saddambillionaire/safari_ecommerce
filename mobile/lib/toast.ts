type ToastType = "success" | "error" | "info";

type ToastOptions = {
  message: string;
  type?: ToastType;
};

let listener: ((options: ToastOptions) => void) | null = null;

// 🔥 queue messages if toast not mounted yet
const queue: ToastOptions[] = [];

export const toast = {
  show: (options: ToastOptions) => {
    if (listener) {
      listener(options);
    } else {
      queue.push(options);
    }
  },

  success: (message: string) => {
    toast.show({ message, type: "success" });
  },

  error: (message: string) => {
    toast.show({ message, type: "error" });
  },

  info: (message: string) => {
    toast.show({ message, type: "info" });
  },

  _setListener: (fn: (options: ToastOptions) => void) => {
    listener = fn;

    // flush queue
    queue.forEach(fn);
    queue.length = 0;
  },
};

// import Toast from "react-native-toast-message";

// export const showSuccessToast = (
//   title: string,
//   message?: string,
// ) => {
//   Toast.show({
//     type: "success",
//     text1: title,
//     text2: message,
//     position: "top",
//     visibilityTime: 2500,
//   });
// };

// export const showErrorToast = (
//   title: string,
//   message?: string,
// ) => {
//   Toast.show({
//     type: "error",
//     text1: title,
//     text2: message,
//     position: "top",
//     visibilityTime: 3000,
//   });
// };