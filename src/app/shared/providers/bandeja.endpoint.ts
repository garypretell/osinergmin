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
  public static GetListaSolicitudGrh = `${environment.urlService}api/vacaciones/bandeja/listarSolicitudesGrh`;
  public static PostAprobar = `${environment.urlService}api/vacaciones/bandeja/aprobarJefeRegistroVacacional`;
  public static PostRechazar = `${environment.urlService}api/vacaciones/bandeja/rechazarJefeRegistroVacacional`;
  public static PostAprobarGrh = `${environment.urlService}api/vacaciones/bandeja/aprobarGrhRegistroVacacional`;
  public static PostRechazarGrh = `${environment.urlService}api/vacaciones/bandeja/rechazarGrhRegistroVacacional`;
}
