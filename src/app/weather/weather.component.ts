import { Component } from '@angular/core';
import { faPlus, faRotate, faXmark } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { CityData } from './Interfaces/CityData';
import { WeatherData } from './Interfaces/WeatherData';
import { ManageCitiesService } from './Services/manage-cities.service';
import { ManageWeatherService } from './Services/manage-weather.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css'],
})
export class WeatherComponent {
  faRotate = faRotate;
  faXmark = faXmark;
  faPlus = faPlus;
  queryText: string = '';
  citiesList: CityData[] = [];
  activeCity: string = '';
  cityWeatherData: WeatherData = {
    city: '',
    weather: [],
  };
  constructor(
    private cities: ManageCitiesService,
    private weather: ManageWeatherService,
    private toastr: ToastrService
  ) {
    this.cities.getCitiesList().subscribe((citieslist) => {
      this.citiesList = citieslist;
      console.log(citieslist);
    });
  }
  getCityWeatherData(city: string) {
    this.activeCity = city;
    this.weather
      .getCityWeatherData(this.activeCity)
      .subscribe((CityWeatherData) => {
        this.cityWeatherData = CityWeatherData;
      });
  }
  addCity(queryText: string) {
    this.cities.addCity(queryText).subscribe((success) => {
      if (success) {
        this.weather.fetchOrRefreshWeatherData(queryText);
        this.queryText = '';
      } else {
        console.log('Failed to add city ' + queryText);
        this.toastr.error('Failed to add city' + queryText);
      }
    });
  }
  refreshCity(city: string) {
    this.weather.fetchOrRefreshWeatherData(city);
    this.toastr.success(city + ' City Refreshed');
  }
  deleteCity(index: number) {
    this.cities.deleteCity(index);
  }
  clearCities() {
    this.cities.resetCitiesList();
    this.toastr.success('All Cities Cleared');
  }
}
