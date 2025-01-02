#include <WiFi.h>
#include <HTTPClient.h>
#include <Adafruit_NeoPixel.h>

// Ustawienia diod LED
#define LED_PIN 13
#define NUMPIXELS 12
#define SENSOR_PIN 12

// Dane sieci WiFi
const char* ssid = "NETIASPOT-4E10";
const char* password = "4A07FB2B5DE12F18";

const char* serverName = "http://192.168.0.3:5000/api/detection";

// Inicjalizacja diod 
Adafruit_NeoPixel pixels(NUMPIXELS, LED_PIN, NEO_GRB + NEO_KHZ800);

void setup() {
  Serial.begin(115200);
  pixels.begin();
  pixels.clear();
  pixels.show();
  
  pinMode(SENSOR_PIN, INPUT);

  // Łączenie z WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Łączenie z WiFi...");
  }
  Serial.println("Połączono z WiFi");
  Serial.println(WiFi.localIP());
}

void loop() {
  int motionDetected = digitalRead(SENSOR_PIN);

  if (motionDetected == HIGH) {
    Serial.println("Ruch wykryty! Wysyłanie danych...");

    
    for (int i = 0; i < NUMPIXELS; i++) {
      pixels.setPixelColor(i, pixels.Color(255, 0, 0));  
    }
    pixels.show();

    // Wyślij dane do API
    if (WiFi.status() == WL_CONNECTED) {
      HTTPClient http;
      http.begin(serverName);
      http.addHeader("Content-Type", "application/json");

      // Tworzenie danych  (np. długość i szerokość geograficzna)
      String jsonData = "{\"longitude\": 19.9184710, \"latitude\": 50.0795850}";

      int httpResponseCode = http.POST(jsonData);

      if (httpResponseCode > 0) {
        String response = http.getString();
        Serial.println(httpResponseCode);
        Serial.println(response);
      } else {
        Serial.print("Błąd przy wysyłaniu POST: ");
        Serial.println(httpResponseCode);
      }

      http.end();
    } else {
      Serial.println("Brak połączenia WiFi");
    }

    
    delay(5000);
    pixels.clear();
    pixels.show();

    // Czekaj, aż ruch ustanie
    while (digitalRead(SENSOR_PIN) == HIGH) {
      delay(100);
    }
  }

  delay(100);  
}


