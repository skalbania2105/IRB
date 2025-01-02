import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { TextInput, Button, Card } from 'react-native-paper';
import axios from 'axios';

const BASE_URL = 'http://192.168.0.3:3000';

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleRegister = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/register`, {
        username,
        email,
        password,
      });

      alert(response.data.message);
      navigation.navigate('Dashboard');
    } catch (error) {
      console.error('Błąd rejestracji:', error.message);
      alert('Rejestracja nieudana');
    } finally {
      setLoading(false);
    }
  };

  const validateInputs = () => {
    let valid = true;

    if (!email.includes('@')) {
      setEmailError('Błędny e-mail');
      valid = false;
    } else {
      setEmailError('');
    }

    if (password.length < 5) {
      setPasswordError('Hasło musi mieć minimum 5 znaków');
      valid = false;
    } else {
      setPasswordError('');
    }

    return valid;
  };

  return (
    <ImageBackground
      source={require('./assets/map_background.jpg')}
      style={styles.background}
      imageStyle={{ opacity: 0.3 }}
    >
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>Zarejestruj się</Text>
            <TextInput
              label="Nazwa użytkownika"
              value={username}
              onChangeText={setUsername}
              style={styles.input}
            />
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              style={styles.input}
              error={emailError}
            />
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            <TextInput
              label="Hasło"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              style={styles.input}
              error={passwordError}
            />
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
            <Button
              mode="contained"
              onPress={handleRegister}
              style={styles.button}
              loading={loading}
              disabled={loading}
            >
              Zarejestruj się
            </Button>
            <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginText}>Masz już konto? Zaloguj się</Text>
            </TouchableOpacity>
          </Card.Content>
        </Card>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 15,
    borderRadius: 8,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  loginButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  loginText: {
    color: '#0a1f44',
    fontSize: 16,
  },
});





























