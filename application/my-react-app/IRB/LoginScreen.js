import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import axios from 'axios';

const BASE_URL = 'http://192.168.0.3:3000'; 

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/login`, { email, password });
      alert(response.data.message);
      navigation.navigate('Dashboard'); // Przejdź do dashboardu po udanym logowaniu
    } catch (error) {
      console.error('Błąd logowania:', error.response?.data || error.message);
      alert(error.response?.data?.error || 'Logowanie nieudane');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('./assets/map_background.jpg')}
      style={styles.background}
      imageStyle={{ opacity: 0.3 }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Zaloguj się</Text>
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          style={styles.input}
        />
        <TextInput
          label="Hasło"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          style={styles.input}
        />
        <Button
          mode="contained"
          onPress={handleLogin}
          style={styles.button}
          loading={loading}
          disabled={loading}
        >
          Zaloguj się
        </Button>
        <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerText}>Nie masz konta? Zarejestruj się</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#0a1f44',
    marginBottom: 20,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 15,
    borderRadius: 8,
    paddingVertical: 5,
    backgroundColor: '#0a1f44',
  },
  registerButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  registerText: {
    color: '#0a1f44',
    fontSize: 16,
  },
});







