import { AbstractControl, FormArray, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BaseFormInterruption {
  private isValidEmail = /\S+@\S+\.\S+/;
  private isValidInput = /^[-a-zA-Z0-9.]+$/;
  private isValidNumber = /^[0-9]+$/;
  errorMessage = null;

  constructor(private fb: FormBuilder) { }

  baseForm = this.fb.group({
    identificacion: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    nombres: ['', [Validators.minLength(1), Validators.maxLength(100)]],
    codRegistro: ['', [Validators.required]],
    codSolicitud: ['', [Validators.required]],
    codRegistroInterruptida: ['', [Validators.required]],
    codigoSolicitudInterruptida: ['', [Validators.required]],
    codEmplReemplazoInterruptida: ['', [Validators.required]],
    codEmplAprobacionInterruptida: ['', [Validators.required]],
    fechaInicio: ['', []],
    fechaInterruptida: ['', [Validators.required]],
    fechaFin: [''],
    diasInterruptidas: [0, [Validators.required]],
    dias: [0, [Validators.required, Validators.min(0.5)]],
    diaMedioInterruptida: ['', []]
  });


  errors(ctrl: AbstractControl): string[] {
    return ctrl.errors ? Object.keys(ctrl.errors) : [];
  }

  handleError(error: any, field: string): void {
    const { errors }  = this.baseForm.get(field) as FormArray;
    const minlenght = errors?.['minlength']?.requiredLength;
    const maxlenght = errors?.['maxlength']?.requiredLength;
    const min = errors?.['min']?.min;
    const messages: any = {
      required: 'Campo requerido.',
      minlength: `Este campo debe ser mayor a ${minlenght} caracteres`,
      maxlength: `Este campo debe ser menor a ${maxlenght} caracteres`,
      min: `Días mínimos a solicitar: ${min} `,
      email: 'Ingrese correo válido.',
      pattern: field === 'correoElectronico' ? 'Ingrese correo válido.' : 'Existen caracteres no válidos'
    };
    return messages[error];
  }
}