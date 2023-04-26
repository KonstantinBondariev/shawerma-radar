import { Component, OnDestroy, OnInit } from '@angular/core';
import { GeolocationService } from 'src/app/services/geolocation-service.service';
import { doners } from './shared/data/donerData';

import { MapOptions, tileLayer, latLng, circle, polygon } from 'leaflet';
import { Doner } from './shared/types/doner';
import { GetDonersDataService } from './services/get-doners-data.service';
@Component({
  selector: 'root-map',
  templateUrl: './root-map.component.html',
  styleUrls: ['./root-map.component.scss'],
})
export class RootMapComponent implements OnInit, OnDestroy {
  options!: MapOptions;

  watchPositionId!: number;
  currentCoord!: { lat: number; lon: number };
  doners: Doner[] = [];

  radiusValue!: number;

  constructor(
    private geolocationService: GeolocationService,
    private getDonersData: GetDonersDataService
  ) {
    this.geolocationService
      .getLocation()
      .then((res) => {
        this.options = this.setOptions(
          res.coords.latitude,
          res.coords.longitude
        );
      })
      .catch((err) => alert(err.message));
  }

  ngOnInit(): void {
    this.getDoners();
    this.watchPositionId = this.geolocationService.watchLocation((position) => {
      console.log(position.coords);

      this.currentCoord = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      };
    });
  }

  ngOnDestroy(): void {
    navigator.geolocation.clearWatch(this.watchPositionId);
  }

  setOptions(latitude: number, longitude: number): MapOptions {
    return {
      layers: [
        tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          opacity: 1,
          maxZoom: 19,
          detectRetina: true,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }),
      ],
      zoom: 15,
      center: latLng(latitude, longitude),
    };
  }

  getDoners() {
    this.getDonersData.getDeners().subscribe((res) => (this.doners = res));
  }

  setRadiusValue(newItem: number) {
    this.radiusValue = newItem;
  }
}
