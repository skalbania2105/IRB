import { DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#0a1f44', // Granatowy jako kolor przewodni
    accent: '#ffcc00',  // Żółty akcent
    background: '#f5f5f5', // Jasne tło
    text: '#333', // Ciemniejszy tekst
    surface: '#FFFFFF', // Tło dla kart i przycisków
    onSurface: '#0a1f44', // Granatowy tekst na powierzchni (np. na przyciskach)
    placeholder: '#666666', // Kolor tekstu w polach tekstowych, gdy są puste
    disabled: '#CCCCCC', // Kolor dla przycisków w stanie wyłączonym
  },
  roundness: 8, // Zaokrąglenie krawędzi
};




