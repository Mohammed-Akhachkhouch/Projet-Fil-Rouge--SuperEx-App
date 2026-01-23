import React, { useRef, useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import { useRouter, Redirect } from "expo-router";
import LottieView from "lottie-react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { useLoginMutation, useSignupMutation } from "../hooks/useAuthMutations.js";
import { useAuthStore } from "../store/authStore";
import { scaleFontSize, moderateScale, scaleWidth } from "../utils/responsive";

const { width } = Dimensions.get("window");

export default function WelcomeScreen() {
  const router = useRouter();
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["85%", "95%"], []);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [role, setRole] = useState("customer");

  // Get auth state from Zustand
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  const loginMut = useLoginMutation();
  const signupMut = useSignupMutation();

  // If user is already authenticated, redirect to appropriate screen
  if (token && user) {
    const redirectPath = user.role === "seller" ? "/(seller)/dashboard" : "/(tabs)/home";
    console.log("User authenticated, redirecting to:", redirectPath);
    return <Redirect href={redirectPath} />;
  }

  const handleGetStarted = () => {
    bottomSheetRef.current?.expand();
  };

  const resetFields = () => {
    setEmail("");
    setPassword("");
    setName("");
    setShowPassword(false);
  };

  const goNextByRole = (userRole) => {
    const r = userRole || "customer";
    if (r === "seller") {
      router.replace("/(seller)/dashboard");
    } else {
      router.replace("/(tabs)/home");
    }
  };

  const handleSubmit = async () => {
    try {
      if (isLogin) {
        const data = await loginMut.mutateAsync({ email, password });

        bottomSheetRef.current?.close();
        resetFields();

        goNextByRole(data?.user?.role);
      } else {
        const data = await signupMut.mutateAsync({
          username: name,
          email,
          password,
          role,
        });

        bottomSheetRef.current?.close();
        resetFields();

        goNextByRole(data?.user?.role || role);
      }
    } catch (e) {
      const msg = e?.response?.data?.message || e.message;
      console.log("AUTH ERROR:", msg);
      Alert.alert("Authentication Failed", msg);
    }
  };


  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <LottieView
        source={require("../assets/Supermarket Cart.json")}
        autoPlay
        loop
        style={{
          width: width * 0.7,
          height: width * 0.7,
          marginBottom: 30,
        }}
      />

      <View style={styles.content}>
        <Text style={styles.title}>SuperMarket</Text>
        <Text style={styles.subtitle}>Express</Text>
        <Text style={styles.description}>
          Order groceries and get them delivered to your door in minutes! Fast,
          convenient, and reliable service for all your shopping needs.
        </Text>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        enableOverDrag={false}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
        keyboardBehavior="fill"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
      >
        <BottomSheetScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.bottomSheetScrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.sheetIconContainer}>
            <Ionicons name="bag-handle" size={moderateScale(28)} color="#0d1b12" />
          </View>

          <View style={styles.sheetHeadline}>
            <Text style={styles.sheetMainTitle}>
              Welcome to SuperEx
            </Text>
            <Text style={styles.sheetSubtitle}>
            </Text>
          </View>

          <View style={styles.segmentedControl}>
            <TouchableOpacity
              style={[styles.segment, isLogin && styles.segmentActive]}
              onPress={() => {
                setIsLogin(true);
                resetFields();
              }}
            >
              <Text
                style={[
                  styles.segmentText,
                  isLogin && styles.segmentTextActive,
                ]}
              >
                Log In
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.segment, !isLogin && styles.segmentActive]}
              onPress={() => {
                setIsLogin(false);
                setRole("customer");
                resetFields();
              }}
            >
              <Text
                style={[
                  styles.segmentText,
                  !isLogin && styles.segmentTextActive,
                ]}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sheetForm}>
            {!isLogin && (
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Full Name</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="person-outline"
                    size={moderateScale(20)}
                    color="#94a3b8"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your full name"
                    placeholderTextColor="#94a3b8"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                  />
                </View>
              </View>
            )}

            {!isLogin && (
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Account Type</Text>

                <View style={styles.roleSwitch}>
                  <TouchableOpacity
                    style={[
                      styles.roleBtn,
                      role === "customer" && styles.roleBtnActive,
                    ]}
                    onPress={() => setRole("customer")}
                    activeOpacity={0.9}
                  >
                    <Ionicons
                      name="person-outline"
                      size={moderateScale(18)}
                      color={role === "customer" ? "#0d1b12" : "#64748b"}
                      style={{ marginRight: 8 }}
                    />
                    <Text
                      style={[
                        styles.roleText,
                        role === "customer" && styles.roleTextActive,
                      ]}
                    >
                      Customer
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.roleBtn,
                      role === "seller" && styles.roleBtnActive,
                    ]}
                    onPress={() => setRole("seller")}
                    activeOpacity={0.9}
                  >
                    <Ionicons
                      name="storefront-outline"
                      size={moderateScale(18)}
                      color={role === "seller" ? "#0d1b12" : "#64748b"}
                      style={{ marginRight: 8 }}
                    />
                    <Text
                      style={[
                        styles.roleText,
                        role === "seller" && styles.roleTextActive,
                      ]}
                    >
                      Seller
                    </Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.roleHint}>
                  {role === "seller"
                    ? "Seller can add products later."
                    : "Customer can browse and order products."}
                </Text>
              </View>
            )}

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                {isLogin ? "Email" : "Email Address"}
              </Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="mail-outline"
                  size={moderateScale(20)}
                  color="#94a3b8"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="name@example.com"
                  placeholderTextColor="#94a3b8"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="lock-closed-outline"
                  size={moderateScale(20)}
                  color="#94a3b8"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder={isLogin ? "Enter your password" : "Create a strong password"}
                  placeholderTextColor="#94a3b8"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />

                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={moderateScale(20)}
                    color="#94a3b8"
                  />
                </TouchableOpacity>
              </View>

              {isLogin && (
                <TouchableOpacity style={styles.forgotPassword}>
                  <Text style={styles.forgotPasswordText}>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleSubmit}
              activeOpacity={0.9}
              disabled={loginMut.isPending || signupMut.isPending}
            >
              <Text style={styles.actionButtonText}>
                {isLogin ? "Log In" : "Create Account"}
              </Text>
            </TouchableOpacity>

            {loginMut.isPending || signupMut.isPending ? (
              <Text style={styles.loadingText}>Please wait...</Text>
            ) : null}
          </View>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>Or continue with</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.socialButtons}>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-google" size={moderateScale(24)} color="#EA4335" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-apple" size={moderateScale(24)} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-facebook" size={moderateScale(24)} color="#1877F2" />
            </TouchableOpacity>
          </View>

          <View style={styles.sheetFooter}>
            <Text style={styles.footerText}>
              By continuing, you agree to our{" "}
              <Text style={styles.footerLink}>Terms of Service</Text> and{" "}
              <Text style={styles.footerLink}>Privacy Policy</Text>.
            </Text>
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: moderateScale(20),
    backgroundColor: "#fff"
  },
  content: {
    alignItems: "center",
    marginBottom: moderateScale(50)
  },
  title: {
    fontSize: scaleFontSize(32),
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: moderateScale(5)
  },
  subtitle: {
    fontSize: scaleFontSize(32),
    fontWeight: "bold",
    color: "#34A853",
    marginBottom: moderateScale(20)
  },
  description: {
    fontSize: scaleFontSize(16),
    color: "#666",
    textAlign: "center",
    paddingHorizontal: moderateScale(20)
  },
  buttons: {
    width: "100%",
    alignItems: "center"
  },
  button: {
    width: "100%",
    height: moderateScale(50),
    backgroundColor: "#34A853",
    borderRadius: moderateScale(8),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: moderateScale(15)
  },
  buttonText: {
    color: "#fff",
    fontSize: scaleFontSize(16),
    fontWeight: "bold"
  },

  bottomSheetBackground: {
    backgroundColor: "#fff",
    borderTopLeftRadius: moderateScale(24),
    borderTopRightRadius: moderateScale(24),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: Platform.OS === 'ios' ? 0.1 : 0,
    shadowRadius: Platform.OS === 'ios' ? 12 : 0,
    elevation: Platform.OS === 'android' ? 16 : 0
  },
  handleIndicator: {
    backgroundColor: "#e2e8f0",
    width: scaleWidth(40),
    height: moderateScale(4)
  },
  bottomSheetScrollContent: {
    paddingHorizontal: moderateScale(24),
    paddingTop: moderateScale(16),
    paddingBottom: moderateScale(24)
  },

  sheetIconContainer: {
    width: scaleWidth(48),
    height: scaleWidth(48),
    borderRadius: moderateScale(24),
    backgroundColor: "#13ec5b",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: moderateScale(16),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: Platform.OS === 'ios' ? 0.3 : 0,
    shadowRadius: Platform.OS === 'ios' ? 8 : 0,
    elevation: Platform.OS === 'android' ? 8 : 0
  },
  sheetHeadline: {
    alignItems: "center",
    marginBottom: 0
  },
  sheetMainTitle: {
    fontSize: scaleFontSize(28),
    fontWeight: "bold",
    color: "#1a1a1a",
    textAlign: "center",
    marginBottom: moderateScale(8),
    lineHeight: scaleFontSize(34)
  },
  sheetSubtitle: {
    fontSize: scaleFontSize(16),
    color: "#64748b",
    textAlign: "center",
    fontWeight: "500"
  },

  segmentedControl: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    borderRadius: moderateScale(12),
    padding: moderateScale(4),
    marginBottom: moderateScale(24),
    borderWidth: 1,
    borderColor: "#e2e8f0"
  },
  segment: {
    flex: 1,
    paddingVertical: moderateScale(12),
    alignItems: "center",
    borderRadius: moderateScale(8)
  },
  segmentActive: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: Platform.OS === 'ios' ? 0.1 : 0,
    shadowRadius: Platform.OS === 'ios' ? 2 : 0,
    elevation: Platform.OS === 'android' ? 2 : 0
  },
  segmentText: {
    fontSize: scaleFontSize(14),
    fontWeight: "500",
    color: "#64748b"
  },
  segmentTextActive: {
    fontWeight: "bold",
    color: "#1a1a1a"
  },

  sheetForm: {
    marginBottom: moderateScale(24)
  },
  fieldContainer: {
    marginBottom: moderateScale(16)
  },
  label: {
    fontSize: scaleFontSize(14),
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: moderateScale(6),
    marginLeft: moderateScale(4)
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: moderateScale(12),
    height: moderateScale(56)
  },
  inputIcon: {
    marginLeft: moderateScale(16),
    marginRight: moderateScale(12)
  },
  input: {
    flex: 1,
    fontSize: scaleFontSize(16),
    color: "#1a1a1a",
    height: "100%"
  },
  passwordInput: {
    paddingRight: moderateScale(48)
  },
  eyeIcon: {
    position: "absolute",
    right: moderateScale(16),
    padding: moderateScale(4)
  },

  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: moderateScale(4)
  },
  forgotPasswordText: {
    fontSize: scaleFontSize(14),
    fontWeight: "600",
    color: "#0eb545"
  },

  actionButton: {
    backgroundColor: "#13ec5b",
    height: moderateScale(56),
    borderRadius: moderateScale(28),
    justifyContent: "center",
    alignItems: "center",
    marginTop: moderateScale(8),
    shadowColor: "#13ec5b",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: Platform.OS === 'ios' ? 0.25 : 0,
    shadowRadius: Platform.OS === 'ios' ? 12 : 0,
    elevation: Platform.OS === 'android' ? 8 : 0
  },
  actionButtonText: {
    color: "#0d1b12",
    fontSize: scaleFontSize(18),
    fontWeight: "bold",
    letterSpacing: 0.5
  },
  loadingText: {
    marginTop: moderateScale(10),
    textAlign: "center",
    color: "#64748b",
    fontWeight: "600",
    fontSize: scaleFontSize(14)
  },

  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: moderateScale(20)
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#e2e8f0"
  },
  dividerText: {
    marginHorizontal: moderateScale(16),
    fontSize: scaleFontSize(14),
    color: "#64748b",
    fontWeight: "500"
  },

  socialButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: moderateScale(16),
    marginBottom: moderateScale(20)
  },
  socialButton: {
    width: scaleWidth(56),
    height: scaleWidth(56),
    borderRadius: moderateScale(28),
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: Platform.OS === 'ios' ? 0.05 : 0,
    shadowRadius: Platform.OS === 'ios' ? 2 : 0,
    elevation: Platform.OS === 'android' ? 1 : 0
  },

  sheetFooter: {
    alignItems: "center",
    paddingHorizontal: moderateScale(16)
  },
  footerText: {
    fontSize: scaleFontSize(12),
    color: "#94a3b8",
    textAlign: "center",
    lineHeight: scaleFontSize(18)
  },
  footerLink: {
    color: "#475569",
    fontWeight: "500",
    textDecorationLine: "underline"
  },

  roleSwitch: {
    flexDirection: "row",
    gap: moderateScale(10),
    marginTop: moderateScale(6)
  },
  roleBtn: {
    flex: 1,
    height: moderateScale(52),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#f8fafc",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  roleBtnActive: {
    backgroundColor: "#13ec5b",
    borderColor: "#13ec5b"
  },
  roleText: {
    fontWeight: "800",
    color: "#64748b",
    fontSize: scaleFontSize(14)
  },
  roleTextActive: {
    color: "#0d1b12"
  },
  roleHint: {
    marginTop: moderateScale(8),
    color: "#64748b",
    fontWeight: "600",
    fontSize: scaleFontSize(12)
  },
});
