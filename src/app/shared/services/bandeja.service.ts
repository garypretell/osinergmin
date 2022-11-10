import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBandejaRequest, IBandejaResponse, IDatosRegistroBody, IDatosRegistroResponse, IDetalleRegistroResponse, IDetalleVacacionalBody, IInterrupcionVacacionalBody, IPlazosBody, IFiltrosReporte, IRegistroVacaionalBody, IFiltrosReporteSolicitudes, ITrazaBody, IDeleteUserBody, IEliminarVacacionalBody } from '@shared/models/common/interfaces/bandeja.interface';
import { BandejaEndpoint } from '@shared/providers/bandeja.endpoint';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class BandejaService {

  constructor(private readonly apiService: ApiService, private http: HttpClient) { }

  /**
   * Obtener Bandeja
   */
  getBandeja(
    params: IBandejaRequest
  ): Observable<IBandejaResponse> {
    return this.apiService.get(BandejaEndpoint.GetBandeja, { params, default: [] });
  }

  /**
   * Actualizar Saldo
   */
  getActualizar(): Observable<any> {
    return this.apiService.get(BandejaEndpoint.GetActualizar, { default: [] });
  }

  /**
   * Obtener Plazos Vacacionales
   */
  getPlazos(body: IPlazosBody): Observable<any> {
    return this.apiService.post(BandejaEndpoint.PostDeadlines, body);
  }

  /**
   * Obtener Filtros para Cabecera
   */
  getCabeceraFiltros(): Observable<any> {
    return this.apiService.post(BandejaEndpoint.PostCabeceraFiltros, {});
  }

  /**
   * Obtener Filtros Solicitudes para Cabecera
   */
  getCabeceraFiltrosSolicitudes(): Observable<any> {
    return this.apiService.post(BandejaEndpoint.PostCabeceraFiltrosSolicitudes, {});
  }

  /**
   * Obtener Datos Registro
   */
  getDatosRegistros(body: IDatosRegistroBody): Observable<IDatosRegistroResponse> {
    return this.apiService.post(BandejaEndpoint.PostDatosRegistro, body);
  }

  /**
   * Registrar Vacacional
   */
  postRegistro(body: IRegistroVacaionalBody): Observable<any> {
    return this.apiService.post(BandejaEndpoint.PostRegistroVacacional, body);
  }

  /**
   * Ver Detalle
   */
  postDetalle(body: IDetalleVacacionalBody): Observable<IDetalleRegistroResponse> {
    return this.apiService.post(BandejaEndpoint.PostDetalle, body);
  }

  /**
   * Ver Detalle
   */
  postActualizar(body: IRegistroVacaionalBody): Observable<any> {
    return this.apiService.post(BandejaEndpoint.PostActualizar, body);
  }

  /**
   * Anular
   */
  postAnular(body: IDetalleVacacionalBody): Observable<IDetalleRegistroResponse> {
    return this.apiService.post(BandejaEndpoint.PostAnular, body);
  }

  /**
   * Eliminar
   */
  postEliminar(body: IEliminarVacacionalBody): Observable<any> {
    return this.apiService.post(BandejaEndpoint.PostEliminar, body);
  }

  /**
   * Recuperar
   */
  postRecuperar(body: IDetalleVacacionalBody): Observable<IDetalleRegistroResponse> {
    return this.apiService.post(BandejaEndpoint.PostRecuperar, body);
  }

  /**
   * Enviar Jefe
   */
  postEnviarJefe(body: IDetalleVacacionalBody): Observable<IDetalleRegistroResponse> {
    return this.apiService.post(BandejaEndpoint.PostEnviarJefe, body);
  }

  /**
   * Get Reprogramacion
   */
  getReprogramacion(body: IDetalleVacacionalBody): Observable<any> {
    return this.apiService.post(BandejaEndpoint.GetReprogramar, body);
  }

  /**
   * Registrar Reprogramacion
   */
  postReprogramacion(body: IDetalleVacacionalBody): Observable<any> {
    return this.apiService.post(BandejaEndpoint.PostReprogramar, body);
  }

  /**
   * Registrar Interrupcion
   */
  postInterrupcion(body: IInterrupcionVacacionalBody): Observable<any> {
    return this.apiService.post(BandejaEndpoint.PostInterrupcion, body);
  }

  /**
   * Obtener Lista de Solicitudes de Jefe Inmediato
   */
  getListaSolicitudJefe(body: IBandejaRequest): Observable<any> {
    return this.apiService.post(BandejaEndpoint.GetListaSolicitudJefe, body);
  }

  /**
   * Obtener Lista de Solicitudes de Jefe Inmediato
   */
  getListaSolicitudGrh(body: IBandejaRequest): Observable<any> {
    return this.apiService.post(BandejaEndpoint.GetListaSolicitudGrh, body);
  }

  /**
   * Aprobar Solicitudes de Jefe Inmediato
   */
  postAprobar(body: IDetalleVacacionalBody): Observable<any> {
    return this.apiService.post(BandejaEndpoint.PostAprobar, body);
  }

  /**
   * Rechazar Solicitudes de Jefe Inmediato
   */
  postRechazar(body: IDetalleVacacionalBody): Observable<any> {
    return this.apiService.post(BandejaEndpoint.PostRechazar, body);
  }

  /**
   * Aprobar Solicitudes de Jefe Inmediato
   */
  postAprobarGrh(body: IDetalleVacacionalBody): Observable<any> {
    return this.apiService.post(BandejaEndpoint.PostAprobarGrh, body);
  }

  /**
   * Rechazar Solicitudes de Jefe Inmediato
   */
  postRechazarGrh(body: IDetalleVacacionalBody): Observable<any> {
    return this.apiService.post(BandejaEndpoint.PostRechazarGrh, body);
  }

  /**
   * Descargar Excel
   */
  retrieveExcelReport(body: any, params: any): Observable<any> {
    return this.apiService.postDownload(BandejaEndpoint.RetrieveExcelReport, body, {
      params,
      responseType: 'arraybuffer' as 'json',
      observe: 'response' as 'body'
    });
  }

  retrieveExcelReport3(body: any, params: any): Observable<any> {
    return this.apiService.postDownload(BandejaEndpoint.RetrieveExcelReport3, body, {
      params,
      responseType: 'arraybuffer' as 'json',
      observe: 'response' as 'body'
    });
  }

  /**
   * Descargar Excel
   */
  retrieveExcelReport2(body: any, params: any): Observable<any> {
    return this.apiService.postDownload(BandejaEndpoint.RetrieveExcelReport2, body, {
      params,
      responseType: 'arraybuffer' as 'json',
      observe: 'response' as 'body'
    });
  }

  /**
   * Obtener Lista Reporte
   */
  getListaReporte(): Observable<any> {
    return this.apiService.post(BandejaEndpoint.GetListaReporte, {});
  }

  /**
   * Obtener Datos por Filtro
   */
  postFiltroReporte(body: IFiltrosReporte): Observable<any> {
    return this.apiService.post(BandejaEndpoint.PostFiltrosReporte, body);
  }
  /**
   * Obtener Datos por Filtro
   */
  postFiltroReporteHistorico(body: IFiltrosReporte): Observable<any> {
    return this.apiService.post(BandejaEndpoint.PostFiltrosReporteHistorico, body);
  }

  /**
   * Obtener Datos por Filtro
   */
  postFiltroReporteSolicitudes(body: IFiltrosReporteSolicitudes): Observable<any> {
    return this.apiService.post(BandejaEndpoint.PostFiltrosReporteSolicitudes, body);
  }

  /**
   * Obtener Lista Traza
   */
  getListaTraza(body: ITrazaBody): Observable<any> {
    return this.apiService.post(BandejaEndpoint.PostListaTraza, body);
  }

  /**
   * Obtener Lista Usuarios
   */
  getListaUsuario(): Observable<any> {
    return this.apiService.post(BandejaEndpoint.PostListaUsuarios, {});
  }

  /**
   * Inactivar Usuario
   */
  deleteUsuario(body: IDeleteUserBody): Observable<any> {
    return this.apiService.post(BandejaEndpoint.PostInactivarUsuario, body);
  }

  /**
   * Activar Usuario
   */
  activeUsuario(body: IDeleteUserBody): Observable<any> {
    return this.apiService.post(BandejaEndpoint.PostActivarUsuario, body);
  }

  /**
   * Crear Usuario
   */
  crearUsuario(body: any): Observable<any> {
    return this.apiService.post(BandejaEndpoint.PostCrearUsuario, body);
  }

  /**
   * Actualizar Usuario
   */
  actualizarUsuario(body: any): Observable<any> {
    return this.apiService.post(BandejaEndpoint.PostActualizarUsuario, body);
  }

  /**
   * Cargar Archivo
   */
  cargarArchivo(body: FormData): Observable<any> {
    return this.apiService.post(BandejaEndpoint.PostCargarArchivo, body);
  }

}