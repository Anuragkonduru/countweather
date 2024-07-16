import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CounterComponent } from './counter/counter.component';
import { WeatherComponent } from './weather/weather.component';

const routes: Routes = [
  { path: '', redirectTo: '/vatavaran', pathMatch: 'full' },
  { path: 'counter', component: CounterComponent },
  { path: 'vatavaran', component: WeatherComponent },
  {
    path: '**',
    component: WeatherComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
