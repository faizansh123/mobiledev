import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "@/FirebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { router } from "expo-router";

const Index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState<"signin" | "signup" | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const emailTrimmed = useMemo(() => email.trim(), [email]);
  const canSubmit = emailTrimmed.length > 3 && password.length >= 6 && !loading;

  const prettyFirebaseError = (msg: string) => {
    const m = (msg || "").toLowerCase();
    if (m.includes("invalid-email")) return "That email address doesn’t look right.";
    if (m.includes("user-not-found")) return "No account found with that email.";
    if (m.includes("wrong-password")) return "Incorrect password. Try again.";
    if (m.includes("email-already-in-use")) return "That email is already in use.";
    if (m.includes("weak-password")) return "Password is too weak (use 6+ characters).";
    if (m.includes("missing-password")) return "Please enter a password.";
    return "Something went wrong. Please try again.";
  };

  const handleSignIn = async () => {
    if (!canSubmit) return;
    setLoading("signin");
    try {
      const user = await signInWithEmailAndPassword(auth, emailTrimmed, password);
      if (user) router.replace("/(tabs)");
    } catch (error: any) {
      console.log(error);
      Alert.alert("Sign in failed", prettyFirebaseError(error?.code || error?.message));
    } finally {
      setLoading(null);
    }
  };

  const handleSignUp = async () => {
    if (!canSubmit) return;
    setLoading("signup");
    try {
      const user = await createUserWithEmailAndPassword(auth, emailTrimmed, password);
      if (user) router.replace("/(tabs)");
    } catch (error: any) {
      console.log(error);
      Alert.alert("Sign up failed", prettyFirebaseError(error?.code || error?.message));
    } finally {
      setLoading(null);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0B1220" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={{ flex: 1, paddingHorizontal: 20, justifyContent: "center" }}>
          
          <View style={{ marginBottom: 18 }}>
            <Text style={{ color: "white", fontSize: 30, fontWeight: "800" }}>
              Welcome back
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.7)", marginTop: 6, fontSize: 14 }}>
              Sign in to continue. Or create an account in seconds.
            </Text>
          </View>

          
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.08)",
              borderRadius: 18,
              padding: 16,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.10)",
            }}
          >
            
            <Text style={{ color: "rgba(255,255,255,0.75)", marginBottom: 8 }}>
              Email
            </Text>
            <View
              style={{
                backgroundColor: "rgba(255,255,255,0.10)",
                borderRadius: 14,
                paddingHorizontal: 14,
                paddingVertical: 12,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.14)",
                marginBottom: 12,
              }}
            >
              <TextInput
                placeholder="you@example.com"
                placeholderTextColor="rgba(255,255,255,0.45)"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                textContentType="emailAddress"
                selectionColor="#7C3AED"
                style={{ color: "white", fontSize: 16 }}
              />
            </View>

            
            <Text style={{ color: "rgba(255,255,255,0.75)", marginBottom: 8 }}>
              Password
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "rgba(255,255,255,0.10)",
                borderRadius: 14,
                paddingHorizontal: 14,
                paddingVertical: 12,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.14)",
              }}
            >
              <TextInput
                placeholder="••••••••"
                placeholderTextColor="rgba(255,255,255,0.45)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="password"
                textContentType="password"
                selectionColor="#7C3AED"
                style={{ color: "white", fontSize: 16, flex: 1, paddingRight: 10 }}
              />
              <Pressable
                onPress={() => setShowPassword((s) => !s)}
                hitSlop={10}
                style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
              >
                <Text style={{ color: "rgba(255,255,255,0.8)", fontWeight: "700" }}>
                  {showPassword ? "Hide" : "Show"}
                </Text>
              </Pressable>
            </View>

          
            <Text style={{ color: "rgba(255,255,255,0.55)", marginTop: 10, fontSize: 12 }}>
              Tip: password must be at least 6 characters.
            </Text>

            
            <View style={{ marginTop: 16 }}>
              <Pressable
                onPress={handleSignIn}
                disabled={!canSubmit}
                style={({ pressed }) => ({
                  height: 52,
                  borderRadius: 16,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: canSubmit ? "#7C3AED" : "rgba(124,58,237,0.35)",
                  opacity: pressed ? 0.9 : 1,
                })}
              >
                {loading === "signin" ? (
                  <ActivityIndicator />
                ) : (
                  <Text style={{ color: "white", fontSize: 16, fontWeight: "800" }}>
                    Sign In
                  </Text>
                )}
              </Pressable>

              <Pressable
                onPress={handleSignUp}
                disabled={!canSubmit}
                style={({ pressed }) => ({
                  height: 52,
                  borderRadius: 16,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "transparent",
                  borderWidth: 1,
                  borderColor: canSubmit ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.12)",
                  marginTop: 12,
                  opacity: pressed ? 0.9 : 1,
                })}
              >
                {loading === "signup" ? (
                  <ActivityIndicator />
                ) : (
                  <Text style={{ color: "white", fontSize: 16, fontWeight: "800" }}>
                    Create Account
                  </Text>
                )}
              </Pressable>
            </View>
          </View>

          
          <Text
            style={{
              color: "rgba(255,255,255,0.55)",
              textAlign: "center",
              marginTop: 16,
              fontSize: 12,
            }}
          >
            By continuing, you agree to the app’s Terms & Privacy Policy.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Index;
