import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

import * as L from 'leaflet';

import {
  Map,
  ZoomAnimEvent,
  MapOptions,
  tileLayer,
  latLng,
  circle,
  polygon,
} from 'leaflet';

import { markerForUser } from 'src/app/modules/map/shared/data/markerForUser';
import { markerForDener } from '../../shared/data/markerForDener';

import 'leaflet-geodesy';
import 'leaflet-rotatedmarker';

import * as turf from '@turf/turf';
import { Doner } from '../../shared/types/doner';
import { MatDialog } from '@angular/material/dialog';
import { NewDonerFormComponent } from '../new-doner-form/new-doner-form.component';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnDestroy, OnChanges {
  map$: EventEmitter<Map> = new EventEmitter();
  zoom$: EventEmitter<number> = new EventEmitter();

  @ViewChild('newDonerForm') newDonerForm: any;

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
  //  исправить для отображение активного периметра шаверма-радара
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

  @Input() doners!: Doner[];

  @Input() searchRadius!: number;

  public map!: Map;
  public zoom!: number;

  invisibleLines: L.Polyline[] = [];
  arrowPointers: L.Marker[] = [];

  constructor(private dialog: MatDialog) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.map) {
      this.doners.forEach((doner) => this.isDistanceLess(doner));
      this.initMarkers();
      this.updateLines(this.doners, this.map);
      this.updateArrowsPosition(this.invisibleLines);
    }
  }

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
    map.on('move', () => {
      this.updateLines(this.doners, map);
      this.updateArrowsPosition(this.invisibleLines); //&&&
    });
    map.on('click', (e: L.LeafletMouseEvent) => {
      // this.addDenersMarkers(this.createNewDoner(e.latlng));
      this.openDialog();
    });
  }

  openDialog() {
    this.dialog.open(NewDonerFormComponent, { width: '30%' });
  }

  onMapZoomEnd(e: ZoomAnimEvent | any) {
    this.zoom = e.target.getZoom();
    this.zoom$.emit(this.zoom);
  }

  addDenersMarkers(doner: Doner) {
    L.marker([doner.coordinates.lat, doner.coordinates.lon], markerForDener)
      .addTo(this.map)
      .bindPopup(
        `<b style="color: black; background-color: white">${doner.name}</b>`
      );
  }

  createNewDoner(latlng: L.LatLng): Doner {
    const doner: Doner = {
      name: 'new Doner',
      coordinates: { lat: latlng.lat, lon: latlng.lng },
      rating: '5',
    };
    this.doners.push(doner);
    return doner;
  }

  initMarkers() {
    //user marker
    L.marker(
      [this.userСoordinates.lat, this.userСoordinates.lon],
      markerForUser.markerUserIcon
    )
      .addTo(this.map)
      .bindPopup(markerForUser.popupUserInfo);
    //doners makers
    this.doners.forEach((doner) => {
      this.addDenersMarkers(doner);
    });
  }

  isDistanceLess(doner: Doner): boolean {
    var userCoordinates = L.latLng(
      this.userСoordinates.lat,
      this.userСoordinates.lon
    );
    var donerCoordinates = L.latLng(
      doner.coordinates.lat,
      doner.coordinates.lon
    );
    var distance = userCoordinates.distanceTo(donerCoordinates); // вычисляем направление на объект
    return distance < this.searchRadius ? true : false;
  }

  updateLines(doners: Doner[], map: L.Map) {
    if (this.invisibleLines) {
      this.invisibleLines.forEach((line) => line.remove());
    }

    const center = map.getCenter();
    this.invisibleLines = [];

    doners.forEach((doner) => {
      if (this.isDistanceLess(doner)) {
        const latLngs = [
          center,
          L.latLng(doner.coordinates.lat, doner.coordinates.lon),
        ];
        const polyline = L.polyline(latLngs, { color: 'null' }).addTo(map);
        this.invisibleLines.push(polyline);
      }
    });
  }

  updateArrowsPosition(lines: L.Polyline[]) {
    if (this.arrowPointers)
      this.arrowPointers.forEach((arrow) => arrow?.remove());

    lines.forEach((line) => {
      const startPoint: any = line.toGeoJSON().geometry.coordinates[0];
      const finishPoint: any = line.toGeoJSON().geometry.coordinates[1];

      let vector = [];
      vector.push(finishPoint[0] - startPoint[0]);
      vector.push(finishPoint[1] - startPoint[1]);

      const angleInDegrees: Number =
        Math.atan2(vector[0], vector[1]) * (180 / Math.PI);

      const markerArrow = {
        icon: L.icon({
          iconUrl: 'assets/img/arrow2.png',
          iconSize: [100, 100],
          iconAnchor: [50, 50],
        }),

        rotationAngle: angleInDegrees,
        rotationOrigin: 'center',
      };

      const lineGeojson: any = line.toGeoJSON().geometry.coordinates;
      const trufLine = turf.lineString([lineGeojson[0], lineGeojson[1]]);

      const rectangleGeojson = L.rectangle(this.map.getBounds()).toGeoJSON();

      const intersection = turf.lineIntersect(trufLine, rectangleGeojson);

      if (intersection.features[0]) {
        const intersectionPoint = L.latLng(
          intersection.features[0].geometry.coordinates[1],
          intersection.features[0].geometry.coordinates[0]
        );

        const arrow = L.marker(intersectionPoint, markerArrow).addTo(this.map);
        this.arrowPointers.push(arrow);
      }
    });
  }
}
