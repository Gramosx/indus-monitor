#include <ESP8266WiFi.h>
#include <ArduinoJson.h>
#include <DHT.h>
#include <SPI.h>
#include <Adafruit_ADS1X15.h>

Adafruit_ADS1115 ads;

const char *ssid = "APCER IT";

const char *password = "@pcer!23";

const char *server = "192.168.0.181";

const char *deviceId = "DEVICE01";

const char *location = "Gram01846-ADI";

#define DHTPIN D7 // Digital pin connected to the DHT sensor

#define DHTTYPE DHT11 // DHT 11

DHT dht(DHTPIN, DHTTYPE);

const int sensorIn = A0;
int mVperAmp = 100; // use 185 for 5A, 100 for 20A Module and 66 for 30A Module

double Voltage = 0;
double VRMS = 0;
double AmpsRMS = 0;

WiFiClient client;

float getVPP()
{
  float result;

  int readValue;       // value read from the sensor
  int maxValue = 0;    // store max value here
  int minValue = 1024; // store min value here

  uint32_t start_time = millis();

  while ((millis() - start_time) < 1000) // sample for 1 Sec
  {
    readValue = analogRead(sensorIn);
    // see if you have a new maxValue
    if (readValue > maxValue)
    {
      /*record the maximum sensor value*/
      maxValue = readValue;
    }
    if (readValue < minValue)
    {
      /*record the maximum sensor value*/
      minValue = readValue;
    }
    /*       Serial.print(readValue);
           Serial.println(" readValue ");
           Serial.print(maxValue);
           Serial.println(" maxValue ");
           Serial.print(minValue);
           Serial.println(" minValue ");
           delay(1000); */
  }

  // Subtract min from max
  result = ((maxValue - minValue) * 5) / 1024.0;

  return result;
}

void connectToWifi()
{
  // Connect to WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {

    delay(1000);

    Serial.println("Connecting to WiFi...");
  }

  Serial.println("Connected to WiFi");
}

void setup()
{

  DHT dht(DHTPIN, DHTTYPE);

  pinMode(A0, INPUT);
  pinMode(D3, OUTPUT);

  Serial.begin(9600);
  dht.begin();
  ads.begin();
  ads.setGain(GAIN_ONE);
  connectToWifi();
}

void loop()
{

  // Read temperature and humidity from the DHT sensor
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();

  // Check if any readings failed and exit early if so
  if (isnan(temperature) || isnan(humidity))
  {
    Serial.println("Failed to read from DHT sensor!");
  }

  // Print temperature and humidity to the serial monitor
  Serial.print("Temperature: ");
  Serial.print(temperature);
  Serial.print(" °C\tHumidity: ");
  Serial.print(humidity);
  Serial.println(" %");

  VRMS = (getVPP() / 2.0) * 0.707; // sq root
  AmpsRMS = (VRMS * 1000) / mVperAmp;
  float Wattage = (220 * AmpsRMS) - 7.59; // Observed 18-20 or 6 Watt when no load was connected, so substracting offset value to get real consumption.

  int ave = 0;
  int64_t value = 0;
  for (size_t i = 0; i < 100; i++)
  {
    value = value + (ads.readADC_SingleEnded(1) - 13074);
    delay(1);
  }
  ave = (value / 100);

  // take average
  Voltage = abs(ave / 6.21);

  // Create JSON object

  StaticJsonDocument<200>
      jsonDoc;

  jsonDoc["deviceId"] = deviceId;
  jsonDoc["location"] = location;

  jsonDoc["data"]["temperature"] = temperature;
  jsonDoc["data"]["humidity"] = humidity;
  jsonDoc["data"]["watt"] = Wattage;
  jsonDoc["data"]["voltage"] = Voltage;

  char jsonBuffer[200];

  serializeJson(jsonDoc, jsonBuffer);

  // Make POST request

  client.connect(server, 3000);

  String postData = jsonBuffer;

  String postLength = String(postData.length());

  client.print(String("POST /api/devices HTTP/1.1\r\n") +

               "Host: " + server + "\r\n" +

               "Content-Type: application/json\r\n" +

               "Content-Length: " + postLength + "\r\n" +

               "Connection: close\r\n\r\n" +

               postData);

  while (client.connected())
  {
    if (client.available())
    {
      String line = client.readString();
      // Serial.println(line);
      // Check if the response contains the string "success"
      if (line.indexOf("success") != -1)
      {
        // Trigger the relay connected to D3
        digitalWrite(D3, LOW);
        Serial.println("Relay triggered!");
      }
      else
      {
        digitalWrite(D3, HIGH);
      }
    }
  }

  client.stop();
  // delay(1500);
}