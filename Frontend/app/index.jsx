import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

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
        <Text style={styles.title}>SuperMarket express</Text>
        <Text style={styles.subtitle}>Express</Text>
        <Text style={styles.description}>
          Order groceries and get them delivered to your door in minutes! Fast, convenient, and reliable service for all your shopping needs.
        </Text>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.push('/login')}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/Signup')}>
          <Text style={styles.link}>Don't Have Account? Sign Up</Text>
        </TouchableOpacity>
      </View>
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
  }
});
