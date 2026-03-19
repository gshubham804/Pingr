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
        <Pressable onPress={() => setEditing((e) => !e)} style={{ marginRight: 4 }}>
          <Text style={{ color: theme.colors.primary, fontSize: 15 }}>
            {editing ? "Cancel" : "✏️ Edit"}
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
      {/* Avatar + Name */}
      <View style={styles.header}>
        <Avatar
          uri={profile?.profile?.avatar}
          name={profile?.fullName}
          size={90}
        />
        <Text style={[styles.fullName, { color: theme.colors.textPrimary }]}>
          {profile?.fullName}
        </Text>
        <Text style={[styles.email, { color: theme.colors.textSecondary }]}>
          {profile?.email}
        </Text>
      </View>

      {/* Info cards */}
      <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <Text style={[styles.cardLabel, { color: theme.colors.textSecondary }]}>Bio</Text>
        {editing ? (
          <TextInput
            value={bio}
            onChangeText={setBio}
            placeholder="Tell people about yourself…"
            placeholderTextColor={theme.colors.textSecondary}
            style={[styles.editInput, { color: theme.colors.textPrimary, borderColor: theme.colors.border }]}
            multiline
            maxLength={200}
          />
        ) : (
          <Text style={[styles.cardValue, { color: bio ? theme.colors.textPrimary : theme.colors.textSecondary }]}>
            {bio || "No bio yet"}
          </Text>
        )}
      </View>

      <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <Text style={[styles.cardLabel, { color: theme.colors.textSecondary }]}>Location</Text>
        {editing ? (
          <TextInput
            value={location}
            onChangeText={setLocation}
            placeholder="Where are you based?"
            placeholderTextColor={theme.colors.textSecondary}
            style={[styles.editInput, { color: theme.colors.textPrimary, borderColor: theme.colors.border }]}
          />
        ) : (
          <Text style={[styles.cardValue, { color: location ? theme.colors.textPrimary : theme.colors.textSecondary }]}>
            {location || "No location set"}
          </Text>
        )}
      </View>

      {editing && (
        <Button
          title={saving ? "Saving…" : "Save changes"}
          onPress={saveProfile}
          disabled={saving}
          style={{ marginBottom: 12 }}
        />
      )}

      {/* Friend Requests link */}
      <Pressable
        onPress={() => parentNav?.navigate("FriendRequests")}
        style={[styles.linkRow, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
      >
        <Text style={{ fontSize: 18 }}>🤝</Text>
        <Text style={[styles.linkText, { color: theme.colors.textPrimary }]}>
          Friend Requests
        </Text>
        <Text style={{ color: theme.colors.textSecondary }}>›</Text>
      </Pressable>

      {/* Sign out */}
      <Pressable
        onPress={() => {
          Alert.alert("Sign out", "Are you sure?", [
            { text: "Cancel", style: "cancel" },
            { text: "Sign out", style: "destructive", onPress: () => signOut() },
          ]);
        }}
        style={[styles.signOutRow, { borderColor: theme.colors.error + "40" }]}
      >
        <Text style={[styles.signOutText, { color: theme.colors.error }]}>Sign out</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  content: { padding: 16, gap: 12 },
  header: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 8,
  },
  fullName: { fontSize: 22, fontWeight: "800" },
  email: { fontSize: 14 },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 6,
  },
  cardLabel: { fontSize: 11, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 },
  cardValue: { fontSize: 14, lineHeight: 20 },
  editInput: {
    fontSize: 14,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    lineHeight: 20,
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 16,
  },
  linkText: { flex: 1, fontSize: 15, fontWeight: "600" },
  signOutRow: {
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  signOutText: { fontSize: 15, fontWeight: "700" },
});
