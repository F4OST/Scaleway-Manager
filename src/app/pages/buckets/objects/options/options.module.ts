import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OptionsPage } from './options.page';
import {ObjInfosPage} from './obj-infos/obj-infos.page';

const routes: Routes = [
  {
    path: '',
    component: OptionsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
})
export class OptionsPageModule {}
