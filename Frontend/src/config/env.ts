import Constants from "expo-constants";
import { Platform } from "react-native";

type Extra = {
  API_BASE_URL?: string;
};

const extra = (Constants.expoConfig?.extra ?? {}) as Extra;

let host = Constants.expoConfig?.hostUri?.split(":")[0] ?? "10.0.2.2";

// If Expo thinks the host is localhost, we need to fix it for Android emulators.
// Android emulators cannot reach the laptop via localhost (they reach themselves).
// They must use 10.0.2.2 to point to the host laptop.
if (host === "127.0.0.1" || host === "localhost") {
  host = Platform.OS === "android" ? "10.0.2.2" : "localhost";
}

export const API_BASE_URL = extra.API_BASE_URL ?? `http://${host}:8800`;

console.log(`[NETWORK INIT] API_BASE_URL is set to: ${API_BASE_URL}`);

