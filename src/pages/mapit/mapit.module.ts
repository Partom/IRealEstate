import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapitPage } from './mapit';

@NgModule({
  declarations: [
    MapitPage,
  ],
  imports: [
    IonicPageModule.forChild(MapitPage),
  ],
})
export class MapitPageModule {}
