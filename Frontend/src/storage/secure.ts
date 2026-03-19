import * as SecureStore from "expo-secure-store";

// SecureStore is best for auth tokens and sensitive identifiers.
export const secure = {
  get: async (key: string): Promise<string | null> => {
    return SecureStore.getItemAsync(key);
  },
  set: async (key: string, value: string): Promise<void> => {
    await SecureStore.setItemAsync(key, value);
  },
  del: async (key: string): Promise<void> => {
    await SecureStore.deleteItemAsync(key);
  },
};

