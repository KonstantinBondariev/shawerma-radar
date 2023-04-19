import { NgModule } from '@angular/core';
import { MapRoutingModule } from './map-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { RootMapComponent } from './root-map.component';
import { MapComponent } from './components/map/map.component';

import { MatSliderModule } from '@angular/material/slider';
import { SliderComponent } from './components/slider/slider.component';

@NgModule({
  declarations: [RootMapComponent, MapComponent, SliderComponent],
  imports: [
    CommonModule,
    FormsModule,
    MapRoutingModule,
    LeafletModule,
    MatSliderModule,
  ],
})
export class MapModule {}
