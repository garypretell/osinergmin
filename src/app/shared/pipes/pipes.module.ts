import {NgModule} from '@angular/core';
import {CommonModule, DecimalPipe} from '@angular/common';
import { FilterFormatPipe } from './filter_format.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    FilterFormatPipe
  ],
  exports: [
    FilterFormatPipe,
  ],
  providers: [

  ]
})
export class PipesModule {
}
