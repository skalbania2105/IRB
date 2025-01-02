import React, { useState } from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { TextInput, Button, Text, RadioButton, Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function DashboardScreen({ navigation }) {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [mode, setMode] = useState('driving');

  const fetchDirections = async () => {
    const apiKey = 'AIzaSyA7kDrErYkiCnZfXuwlXrZRMDK4o5AirMc'; 
    const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(
      origin
    )}&destination=${encodeURIComponent(destination)}&mode=${mode}&key=${apiKey}`;

    try {
      const response = await fetch(directionsUrl);
      const data = await response.json();
      console.log('Directions API Response:', data);

      if (data.status !== 'OK') {
        console.error('Directions API Error:', data.status, data.error_message);
        alert('Nie znaleziono trasy: ' + data.error_message);
        return;
      }

      if (data.routes && data.routes.length > 0) {
        const routeCoordinates = decodePolyline(data.routes[0].overview_polyline.points);
        const duration = data.routes[0].legs[0].duration.text;
        const distance = data.routes[0].legs[0].distance.text;

        console.log('Route Coordinates:', routeCoordinates);
        console.log('Duration:', duration);
        console.log('Distance:', distance);

        navigation.navigate('Map', { route: routeCoordinates, duration, distance, mode });
      } else {
        alert('Nie znaleziono trasy. Sprawdź wprowadzone lokalizacje.');
      }
    } catch (error) {
      console.error('Błąd w zapytaniu do Directions API:', error);
      alert('Wystąpił problem z połączeniem. Sprawdź połączenie z internetem.');
    }
  };

  const decodePolyline = (t) => {
    let points = [];
    let index = 0,
      len = t.length;
    let lat = 0,
      lng = 0;

    while (index < len) {
      let b, shift = 0,
        result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }

    return points;
  };

  return (
    <ImageBackground
      source={require('./assets/map_background.jpg')}
      style={styles.background}
      imageStyle={{ opacity: 0.3 }}
    >
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Title
            title="Wprowadź lokalizacje"
            left={(props) => <Icon {...props} name="map-marker-path" size={28} color="#0a1f44" />}
            titleStyle={styles.title}
          />
          <Card.Content>
            <TextInput
              label="Punkt początkowy"
              value={origin}
              onChangeText={setOrigin}
              style={styles.input}
              mode="outlined"
              outlineColor="#0a1f44"
              theme={{ colors: { primary: '#0a1f44' } }}
            />
            <TextInput
              label="Punkt końcowy"
              value={destination}
              onChangeText={setDestination}
              style={styles.input}
              mode="outlined"
              outlineColor="#0a1f44"
              theme={{ colors: { primary: '#0a1f44' } }}
            />
            <RadioButton.Group onValueChange={setMode} value={mode}>
              <View style={styles.radioRow}>
                <RadioButton value="driving" color="#0a1f44" />
                <Text>Samochodem</Text>
              </View>
              <View style={styles.radioRow}>
                <RadioButton value="walking" color="#0a1f44" />
                <Text>Pieszo</Text>
              </View>
              <View style={styles.radioRow}>
                <RadioButton value="bicycling" color="#0a1f44" />
                <Text>Rowerem</Text>
              </View>
            </RadioButton.Group>
          </Card.Content>
          <Card.Actions style={styles.cardActions}>
            <Button
              mode="contained"
              onPress={fetchDirections}
              style={styles.button}
              buttonColor="#0a1f44"
              textColor="#ffcc00"
            >
              Pokaż na Mapie
            </Button>
            <Button
              mode="outlined"
              onPress={() => navigation.navigate('Register')}
              style={styles.button}
              textColor="#0a1f44"
            >
              Wyloguj się
            </Button>
          </Card.Actions>
        </Card>
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
  card: {
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    elevation: 5,
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0a1f44',
  },
  input: {
    marginBottom: 15,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  button: {
    margin: 5,
    borderRadius: 8,
  },
  cardActions: {
    justifyContent: 'space-between',
    marginTop: 10,
  },
});




