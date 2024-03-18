import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { WeatherData } from '../Interfaces/WeatherData';
import { ManageCitiesService } from './manage-cities.service';
//http://api.openweathermap.org/data/2.5/weather?q=mumbai&appid=d4594364698122bfd1c4b3eb5f2ff19f
//http://api.openweathermap.org/data/2.5/forecast?q=azadshahr&appid=d4594364698122bfd1c4b3eb5f2ff19f&units&metric

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
    this.cities.getCities().subscribe((citieslist) => {
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
    const params = new HttpParams()
      .set('q', city)
      .set('appid', this.apiKey)
      .set('units', 'metric');
    return this.http.get<any>(this.apiUrl, { params }).pipe(
      map((response) => ({
        city: response.city.name,
        weather: response.list.map(
          (item: {
            dt_txt: any;
            main: { temp: any; pressure: any };
            wind: { speed: any };
          }) => ({
            date: item.dt_txt,
            temperature: item.main.temp,
            wind: item.wind.speed,
            pressure: item.main.pressure,
          })
        ),
      }))
    );
  }
}
