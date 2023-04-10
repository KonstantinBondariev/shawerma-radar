import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

import * as L from 'leaflet';

import {
  Map,
  LatLng,
  LatLngExpression,
  Marker,
  Control,
  DomUtil,
  ZoomAnimEvent,
  Layer,
  MapOptions,
  tileLayer,
  latLng,
  circle,
  polygon,
  MarkerOptions,
  icon,
  marker,
} from 'leaflet';
import { GeolocationService } from 'src/app/services/geolocation-service.service';
import { userData } from 'src/app/modules/shared/data/userData';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnDestroy {
  @Output() map$: EventEmitter<Map> = new EventEmitter();
  @Output() zoom$: EventEmitter<number> = new EventEmitter();
  @Input() options: MapOptions = {
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
    center: latLng(50, 30),
  };

  @Input() layersControl: any = {
    baseLayers: {
      'Open Street Map': tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        { maxZoom: 18, attribution: '...' }
      ),
      'Open Cycle Map': tileLayer(
        'https://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
        { maxZoom: 18, attribution: '...' }
      ),
    },
    overlays: {
      'Big Circle': circle([50, 30], { radius: 5000 }),
      'Big Square': polygon([
        [46.8, -121.55],
        [46.9, -121.55],
        [46.9, -121.7],
        [46.8, -121.7],
      ]),
    },
  };

  @Input() userСoordinates!: {
    lat: number;
    lon: number;
  };

  @Input() deners!: {
    name: string;
    coordinates: { lat: number; lon: number };
    rating: string;
  }[];

  popupRollText = 'Shawerma';

  markerRollIcon = {
    icon: L.icon({
      iconSize: [15, 32],
      iconAnchor: [10, 41],
      popupAnchor: [2, -40],
      // specify the path here
      iconUrl: 'assets/img/roll.png',
      // shadowUrl:
      //   'https://unpkg.com/leaflet@1.4.0/dist/images/marker-shadow.png',
    }),
  };

  public map!: Map;
  public zoom!: number;

  constructor(private geolocationService: GeolocationService) {}

  addDenersMarkers(doner: {
    name: string;
    coordinates: { lat: number; lon: number };
    rating: string;
  }) {
    L.marker(
      [doner.coordinates.lat, doner.coordinates.lon],
      this.markerRollIcon
    )
      .addTo(this.map)
      .bindPopup(
        `<b style="color: black; background-color: white">${doner.name}</b>`
      );
  }

  initMarkers() {
    L.marker(
      [this.userСoordinates.lat, this.userСoordinates.lon],
      userData.markerUserIcon
    )
      .addTo(this.map)
      .bindPopup(userData.popupUserInfo);

    this.deners.forEach((dener) => this.addDenersMarkers(dener));
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.map.clearAllEventListeners;
    this.map.remove();
  }

  onMapReady(map: Map) {
    this.map = map;
    this.map$.emit(map);
    this.zoom = map.getZoom();
    this.zoom$.emit(this.zoom);
    this.initMarkers();
  }

  onMapZoomEnd(e: ZoomAnimEvent | any) {
    this.zoom = e.target.getZoom();
    this.zoom$.emit(this.zoom);
  }
}
