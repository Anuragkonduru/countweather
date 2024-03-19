import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { WeatherData } from '../Interfaces/WeatherData';
import { ManageCitiesService } from './manage-cities.service';
//http://api.openweathermap.org/data/2.5/weather?q=mumbai&appid=d4594364698122bfd1c4b3eb5f2ff19f
//http://api.openweathermap.org/data/2.5/forecast?q=azadshahr&appid=d4594364698122bfd1c4b3eb5f2ff19f&units=metric

@Injectable({
  providedIn: 'root',
})
export class ManageWeatherService {
  private apiKey = 'd4594364698122bfd1c4b3eb5f2ff19f';
  private apiUrl = 'https://api.openweathermap.org/data/2.5/forecast';
  citiesList: string[] = [];
  citiesListWeatherData: WeatherData[] = [];
  private citiesListWeatherDataSubject = new BehaviorSubject<any[]>([]);
  constructor(private http: HttpClient, private cities: ManageCitiesService) {
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
  getCityWeatherData(city: string) {
    this.fetchOrRefreshWeatherData(city);
    return this.citiesListWeatherDataSubject
      .asObservable()
      .pipe(map((data: any[]) => data.find((item) => item.city === city)));
  }
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