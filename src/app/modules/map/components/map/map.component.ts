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
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { NewDonerFormComponent } from '../new-doner-form/new-doner-form.component';
import { NewDonerService } from '../../services/new-doner.service';
import { NgZone } from '@angular/core';
import { MyControl } from '../../shared/classes/myControl';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnDestroy, OnChanges {
  map$: EventEmitter<Map> = new EventEmitter();
  zoom$: EventEmitter<number> = new EventEmitter();

  @ViewChild('newDonerForm') newDonerForm: any;

  @Input() options!: MapOptions;

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
  userMarker!: L.Marker;
  myControl!: L.Control;
  mouseEvent!: L.LeafletMouseEvent;

  constructor(
    private newDonerService: NewDonerService,
    public dialog: MatDialog,
    private zone: NgZone
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    const changesArr = Object.keys(changes);

    if (this.map) {
      changesArr.forEach((change) => {
        switch (change) {
          case 'userСoordinates':
            this.updateUserMarker();
            break;

          case 'doners':
            this.updateDonersMarkers();
            break;

          case 'searchRadius':
            this.updateLines(this.doners, this.map);
            this.updateArrowsPosition(this.invisibleLines);
            break;
        }
      });
    }
  }

  ngOnInit() {
    this.myControl = new MyControl(this.userСoordinates);
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
    this.map.addControl(this.myControl);
    this.updateUserMarker();
    this.updateDonersMarkers();
    map.on('move', () => {
      this.updateLines(this.doners, map);
      this.updateArrowsPosition(this.invisibleLines);
    });
    map.on('contextmenu', (e: L.LeafletMouseEvent) => {
      this.mouseEvent = e;
    });
  }

  onMapZoomEnd(e: ZoomAnimEvent | any) {
    this.zoom = e.target.getZoom();
    this.zoom$.emit(this.zoom);
  }

  openSettingsDialog(e: L.LeafletMouseEvent) {
    this.zone.run(() => {
      this.openDialog(e);
    });
  }
  openDialog(e: L.LeafletMouseEvent) {
    const dialogRef = this.dialog.open(NewDonerFormComponent, {
      data: { e },
      width: document.documentElement.clientWidth < 800 ? '90%' : '30%',
    });

    console.log(NewDonerFormComponent);

    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
      if (this.newDonerService.newDoner) {
        console.log(this.doners);
        this.addDenerMarker(this.createNewDoner(this.newDonerService.newDoner));
        console.log(this.doners);
      }
    });
  }

  createNewDoner(doner: Doner): Doner {
    this.doners.push(doner);
    return doner;
  }

  addDenerMarker(doner: Doner) {
    L.marker([doner.coordinates.lat, doner.coordinates.lon], markerForDener)
      .addTo(this.map)
      .bindPopup(
        `<b style="color: black; background-color: white">${doner.name}</b>`
      );
  }

  updateDonersMarkers() {
    this.doners.forEach((doner) => {
      this.addDenerMarker(doner);
    });
  }

  updateUserMarker(): void {
    if (this.userMarker) {
      this.userMarker.remove();
    }

    this.userMarker = L.marker(
      [this.userСoordinates.lat, this.userСoordinates.lon],
      markerForUser.markerUserIcon
    )
      .addTo(this.map)
      .bindPopup(markerForUser.popupUserInfo);
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
        //result
        const arrow = L.marker(intersectionPoint, markerArrow).addTo(this.map);
        this.arrowPointers.push(arrow);
      }
    });
  }

  updateLines(doners: Doner[], map: L.Map) {
    this.invisibleLines = [];
    const center = map.getCenter();

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
}
