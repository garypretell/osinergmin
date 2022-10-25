import { environment } from '@environments/environment';

export class BandejaEndpoint {
  public static GetBandeja = `${environment.urlService}api/vacaciones/bandeja/obtenerDatosBandejaUrl?identificacion={identificacion}`;
  public static PostDeadlines = `${environment.urlService}api/vacaciones/bandeja/listarPlazosVacacionales`;
  public static PostDatosRegistro = `${environment.urlService}api/vacaciones/bandeja/obtenerDatosRegistroVacacional`;
  public static PostRegistroVacacional = `${environment.urlService}api/vacaciones/bandeja/registrarVacacional`;
  public static PostDetalle = `${environment.urlService}api/vacaciones/bandeja/verRegistroVacacional`;
  public static PostActualizar = `${environment.urlService}api/vacaciones/bandeja/editarRegistroVacacional`;
  public static PostAnular = `${environment.urlService}api/vacaciones/bandeja/anularRegistroVacacional`;
  public static PostRecuperar = `${environment.urlService}api/vacaciones/bandeja/recuperarJefeRegistroVacacional`;
  public static PostEnviarJefe = `${environment.urlService}api/vacaciones/bandeja/enviarJefeRegistroVacacional`;
  public static GetReprogramar = `${environment.urlService}api/vacaciones/bandeja/obtenerDatosReprogramacionVacacional`;
  public static PostReprogramar = `${environment.urlService}api/vacaciones/bandeja/registrarReprogramacionVacacional`;
  public static PostInterrupcion = `${environment.urlService}api/vacaciones/bandeja/registrarInterrupcionnVacacional`;
  public static GetListaSolicitudJefe = `${environment.urlService}api/vacaciones/bandeja/listarSolicitudesJefeInmediato`;
  public static GetListaReporte = `${environment.urlService}api/vacaciones/bandeja/listaReporte`;
  public static GetListaSolicitudGrh = `${environment.urlService}api/vacaciones/bandeja/listarSolicitudesGrh`;
  public static PostAprobar = `${environment.urlService}api/vacaciones/bandeja/aprobarJefeRegistroVacacional`;
  public static PostRechazar = `${environment.urlService}api/vacaciones/bandeja/rechazarJefeRegistroVacacional`;
  public static PostAprobarGrh = `${environment.urlService}api/vacaciones/bandeja/aprobarGrhRegistroVacacional`;
  public static PostRechazarGrh = `${environment.urlService}api/vacaciones/bandeja/rechazarGrhRegistroVacacional`;
  public static RetrieveExcelReport = `${environment.urlService}api/vacaciones/bandeja/retrieveExcelReport`;
  public static PostCabeceraFiltros = `${environment.urlService}api/vacaciones/bandeja/cargaFiltrosReporte`;
  public static PostCabeceraFiltrosSolicitudes = `${environment.urlService}api/vacaciones/bandeja/cargaFiltrosReporteSolicitudes`;
  public static PostFiltrosReporte = `${environment.urlService}api/vacaciones/bandeja/buscarFiltrosReporte`;
  public static PostFiltrosReporteSolicitudes = `${environment.urlService}api/vacaciones/bandeja/buscarFiltrosReporteSolicitudes`;
  public static PostListaTraza= `${environment.urlService}api/vacaciones/bandeja/listaReporteTraza`;
  public static PostListaUsuarios= `${environment.urlService}api/vacaciones/bandeja/listarUsuarios`;
  public static PostInactivarUsuario= `${environment.urlService}api/vacaciones/bandeja/inactivarUsuario`;
  public static PostActivarUsuario= `${environment.urlService}api/vacaciones/bandeja/activarUsuario`;
  public static PostCrearUsuario= `${environment.urlService}api/vacaciones/bandeja/registrarUsuario`;
  public static PostActualizarUsuario= `${environment.urlService}api/vacaciones/bandeja/editarUsuario`;
}
