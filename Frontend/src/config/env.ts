import Constants from "expo-constants";

type Extra = {
  API_BASE_URL?: string;
};

const extra = (Constants.expoConfig?.extra ?? {}) as Extra;

// Dynamically grab the local IP used by Expo (so you don't have to hardcode your local IP!)
// This makes it work flawlessly on physical Android devices or Emulators on port 8800.
const host = Constants.expoConfig?.hostUri?.split(":")[0] ?? "10.0.2.2";

export const API_BASE_URL = extra.API_BASE_URL ?? `http://${host}:8800`;

