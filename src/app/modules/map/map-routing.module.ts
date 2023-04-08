import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RootMapComponent } from './root-map.component';

const routes: Routes = [{ path: '', component: RootMapComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapRoutingModule {}
