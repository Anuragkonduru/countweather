import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { WeatherData } from '../Interfaces/WeatherData';
import { ManageCitiesService } from './manage-cities.service';

@Injectable({
  providedIn: 'root',
})
export class ManageWeatherService {
  private apiKey = process.env['API_KEY'] || '';
  private apiUrl = 'https://api.openweathermap.org/data/2.5/forecast';
  citiesList: string[] = [];
  citiesListWeatherData: WeatherData[] = [];
  private citiesListWeatherDataSubject = new BehaviorSubject<any[]>([]);

  constructor(private http: HttpClient, private cities: ManageCitiesService) {
    console.log(this.apiKey);
    this.cities.getCitiesList().subscribe((citieslist) => {
      this.citiesList = citieslist;
    });
    this.citiesList.map((city) => {
      this.getWeatherData(city).subscribe((cityData) => {
        this.citiesListWeatherData.push(cityData);
      });
    });
    this.citiesListWeatherDataSubject.next([...this.citiesListWeatherData]);
  }

  // getCityWeatherData: Returns an observable for the weather data of a specific city.
  getCityWeatherData(city: string) {
    this.fetchOrRefreshWeatherData(city);
    return this.citiesListWeatherDataSubject
      .asObservable()
      .pipe(map((data: any[]) => data.find((item) => item.city === city)));
  }
  // fetchOrRefreshWeatherData: Fetches weather data for a city and updates the citiesListWeatherData array with the latest data. If the city is already in the list, it updates its data; otherwise, it adds the new city data to the list.
  fetchOrRefreshWeatherData(city: string) {
    this.getWeatherData(city).subscribe((cityData) => {
      const index = this.citiesListWeatherData.findIndex(
        (item) => item.city === cityData.city
      );
      if (index !== -1) {
        this.citiesListWeatherData[index] = cityData;
      } else {
        this.citiesListWeatherData.push(cityData);
      }
      this.citiesListWeatherData.push(cityData);
    });
    this.citiesListWeatherDataSubject.next([...this.citiesListWeatherData]);
  }

  // getWeatherData: Makes an HTTP request to fetch weather data for a given city.
  getWeatherData(city: string): Observable<WeatherData> {
    const cityName = typeof city === 'string' ? city : 'mumbai';
    const params = new HttpParams()
      .set('q', cityName)
      .set('appid', this.apiKey)
      .set('units', 'metric')
      .set('units', 'metric');
    return this.http
      .get<any>(this.apiUrl, { params })
      .pipe(map((response) => this.filterWeatherData(response)));
  }

  // filterWeatherData: Processes the raw API response to extract and format the required weather data.
  private filterWeatherData(response: any): WeatherData {
    const today = new Date();
    const forecast: any[] = [];
    const datesEncountered: string[] = [];

    response.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toLocaleDateString('en-US', {
        day: 'numeric',
        weekday: 'short',
      });

      if (
        date >= today &&
        !datesEncountered.includes(dateKey) &&
        forecast.length < 6
      ) {
        const windSpeed = item.wind.speed.toFixed(2);
        const windDirection = item.wind.deg;
        forecast.push({
          date: dateKey,
          temperature: Math.round(item.main.temp),
          weather: item.weather[0].main,
          wind: `${windSpeed} m/s ${windDirection}°`,
          pressure: item.main.pressure,
        });
        datesEncountered.push(dateKey);
      }
    });

    return {
      city: response.city.name,
      weather: forecast,
    };
  }
}
