import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';

export default function SplashScreen({ navigation }) {
  const [fadeAnim] = useState(new Animated.Value(1)); 

  useEffect(() => {
    
    Animated.timing(fadeAnim, {
      toValue: 0, 
      duration: 10000, 
      useNativeDriver: true,
    }).start(() => {
      
      navigation.replace('Register');
    });
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Image source={require('./assets/logo.png')} style={styles.logo} />
      <Text style={styles.mainTitle}>IRB</Text>
      <Text style={styles.subTitle}>Intelligent Road Bollard</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1f44',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  mainTitle: {
    fontSize: 48, 
    color: '#ffcc00',
    fontWeight: 'bold', 
    textAlign: 'center',
    fontFamily: 'sans-serif-light', 
  },
  subTitle: {
    fontSize: 18, 
    color: '#ffcc00',
    textAlign: 'center',
    fontFamily: 'sans-serif-light', 
    marginTop: 5, 
  },
});



