import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { citiesData } from '../Data/Cities';
import { CityData } from '../Interfaces/CityData';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class ManageCitiesService {
  private apiKey = environment.API_KEY;
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

  // getCitiesList: Returns an observable of the current list of cities.
  getCitiesList() {
    return this.citiesListSubject.asObservable();
  }

  // addCity: Adds a new city to the list if it doesn't already exist and fetches its weather data.
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

  // getTempForCity: Fetches the temperature and weather condition for a given city.
  getTempForCity(city: string): Observable<any> {
    const params = new HttpParams().set('q', city).set('appid', this.apiKey);
    return this.http.get<any>(this.apiUrl, { params }).pipe(
      catchError((error) => {
        console.error('Error fetching weather data:', error);
        return of(null);
      })
    );
  }

  // deleteCity: Removes a city from the list based on its index.
  deleteCity(index: number) {
    this.citiesList.splice(index, 1);
    this.citiesListSubject.next([...this.citiesList]);
  }

  // resetCitiesList: Clears the cities list and resets it to an empty state.
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
