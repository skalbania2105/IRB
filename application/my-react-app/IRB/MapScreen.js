import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Card, ActivityIndicator } from 'react-native-paper';
import * as Location from 'expo-location';
import axios from 'axios';

export default function MapScreen({ route, navigation }) {
  const { route: routeCoordinates, duration, distance, mode } = route.params || {};
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stepIndex, setStepIndex] = useState(0);
  const [steps, setSteps] = useState([]);
  const [remainingDistance, setRemainingDistance] = useState(distance);
  const [remainingTime, setRemainingTime] = useState(duration);
  const [arrivalTime, setArrivalTime] = useState('');
  const [detections, setDetections] = useState([]); 

  useEffect(() => {
    updateHeaderTitle();
  }, [remainingDistance, remainingTime, arrivalTime]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Dostęp do lokalizacji jest wymagany, aby korzystać z tej funkcji.');
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords);
      setLoading(false);

      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (newLocation) => {
          setCurrentLocation(newLocation.coords);
          updateStepIndex(newLocation.coords);
          updateRemainingDistanceAndTime(newLocation.coords);
          
        }
      );
    })();
  }, []);

  useEffect(() => {
    if (routeCoordinates) {
      fetchDirectionsSteps();
    }
  }, [routeCoordinates]);

  useEffect(() => {
    const interval = setInterval(fetchActiveDetections, 5000); // Co 5 sekund pobieramy wykrycia
    return () => clearInterval(interval);
  }, []);

  const fetchActiveDetections = async () => {
    try {
      const response = await axios.get('http://192.168.0.3:5000/api/active_detections'); 
      const dataWithTimestamps = response.data.map((detection) => ({
        ...detection,
        timestamp: new Date().toLocaleTimeString(), // Przechowujemy czas wykrycia
      }));
      setDetections(dataWithTimestamps);
    } catch (error) {
      console.error('Błąd przy pobieraniu wykryć:', error);
    }
  };

  const fetchDirectionsSteps = async () => {
    try {
      const apiKey = 'AIzaSyA7kDrErYkiCnZfXuwlXrZRMDK4o5AirMc';
      const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${routeCoordinates[0].latitude},${routeCoordinates[0].longitude}&destination=${routeCoordinates[routeCoordinates.length - 1].latitude},${routeCoordinates[routeCoordinates.length - 1].longitude}&mode=${mode}&key=${apiKey}`;
      const response = await fetch(directionsUrl);
      const data = await response.json();

      if (data.status === 'OK' && data.routes[0]) {
        const routeSteps = data.routes[0].legs[0].steps;
        setSteps(routeSteps);
      } else {
        console.error('Błąd w Directions API:', data.status);
      }
    } catch (error) {
      console.error('Błąd podczas pobierania kroków trasy:', error);
    }
  };

  const updateStepIndex = (coords) => {
    if (steps.length === 0) return;

    for (let i = stepIndex; i < steps.length; i++) {
      const step = steps[i];
      const endLocation = step.end_location;
      const distanceToNextStep = getDistance(
        coords.latitude,
        coords.longitude,
        endLocation.lat,
        endLocation.lng
      );

      if (distanceToNextStep < 50) {
        setStepIndex(i + 1);
      }
    }
  };

  const updateRemainingDistanceAndTime = (coords) => {
    if (steps.length === 0 || !coords) return;
  
    let totalDistance = 0;
    let totalTime = 0;
    
  
    // Obliczamy pozostały dystans i czas na podstawie aktualnego kroku
    for (let i = stepIndex; i < steps.length; i++) {
      totalDistance += steps[i].distance.value;
      totalTime += steps[i].duration.value;
    }
  
    const distanceInKm = totalDistance > 1000 ? (totalDistance / 1000).toFixed(1) + ' km' : totalDistance + ' m';
    const timeInMinutes = totalTime > 60 ? Math.ceil(totalTime / 60) + ' min' : totalTime + ' sec';
  
    setRemainingDistance(distanceInKm);
    setRemainingTime(timeInMinutes);
  
    // Obliczanie godziny przybycia
    const currentTime = new Date();
    currentTime.setSeconds(currentTime.getSeconds() + totalTime); // Dodajemy pozostały czas w sekundach
  
    const arrivalHour = currentTime.getHours().toString().padStart(2, '0');
    const arrivalMinute = currentTime.getMinutes().toString().padStart(2, '0');
    const formattedArrivalTime = `${arrivalHour}:${arrivalMinute}`;
  
    setArrivalTime(formattedArrivalTime); // Aktualizujemy stan
  };

const updateHeaderTitle = () => {
  navigation.setOptions({
    headerTitle: () => (
      <View style={styles.headerContent}>
        <Text style={styles.headerText}>Pozostało: {remainingDistance}, {remainingTime}</Text>
        <Text style={styles.headerSubtext}>Przybycie: {arrivalTime || '---'}</Text>
      </View>
    ),
    headerStyle: { backgroundColor: '#0a1f44', height: 100 },
  });
};

  

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const getIconSource = () => {
    switch (mode) {
      case 'driving':
        return require('./assets/car_icon.png');
      case 'bicycling':
        return require('./assets/bicycle_icon.png');
      case 'walking':
        return require('./assets/walking_icon.png');
      default:
        return require('./assets/walking_icon.png');
    }
  };

  const handleDetectionPress = (timestamp) => {
    Alert.alert('Wykrycie ruchu', `Czas wykrycia: ${timestamp}`);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator animating={true} size="large" style={styles.loading} />
      ) : (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: currentLocation ? currentLocation.latitude : 50.0619474,
            longitude: currentLocation ? currentLocation.longitude : 19.9368564,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation={false}
          followsUserLocation={true}
        >
          {currentLocation && (
            <Marker
              coordinate={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
              }}
              title="Twoja lokalizacja"
              description="Jesteś tutaj"
            >
              <Image source={getIconSource()} style={styles.icon} />
            </Marker>
          )}
          {routeCoordinates && (
            <Polyline coordinates={routeCoordinates} strokeColor="#0a1f44" strokeWidth={4} />
          )}
          {detections.map((detection) => (
            <Marker
              key={`${detection.id}-${detection.timestamp}`}
              coordinate={{
                latitude: detection.latitude,
                longitude: detection.longitude,
              }}
              onPress={() => handleDetectionPress(detection.timestamp)}
            >
              <View style={styles.detectionDot} />
            </Marker>
          ))}
        </MapView>
      )}
      {steps[stepIndex] && (
        <Card style={styles.infoBox}>
          <Card.Content>
            <Text style={styles.stepTitle}>Kolejny krok:</Text>
            <Text style={styles.stepInstruction}>
              {steps[stepIndex].html_instructions.replace(/<[^>]+>/g, '')}
            </Text>
            <Text style={styles.stepDetails}>
              Odległość do kroku: {steps[stepIndex].distance.text}
            </Text>
            <Text style={styles.stepDetails}>
              Szacowany czas: {steps[stepIndex].duration.text}
            </Text>
          </Card.Content>
        </Card>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  detectionDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'red',
  },
  infoBox: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#0a1f44',
    borderRadius: 12,
    elevation: 6,
    padding: 15,
  },
  stepTitle: {
    color: '#ffcc00',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  stepInstruction: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 8,
  },
  stepDetails: {
    color: '#ffcc00',
    fontSize: 14,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerSubtext: {
    color: '#ffcc00',
    fontSize: 14,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
  },
});

