import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PATH_URL_DATA } from '@shared/constants/constants';

const routes: Routes = [
  { path: '', redirectTo: PATH_URL_DATA.urlVacaciones, pathMatch: 'full' },
  { path: PATH_URL_DATA.urlVacaciones, loadChildren: () => import('./pages/vacation/vacation.module').then(m => m.VacationModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
