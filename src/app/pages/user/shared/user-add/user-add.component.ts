import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BandejaService } from '@shared/services/bandeja.service';
import { BaseFormUser } from '@shared/utils/base-form-user';

enum Action {
  EDIT = 'edit',
  NEW = 'new',
}

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css']
})
export class UserAddComponent implements OnInit {

  ocultar = false;
  tipoLista: any[] = [];
  actionTODO = Action.NEW;
  constructor(
    private bandejaService: BandejaService,
    public dialogRef: MatDialogRef<UserAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public userForm: BaseFormUser,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    if (this.data?.user.hasOwnProperty('codUsuario')) {
      this.actionTODO = Action.EDIT;
      this.ocultar = true;
      this.userForm.baseForm.updateValueAndValidity();
      this.pathFormData();
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
    const formValue = this.userForm.baseForm.value;
    const user: any = {};
    user.codEmpl = +formValue.codEmpl;
    user.apeEmpl = formValue.apeEmpl
    user.nomEmpl = formValue.nomEmpl;
    user.boxMail = formValue.boxMail;
    user.tipoUsuario = formValue.tipoUsuario;
    this.data.user = user;
  }

  editar(): any {
    const formValue = this.userForm.baseForm.value;
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

}
