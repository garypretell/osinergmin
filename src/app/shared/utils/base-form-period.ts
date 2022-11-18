import { AbstractControl, FormArray, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';
import moment from 'moment';

@Injectable({ providedIn: 'root' })
export class BaseFormPeriod {
  private isValidEmail = /\S+@\S+\.\S+/;
  errorMessage = null;

  constructor(private fb: FormBuilder) { }

  baseForm = this.fb.group({
    descPeriodo: ['', [Validators.required]]
  });


  errors(ctrl: AbstractControl): string[] {
    return ctrl.errors ? Object.keys(ctrl.errors) : [];
  }

  handleError(error: any, field: string): void {
    const { errors }  = this.baseForm.get(field) as FormArray;
    const minlenght = errors?.['minlength']?.requiredLength;
    const maxlenght = errors?.['maxlength']?.requiredLength;
    const messages: any = {
      required: 'Campo requerido.',
      minlength: `Este campo debe ser mayor a ${minlenght} caracteres`,
      maxlength: `Este campo debe ser menor a ${maxlenght} caracteres`,
      email: 'Ingrese correo válido.',
      pattern: field === 'correoElectronico' ? 'Ingrese correo válido.' : 'Existen caracteres no válidos'
    };
    return messages[error];
  }
}
