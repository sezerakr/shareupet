import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from './main-layout/main-layout.component';

@NgModule({
  imports: [
    CommonModule,
    MainLayoutComponent
  ],
  exports: [
    MainLayoutComponent
  ]
})
export class LayoutModule { }
