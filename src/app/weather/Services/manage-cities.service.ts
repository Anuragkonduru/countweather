import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { citiesData } from '../Data/Cities';
import { CityData } from '../Interfaces/CityData';
@Injectable({
  providedIn: 'root',
})
export class ManageCitiesService {
  private apiKey = 'd4594364698122bfd1c4b3eb5f2ff19f';
  private apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
  private allCities: string[] = [];
  private citiesList: CityData[] = [
    { cityName: '', temperature: 0, feelsLike: '' },
  ];
  private citiesListSubject = new BehaviorSubject<any[]>([]);
  constructor(private http: HttpClient, private toastr: ToastrService) {
    this.citiesListSubject.next([...this.citiesList]);
    this.allCities = citiesData.cities;
  }

  getCitiesList() {
    return this.citiesListSubject.asObservable();
  }
  addCity(city: string): Observable<boolean> {
    const cityName = city
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
    if (this.allCities.includes(cityName)) {
      const index = this.citiesList.findIndex(
        (item) => item.cityName === cityName
      );
      if (index !== -1) {
        this.toastr.info(city + ' Already Exists');
      } else {
        this.getTempForCity(cityName).subscribe({
          next: (weatherData) => {
            const cityData: CityData = {
              cityName: cityName,
              temperature: Math.round(weatherData.main.temp - 273.15),
              feelsLike: weatherData.weather[0].main,
            };

            this.citiesList.unshift(cityData);

            if (this.citiesList.length > 8) {
              this.citiesList.pop();
            }

            this.citiesListSubject.next([...this.citiesList]);
          },
          error: (error) => {
            console.error('Error fetching weather data:', error);
          },
        });
      }
      return of(true);
    } else {
      return of(false);
    }
  }
  getTempForCity(city: string): Observable<any> {
    const params = new HttpParams().set('q', city).set('appid', this.apiKey);
    return this.http.get<any>(this.apiUrl, { params }).pipe(
      catchError((error) => {
        console.error('Error fetching weather data:', error);
        return of(null);
      })
    );
  }
  deleteCity(index: number) {
    this.citiesList.splice(index, 1);
    this.citiesListSubject.next([...this.citiesList]);
  }
  resetCitiesList() {
    console.log('reset called');
    try {
      this.citiesList = [];
      this.citiesListSubject.next([]);
      console.log('Cities list reset successfully.');
    } catch (error) {
      console.error('Error occurred while resetting cities list:', error);
    }
  }
}
