import Constants from "expo-constants";

type Extra = {
  API_BASE_URL?: string;
};

const extra = (Constants.expoConfig?.extra ?? {}) as Extra;

// For Android emulator use: http://10.0.2.2:5000
// For physical device use your LAN IP: http://192.168.x.x:5000
export const API_BASE_URL = extra.API_BASE_URL ?? "http://10.0.2.2:5000";

