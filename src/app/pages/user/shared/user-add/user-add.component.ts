import { DatePipe } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BandejaService } from '@shared/services/bandeja.service';
import { BaseFormUser } from '@shared/utils/base-form-user';
import { IDatosRegistroResponse, IEmpleadosReemplazo } from '@shared/models/common/interfaces/bandeja.interface';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { Observable, Subject } from 'rxjs';
import { VacationService } from '@pages/vacation/vacation.service';
import { PATH_URL_DATA } from '@shared/constants/constants';
import { Router } from '@angular/router';
import { map, startWith, debounceTime, tap, finalize, takeUntil } from 'rxjs/operators';

enum Action {
  EDIT = 'edit',
  NEW = 'new',
}

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css']
})
export class UserAddComponent implements OnInit, OnDestroy {

  ocultar = false;
  usuario: any;
  tipoLista: any[] = [];
  actionTODO = Action.NEW;
  listaEmpleadosReemplazo: Array<IEmpleadosReemplazo> = [];
  filteredReemplazo: Observable<IEmpleadosReemplazo[]> | undefined;
  reemplazoValue: any;
  private unsubscribe$ = new Subject();
  isLoading = false;
  constructor(
    private bandejaService: BandejaService,
    private vacationService: VacationService,
    private router: Router,
    public dialogRef: MatDialogRef<UserAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public userForm: BaseFormUser,
    private datePipe: DatePipe,
    public dialog: MatDialog,
  ) { }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
    this.unsubscribe$.complete();
  }

  private _filterStatesReemplazo(value: any): IEmpleadosReemplazo[] {
    const filterValue = value.nombres ? value.nombres.toLowerCase() : value.toLowerCase();

    return this.listaEmpleadosReemplazo.filter(state => state.nombres.toLowerCase().includes(filterValue));
  }

  ngOnInit(): void {
    this.listaEmpleadosReemplazo = this.data.lista;
    this.filteredReemplazo = this.userForm.baseForm.get('codEmplReemplazo')?.valueChanges.pipe(
      tap(() => this.isLoading = true),
      debounceTime(300),
      startWith(''),
      map(state => {
        if(state) {
          this.userForm?.baseForm?.get('codEmpl')?.setValue(+state.identificacion);
          this.userForm?.baseForm?.get('apeEmpl')?.setValue(state.apellido);
          this.userForm?.baseForm?.get('nomEmpl')?.setValue(state.nombre);
          this.userForm?.baseForm?.get('boxMail')?.setValue(state.email);
        }
        this.isLoading = false;
        return state ? this._filterStatesReemplazo(state) : this.listaEmpleadosReemplazo.slice();
      })
    );


    if (this.data?.user.hasOwnProperty('codUsuario')) {
      this.actionTODO = Action.EDIT;
      this.reemplazoValue = this.listaEmpleadosReemplazo.find(x => x.identificacion === this.data?.user?.codEmpl);
      this.reemplazoValue ? this.userForm.baseForm.get('codEmplReemplazo')?.setValue(this.reemplazoValue) : this.userForm.baseForm.reset();
      if( this.reemplazoValue) {
          this.userForm?.baseForm?.get('codEmpl')?.setValue(+this.reemplazoValue.identificacion);
          this.userForm?.baseForm?.get('apeEmpl')?.setValue(this.reemplazoValue.apellido);
          this.userForm?.baseForm?.get('nomEmpl')?.setValue(this.reemplazoValue.nombre);
          this.userForm?.baseForm?.get('boxMail')?.setValue(this.reemplazoValue.email);
          this.userForm?.baseForm?.get('tipoUsuario')?.setValue(this.data?.user?.tipoUsuario);
      }
      this.ocultar = true;
      // this.userForm.baseForm.updateValueAndValidity();
      // this.pathFormData();
    } else {
      if (this.data?.nuevo) {
        this.userForm.baseForm.reset();
      }
    }

  }

  onSave(): void {
    if (!this.data?.user?.hasOwnProperty('codUsuario')) {
      this.agregar();
    } else {
      this.editar();
    }
  }

  cancelar(): void {
    this.dialogRef.close();
  }

  private pathFormData(): void {
    this.userForm.baseForm.patchValue({
      codEmpl: this.data?.user?.codEmpl,
      apeEmpl: this.data?.user?.apeEmpl,
      nomEmpl: this.data?.user?.nomEmpl,
      boxMail: this.data?.user?.boxMail,
      tipoUsuario: this.data?.user?.tipoUsuario,
    });
  }

  agregar(): any {
    const formValue = this.userForm.baseForm.getRawValue();
    const user: any = {};
    user.codEmpl = +formValue.codEmpl;
    user.apeEmpl = formValue.apeEmpl
    user.nomEmpl = formValue.nomEmpl;
    user.boxMail = formValue.boxMail;
    user.tipoUsuario = formValue.tipoUsuario;
    this.data.user = user;
  }

  editar(): any {
    const formValue = this.userForm.baseForm.getRawValue();
    const userId = this.data?.user?.codUsuario;
    const user: any = {};
    user.codUsuario = userId;
    user.codEmpl = +formValue.codEmpl;
    user.apeEmpl = formValue.apeEmpl
    user.nomEmpl = formValue.nomEmpl;
    user.boxMail = formValue.boxMail;
    user.tipoUsuario = formValue.tipoUsuario;
    this.data.user = user;
  }

  goBandeja(): void {
    this.dialogRef.close();
    this.router.navigate([`${PATH_URL_DATA.urlVacaciones}/${PATH_URL_DATA.urlBandejaVacaciones}`]);
  }

  OnReemplazoSelected(value: any) {
    if (value) {
      return value.nombres;
    }
  }

}
