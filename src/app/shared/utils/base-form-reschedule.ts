import { AbstractControl, FormArray, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BaseFormReschedule {
  private isValidEmail = /\S+@\S+\.\S+/;
  private isValidInput = /^[-a-zA-Z0-9.]+$/;
  private isValidNumber = /^[0-9]+$/;
  errorMessage = null;

  constructor(private fb: FormBuilder) { }

  baseForm = this.fb.group({
    identificacion: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    nombres: ['', [Validators.minLength(1), Validators.maxLength(100)]],
    codRegistro: ['', [Validators.required]],
    codRegistroReprogramacion: ['', [Validators.required]],
    codSolicitud: ['', [Validators.required]],
    codigoSolicitudReprogramacion: ['', [Validators.required]],
    codEmplReemplazoReprogramacion: ['', [Validators.required]],
    codEmplAprobacionReprogramacion: ['', [Validators.required]],
    fechaInicioReprogramacion: ['', []],
    fechaInicio: ['', []],
    fechaFinReprogramacion: ['', [Validators.required]],
    fechaFin: ['', [Validators.required]],
    diasReprogramacion: [1, [Validators.required]],
    dias: ['', [Validators.required]],
    diaMedioReprogramacion: ['', []],

  }, { validators: validateScore });


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

export function validateScore(
  control: AbstractControl
): ValidationErrors | null {
  if (control && control.get('dias') && control.get('maxDias')) {
    const highscore = control.get('maxDias')?.value;
    const lowscore = control.get('dias')?.value;
    return (Number(lowscore) > Number(highscore)) ? { scoreError: true } : null;
  }
  return null;
}