import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { MapRoutingModule } from './map-routing.module';
import { RootMapComponent } from './root-map.component';
import { MapComponent } from './components/map/map.component';

@NgModule({
  declarations: [RootMapComponent, MapComponent],
  imports: [CommonModule, MapRoutingModule, LeafletModule],
})
export class MapModule {}
