import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './SplashScreen';
import RegisterScreen from './RegisterScreen';
import LoginScreen from './LoginScreen';
import DashboardScreen from './DashboardScreen';
import MapScreen from './MapScreen';
import { theme } from './theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="SplashScreen"
          screenOptions={{
            headerStyle: { backgroundColor: theme.colors.primary },
            headerTintColor: theme.colors.onSurface,
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        >
          {/* Ekran powitalny z logo */}
          <Stack.Screen
            name="SplashScreen"
            component={SplashScreen}
            options={{ headerShown: false }} 
          />

          {/* Ekran rejestracji */}
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }} 
          />

          {/* Ekran logowania */}
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: 'Zaloguj się' }}
          />

          {/* Dashboard */}
          <Stack.Screen
            name="Dashboard"
            component={DashboardScreen}
            options={{
              title: 'Dashboard',
              headerStyle: { backgroundColor: theme.colors.primary },
              headerTintColor: theme.colors.onSurface,
              headerRight: () => (
                <Icon
                  name="account-circle"
                  size={28}
                  color={theme.colors.onSurface}
                  style={{ marginRight: 10 }}
                />
              ),
            }}
          />

          {/* Ekran Mapy */}
          <Stack.Screen name="Map" component={MapScreen} options={{ title: 'Mapa' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}























