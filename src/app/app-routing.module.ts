import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'vacaciones', pathMatch: 'full' },
  { path: 'vacaciones', loadChildren: () => import('./pages/vacation/vacation.module').then(m => m.VacationModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
