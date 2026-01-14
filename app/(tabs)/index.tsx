import React, { useState } from "react";
import { CommonActions } from "@react-navigation/native";
import { useNavigation, router } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { auth } from "../../FirebaseConfig";

export default function TabOneScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const confirmSignOut = () => {
    Alert.alert(
      "Sign out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Sign Out", style: "destructive", onPress: handleSignOut },
      ],
      { cancelable: true }
    );
  };

  const handleSignOut = async () => {
    if (loading) return;
    setLoading(true);

    try {
      await auth.signOut();

     
      const action = CommonActions.reset({
        index: 0,
        routes: [{ name: "index" }],
      });

      const targetNav: any = navigation.getParent?.() || navigation;
      targetNav.dispatch(action);

      
      router.replace("/");

    } catch (error: any) {
      console.error("Error signing out:", error);
      Alert.alert("Error", "Failed to sign out. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const con = () => {
    router.replace("/(tabs)/FoodTrackerScreen")
  }

  return (
    <><View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Continue To App</Text>
        <Text style={styles.subtitle}>
          Would you like to continue to the rest of the app
        </Text>
        <Pressable
          onPress={con}
          disabled={loading}
          style={({ pressed }) => [
            styles.button2,
            pressed && { opacity: 0.9 },
            loading && { opacity: 0.6 },
          ]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Continue</Text>
          )}
        </Pressable>
      </View>
    </View>
    <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Account</Text>
          <Text style={styles.subtitle}>
            You are currently signed in. You can sign out below.
          </Text>

          <Pressable
            onPress={confirmSignOut}
            disabled={loading}
            style={({ pressed }) => [
              styles.button,
              pressed && { opacity: 0.9 },
              loading && { opacity: 0.6 },
            ]}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign Out</Text>
            )}
          </Pressable>
        </View>
      </View></>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1220",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.65)",
    marginBottom: 20,
  },
  button: {
    height: 52,
    borderRadius: 16,
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  button2: {
    height: 52,
    borderRadius: 16,
    backgroundColor: "#44ef5e",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#44ef5e",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
});
