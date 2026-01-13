import {View, Text, StyleSheet, ScrollView, ImageBackground, TouchableOpacity} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';      
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import SearchBar from './component/SearchBar';
export default function Homescreen() {
    const [search, setSearch] = useState('');
    const router = useRouter(); 
    return (

        <View style={styles.container}>
        <StatusBar style="light" />

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.container}>
      <SearchBar
        value={search}
        onChange={setSearch}
      />

    </View>

            <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800' }}
            style={styles.headerImage}
            resizeMode="cover"
            >
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.6)']}
                style={styles.gradient} 
            >
                <View style={styles.iconContainer}>
                <Ionicons name="bag-handle" size={28} color="#0d1b12" />
                </View>
            </LinearGradient>
            </ImageBackground>
            <View style={styles.content}>
            <Text style={styles.welcomeText}>Welcome to SuperMarket Express!</Text>
            <Text style={styles.descriptionText}>Your one-stop shop for fresh groceries delivered to your doorstep.</Text>
            <TouchableOpacity style={styles.shopButton} onPress={() => router.push('/shop')}>
                <Text style={styles.shopButtonText}>Start Shopping</Text>
            </TouchableOpacity>
            </View>
        </ScrollView>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,

        backgroundColor: '#f0f4f8',
    },
    scrollView: {       
        flex: 1,    
    },
    headerImage: {
        width: '100%',
        height: 250,
        justifyContent: 'flex-end',
    },
    gradient: {
        height: '100%',
        justifyContent: 'flex-end',
        padding: 15,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        overflow: 'hidden',
    },
    iconContainer: {
        backgroundColor: '#fff',
        padding: 8, 
        borderRadius: 30,
        alignSelf: 'flex-start',
    },
    content: {
        padding: 20,
    },
    welcomeText: {  
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0d1b12',   
        marginBottom: 10,
    },
    descriptionText: {  
        fontSize: 16,
        color: '#4a4a4a',
        marginBottom: 20,
    },
    shopButton: {
        backgroundColor: '#13ec5b',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    shopButtonText: {
        color: '#0d1b12',
        fontSize: 18,
        fontWeight: 'bold',
    },
     container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  }
}); 
    