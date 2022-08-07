import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from './../../material.module';

import { PeopleComponent } from './components/people/people.component';
import { MainRoutingModule } from './main-routing.module';

@NgModule({
  declarations: [PeopleComponent],
  imports: [
    CommonModule,
    MainRoutingModule,
    MaterialModule
  ]
})
export class MainModule { }
