import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '@core/guards/auth-guard.service';
import { ProtectedGuardService } from '@core/guards/protected-guard.service';
import { HomeComponent } from '@pages/home/home.component';
import { PATH_URL_DATA } from '@shared/constants/constants';

const routes: Routes = [
  { path: '', redirectTo: PATH_URL_DATA.urlHome, pathMatch: 'full' },
  { path: PATH_URL_DATA.urlHome,component: HomeComponent, canActivate: [AuthGuardService] },
  { path: PATH_URL_DATA.urlVacaciones, canActivate: [ProtectedGuardService], loadChildren: () => import('./pages/vacation/vacation.module').then(m => m.VacationModule) },
  { path: PATH_URL_DATA.urlUsuarios, loadChildren: () => import('./pages/user/user.module').then(m => m.UserModule) },
  { path: PATH_URL_DATA.urlPeriodos, loadChildren: () => import('./pages/period/period.module').then(m => m.PeriodModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
