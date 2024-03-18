import { Component } from '@angular/core';
import { WeatherData } from './Interfaces/WeatherData';
import { ManageCitiesService } from './Services/manage-cities.service';
import { ManageWeatherService } from './Services/manage-weather.service';
@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css'],
})
export class WeatherComponent {
  queryText: string = '';
  citiesList: string[] = [];
  activeCity: string = '';
  cityWeatherData: WeatherData = {
    city: '',
    weather: [],
  };
  constructor(
    private cities: ManageCitiesService,
    private weather: ManageWeatherService
  ) {
    this.cities.getCities().subscribe((citieslist) => {
      this.citiesList = citieslist;
      console.log(citieslist);
    });
  }
  // getcities() {
  //   this.cities.getCities();
  //   this.cities.getCities().subscribe((cities) => {
  //     console.log(cities);
  //   });
  // }
  getCityWeatherData(city: string) {
    this.activeCity = city;
    this.weather
      .getCityWeatherData(this.activeCity)
      .subscribe((CityWeatherData) => {
        this.cityWeatherData = CityWeatherData;
      });
  }
  getCitiesListTemp() {}
  addCity(queryText: string) {
    this.cities.addCity(queryText).subscribe((success) => {
      if (success) {
        this.weather.fetchOrRefreshWeatherData(queryText);
      } else {
        console.log('Failed to add city ' + queryText);
      }
    });
  }
  refreshCity(city: string) {
    this.weather.fetchOrRefreshWeatherData(city);
  }
  deleteCity(index: number) {
    this.cities.deleteCity(index);
  }
}
