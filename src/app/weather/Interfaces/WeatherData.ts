export interface WeatherData {
  city: string;
  weather: {
    date: string;
    temperature: string;
    weather: string;
    wind: string;
    pressure: string;
  }[];
}
