export interface IBandejaResponse {
    nombres: string;
    saldo: number;
    fechaVencimiento: string;
    esJefe: number;
    email: string;
    cantidaPorAprobar: number;
    solicitudesVacacionales: ISolicitud[];
}

export interface ISolicitud {
    codRegistro: number;
    codSolicitud: string;
    fechaRegistro: string;
    codTipoGoce: number;
    descTipoGoce: string;
    fechaInicio: string;
    fechaFin: string;
    dias: number;
    codEstado: number;
    desEstado: string;
    codEmpl: number;
    codEmplAprobacion: number;
    saldo: number;
    fechaVencimiento: string;
}

export interface IBandejaRequest {
    identificacion: string;
}

export interface IPlazosBody {
    codSaldo: number;
}

export interface IPlazosResponse {
    codSaldo: number;
    descPeriodo: string;
    saldo: string;
    fecVencimiento: string;
}