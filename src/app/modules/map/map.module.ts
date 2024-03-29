import { NgModule } from '@angular/core';
import { MapRoutingModule } from './map-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { RootMapComponent } from './root-map.component';
import { MapComponent } from './components/map/map.component';

import { MatSliderModule } from '@angular/material/slider';
import { SliderComponent } from './components/slider/slider.component';
import { NewDonerFormComponent } from './components/new-doner-form/new-doner-form.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { CdkMenuModule } from '@angular/cdk/menu';

@NgModule({
  declarations: [
    RootMapComponent,
    MapComponent,
    SliderComponent,
    NewDonerFormComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MapRoutingModule,
    LeafletModule,
    MatSliderModule,
    MatDialogModule,
    MatCardModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    HttpClientModule,
    CdkMenuModule,
  ],
})
export class MapModule {}
