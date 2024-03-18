import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { citiesData } from '../Data/Cities';

@Injectable({
  providedIn: 'root',
})
export class ManageCitiesService {
  private allCities: string[] = [];
  private citiesList: string[] = ['Mumbai'];
  private citiesListSubject = new BehaviorSubject<any[]>([]);
  constructor() {
    this.citiesListSubject.next([...this.citiesList]);
    this.allCities = citiesData.cities;
  }

  getCities(): Observable<string[]> {
    return of(this.citiesList);
  }
  getCitiesList() {
    return this.citiesListSubject.asObservable();
  }
  addCity(city: string): Observable<boolean> {
    const cityName = city
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
    if (this.allCities.includes(cityName)) {
      this.citiesList.push(cityName);
      this.citiesListSubject.next([...this.citiesList]);
      return of(true);
    } else {
      return of(false);
    }
  }
  deleteCity(index: number) {
    this.citiesList.splice(index, 1);
    this.citiesListSubject.next([...this.citiesList]);
  }
  resetCitiesList() {
    this.citiesList = [];
    this.citiesListSubject.next([...this.citiesList]);
  }
}
