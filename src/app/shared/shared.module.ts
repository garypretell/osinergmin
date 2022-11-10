import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from '@shared/components/alert/alert.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoaderComponent } from './components/loader/loader.component';
import { MessageComponent } from './components/message/message.component';

@NgModule({
  declarations: [
    AlertComponent,
    LoaderComponent,
    MessageComponent
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatDialogModule
  ],
  exports: [
    AlertComponent,
    MessageComponent
  ], 
  entryComponents : [
    AlertComponent,
    LoaderComponent,
    MessageComponent
  ], 
  providers: [
  ]
})

export class SharedModule { }