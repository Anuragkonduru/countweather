export interface WeatherData {
  city: string;
  weather: {
    date: string;
    temperature: string;
    wind: string;
    pressure: string;
  }[];
}
