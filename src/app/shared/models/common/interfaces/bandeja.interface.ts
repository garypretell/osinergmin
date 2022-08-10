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
    dias: string;
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

export interface IDatosRegistroBody {
    identificacion: string;
    nombres: string;
}

export interface IDatosRegistroBody {
    identificacion: string;
    nombres: string;
}

export interface IDetalleVacacionalBody {
    identificacion: string;
    nombres: string;
    codRegistro: number;
    codSolicitud?: any;
    motivo?: string;
}

export interface IRegistroVacaionalBody {
    identificacion: string;
    nombres: string;
    codRegistro: number;
    codigoSolicitud: string;
    codEmplReemplazo: string;
    codEmplAprobacion: string;
    fechaInicio: string;
    fechaFin: string;
    dias: string;
    diaMedio: string;
}

export interface IInterrupcionVacacionalBody {
    identificacion: string;
    nombres: string;
    codRegistro: string;
    codRegistroInterruptida: string;
    codigoSolicitudInterruptida: string;
    codEmplReemplazoInterruptida: string;
    codEmplAprobacionInterruptida: string;
    fechaInicioReprogramacion: string;
    fechaInterruptida: string;
    diasInterruptidas: string;
    diaMedioInterruptida: string;
    dias: any;
}

export interface IDatosRegistroResponse {
    identificacion: number;
    nombres: string;
    codRegistro: number;
    codigoSolicitud: string;
    listaEmpleadosReemplazo: IEmpleadosReemplazo[];
    listaEmpleadoAprobacion: IEmpleadoAprobacion[];
}

export interface IDetalleRegistroResponse {
    identificacion: number;
    nombres: string;
    registroVacional: IRegistroVacacional;
    listaEmpleadosReemplazo: IEmpleadosReemplazo[];
    listaEmpleadoAprobacion: IEmpleadoAprobacion[];
}

export interface IRegistroVacacional {
    codRegistro: number;
    codSolicitud: string;
    fechaRegistro: number;
    fechaModificacion: string;
    codTipoGoce: number;
    descTipoGoce: string;
    fechaInicio: string;
    fechaFin: string;
    dias: any;
    codEstado: 1,
    desEstado: string,
    codEmpl: number,
    codEmplReemplazo: number,
    codEmplAprobacion: number,
    saldo: number,
    fechaVencimiento: string,
    codSaldo: number
}

export interface IEmpleadosReemplazo {
    identificacion: number;
    nombres: string;
}

export interface IEmpleadoAprobacion {
    identificacion: number;
    nombres: string;
}

export interface IPlazosResponse {
    codSaldo: number;
    descPeriodo: string;
    saldo: string;
    fecVencimiento: string;
}