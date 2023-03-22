import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomMaterialModule } from './custom-material/custom-material.module';
import { FullscreenComponent } from './fullscreen/fullscreen.component';
import { RouterModule } from '@angular/router';
import { IconsModule } from './icons/icons.module';



const modules = [
  CustomMaterialModule,
  IconsModule
]

@NgModule({
  declarations: [FullscreenComponent,

  ],
  imports: [
    CommonModule,
    RouterModule,
    ...modules
  ],
  exports: [
    ...modules,
    FullscreenComponent,
  ]
})
export class SharedModule { }
