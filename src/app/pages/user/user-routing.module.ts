import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PATH_URL_DATA } from '@shared/constants/constants';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  { path: '', component: UserComponent , pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
