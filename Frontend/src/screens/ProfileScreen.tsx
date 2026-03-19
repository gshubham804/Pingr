import { useEffect, useState, useCallback } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../theme/useTheme";
import { useAuthStore } from "../state/authStore";
import { apiMe, apiUpdateProfile, type UserProfile } from "../api/users";
import Avatar from "../components/Avatar";
import Button from "../components/Button";
import { useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { TabParamList, MainStackParamList } from "../navigation/RootNavigator";

type TabNavProp = BottomTabNavigationProp<TabParamList, "Profile">;
type StackNavProp = NativeStackNavigationProp<MainStackParamList>;

export default function ProfileScreen() {
  const navigation = useNavigation<TabNavProp>();
  const parentNav = navigation.getParent<StackNavProp>();
  const theme = useTheme();
  const { user, setUser, signOut } = useAuthStore();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiMe();
      if (res.success && res.data) {
        setProfile(res.data);
        setBio(res.data.profile?.bio ?? "");
        setLocation(res.data.profile?.location ?? "");
      }
    } catch {
      Alert.alert("Error", "Could not load profile.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={() => setEditing((e) => !e)} style={{ marginRight: 16 }}>
          <Text style={{ color: theme.colors.primary, fontSize: 16, fontWeight: "600" }}>
            {editing ? "Cancel" : "Edit"}
          </Text>
        </Pressable>
      ),
    });
  }, [navigation, editing, theme]);

  const saveProfile = async () => {
    try {
      setSaving(true);
      const res = await apiUpdateProfile({ bio, location });
      if (res.success && res.data) {
        setProfile(res.data);
        if (user) setUser({ ...user, profile: res.data.profile });
        setEditing(false);
      }
    } catch {
      Alert.alert("Error", "Could not save profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator color={theme.colors.primary} size="large" />
      </View>
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={styles.content}
    >
      {/* Header Profile Area */}
      <View style={styles.header}>
        <View style={styles.avatarWrapper}>
          <Avatar
            uri={profile?.profile?.avatar}
            name={profile?.fullName ?? "User"}
            size={100}
          />
          {editing && (
            <View style={[styles.editBadge, { backgroundColor: theme.colors.primary, borderColor: theme.colors.background }]}>
              <Feather name="camera" size={14} color={theme.colors.surface} />
            </View>
          )}
        </View>
        <Text style={[styles.fullName, { color: theme.colors.textPrimary }]}>
          {profile?.fullName}
        </Text>
        <Text style={[styles.email, { color: theme.colors.textSecondary }]}>
          {profile?.email}
        </Text>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>About</Text>
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          {/* Bio Row */}
          <View style={[styles.row, { borderBottomWidth: 1, borderBottomColor: theme.colors.border }]}>
            <View style={[styles.iconBox, { backgroundColor: theme.colors.primary + "15" }]}>
              <Feather name="align-left" size={18} color={theme.colors.primary} />
            </View>
            <View style={styles.rowContent}>
              <Text style={[styles.rowLabel, { color: theme.colors.textSecondary }]}>Bio</Text>
              {editing ? (
                <TextInput
                  value={bio}
                  onChangeText={setBio}
                  placeholder="Tell people about yourself…"
                  placeholderTextColor="#94A3B8"
                  style={[styles.editInput, { color: theme.colors.textPrimary }]}
                  multiline
                  maxLength={150}
                />
              ) : (
                <Text style={[styles.rowValue, { color: bio ? theme.colors.textPrimary : theme.colors.textSecondary }]}>
                  {bio || "No bio yet"}
                </Text>
              )}
            </View>
          </View>

          {/* Location Row */}
          <View style={styles.row}>
            <View style={[styles.iconBox, { backgroundColor: "#3B82F615" }]}>
              <Feather name="map-pin" size={18} color="#3B82F6" />
            </View>
            <View style={styles.rowContent}>
              <Text style={[styles.rowLabel, { color: theme.colors.textSecondary }]}>Location</Text>
              {editing ? (
                <TextInput
                  value={location}
                  onChangeText={setLocation}
                  placeholder="Where are you based?"
                  placeholderTextColor="#94A3B8"
                  style={[styles.editInput, { color: theme.colors.textPrimary }]}
                />
              ) : (
                <Text style={[styles.rowValue, { color: location ? theme.colors.textPrimary : theme.colors.textSecondary }]}>
                  {location || "No location set"}
                </Text>
              )}
            </View>
          </View>
        </View>
        
        {editing && (
          <Button
            title="Save changes"
            onPress={saveProfile}
            loading={saving}
            style={{ marginTop: 16 }}
          />
        )}
      </View>

      {/* Account Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>Account</Text>
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          {/* Friend Requests */}
          <Pressable
            onPress={() => parentNav?.navigate("FriendRequests")}
            style={({ pressed }) => [
              styles.row,
              { borderBottomWidth: 1, borderBottomColor: theme.colors.border },
              pressed && { opacity: 0.7 }
            ]}
          >
            <View style={[styles.iconBox, { backgroundColor: theme.colors.success + "15" }]}>
              <Feather name="user-plus" size={18} color={theme.colors.success} />
            </View>
            <Text style={[styles.linkText, { color: theme.colors.textPrimary }]}>Friend Requests</Text>
            <Feather name="chevron-right" size={20} color={theme.colors.textSecondary} />
          </Pressable>

          {/* Sign Out */}
          <Pressable
            onPress={() => {
              Alert.alert("Sign out", "Are you sure you want to sign out?", [
                { text: "Cancel", style: "cancel" },
                { text: "Sign out", style: "destructive", onPress: () => signOut() },
              ]);
            }}
            style={({ pressed }) => [
              styles.row,
              pressed && { opacity: 0.7 }
            ]}
          >
            <View style={[styles.iconBox, { backgroundColor: theme.colors.error + "15" }]}>
              <Feather name="log-out" size={18} color={theme.colors.error} />
            </View>
            <Text style={[styles.linkText, { color: theme.colors.error }]}>Sign out</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  content: { paddingBottom: 40 },
  header: {
    alignItems: "center",
    paddingTop: 32,
    paddingBottom: 24,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
  },
  fullName: { fontSize: 26, fontWeight: "800", marginBottom: 4, letterSpacing: 0.2 },
  email: { fontSize: 15 },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 12,
  },
  card: {
    borderRadius: 16,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    minHeight: 64,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  rowContent: {
    flex: 1,
    justifyContent: "center",
  },
  rowLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  rowValue: {
    fontSize: 15,
  },
  editInput: {
    fontSize: 15,
    padding: 0,
    margin: 0,
  },
  linkText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
  },
});
