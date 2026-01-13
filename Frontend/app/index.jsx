import React, { useRef, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Dimensions,TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['85%', '95%'], []);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleGetStarted = () => {
    bottomSheetRef.current?.expand();
  };

  const handleSubmit = () => {
    if (isLogin) {
      console.log('Login:', email, password);
      bottomSheetRef.current?.close();
      router.push('/login');
    } else {
      console.log('Signup:', name, email, password);
      bottomSheetRef.current?.close();
      router.push('/Signup');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <LottieView
        source={require('../assets/Supermarket Cart.json')} 
        autoPlay
        loop
        style={{ width: width * 0.7, height: width * 0.7, marginBottom: 30 }}
      />

      <View style={styles.content}>
        <Text style={styles.title}>SuperMarket</Text>
        <Text style={styles.subtitle}>Express</Text>
        <Text style={styles.description}>
          Order groceries and get them delivered to your door in minutes! Fast, convenient, and reliable service for all your shopping needs.
        </Text>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity 
          style={styles.button}
          onPress={handleGetStarted}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
      >
        <BottomSheetView style={styles.bottomSheetContent}>
          <View style={styles.sheetIconContainer}>
            <Ionicons name="bag-handle" size={28} color="#0d1b12" />
          </View>

          <View style={styles.sheetHeadline}>
            <Text style={styles.sheetMainTitle}>Welcome to SuperMarket Express</Text>
            <Text style={styles.sheetSubtitle}>Get fresh produce delivered to your door.</Text>
          </View>

          <View style={styles.segmentedControl}>
            <TouchableOpacity
              style={[styles.segment, isLogin && styles.segmentActive]}
              onPress={() => setIsLogin(true)}
            >
              <Text style={[styles.segmentText, isLogin && styles.segmentTextActive]}>Log In</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.segment, !isLogin && styles.segmentActive]}
              onPress={() => setIsLogin(false)}
            >
              <Text style={[styles.segmentText, !isLogin && styles.segmentTextActive]}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sheetForm}>
            {!isLogin && (
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Full Name</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="person-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
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

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>{isLogin ? 'Email or Username' : 'Email Address'}</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
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
                <Ionicons name="lock-closed-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
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
                    size={20}
                    color="#94a3b8"
                  />
                </TouchableOpacity>
              </View>
              {isLogin && (
                <TouchableOpacity style={styles.forgotPassword}>
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleSubmit}
              activeOpacity={0.9}
            >
              <Text style={styles.actionButtonText}>{isLogin ? 'Log In' : 'Create Account'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>Or continue with</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.socialButtons}>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-google" size={24} color="#EA4335" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-apple" size={24} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-facebook" size={24} color="#1877F2" />
            </TouchableOpacity>
          </View>

          <View style={styles.sheetFooter}>
            <Text style={styles.footerText}>
              By continuing, you agree to our{' '}
              <Text style={styles.footerLink}>Terms of Service</Text>
              {' '}and{' '}
              <Text style={styles.footerLink}>Privacy Policy</Text>.
            </Text>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff'
  },
  content: {
    alignItems: 'center',
    marginBottom: 50
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 5
  },
  subtitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#34A853',
    marginBottom: 20
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20
  },
  buttons: {
    width: '100%',
    alignItems: 'center'
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#34A853',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  link: {
    color: '#34A853',
    marginTop: 10
  },
  bottomSheetBackground: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 16
  },
  handleIndicator: {
    backgroundColor: '#e2e8f0',
    width: 40,
    height: 4
  },
  bottomSheetContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24
  },
  sheetIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#13ec5b',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8
  },
  sheetHeadline: {
    alignItems: 'center',
    marginBottom: 24
  },
  sheetMainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 34
  },
  sheetSubtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    fontWeight: '500'
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  segment: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8
  },
  segmentActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b'
  },
  segmentTextActive: {
    fontWeight: 'bold',
    color: '#1a1a1a'
  },
  sheetForm: {
    marginBottom: 24
  },
  fieldContainer: {
    marginBottom: 16
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 6,
    marginLeft: 4
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    height: 56
  },
  inputIcon: {
    marginLeft: 16,
    marginRight: 12
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
    height: '100%'
  },
  passwordInput: {
    paddingRight: 48
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    padding: 4
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 4
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0eb545'
  },
  actionButton: {
    backgroundColor: '#13ec5b',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#13ec5b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8
  },
  actionButtonText: {
    color: '#0d1b12',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0'
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500'
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 20
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1
  },
  sheetFooter: {
    alignItems: 'center',
    paddingHorizontal: 16
  },
  footerText: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 18
  },
  footerLink: {
    color: '#475569',
    fontWeight: '500',
    textDecorationLine: 'underline'
  }
});
