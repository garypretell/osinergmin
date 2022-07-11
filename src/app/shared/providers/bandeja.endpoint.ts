import { environment } from '@environments/environment';

export class BandejaEndpoint {
  public static GetBandeja = `${environment.urlService}api/vacaciones/bandeja/obtenerDatosBandejaUrl?identificacion={identificacion}`;
  public static PostDeadlines = `${environment.urlService}api/vacaciones/bandeja/listarPlazosVacacionales`;
  public static PostDatosRegistro = `${environment.urlService}api/vacaciones/bandeja/obtenerDatosRegistroVacacional`;
  public static PostRegistroVacacional = `${environment.urlService}api/vacaciones/bandeja/registrarVacacional`;
  public static PostDetalle = `${environment.urlService}api/vacaciones/bandeja/verRegistroVacacional`;
  public static PostActualizar = `${environment.urlService}api/vacaciones/bandeja/editarRegistroVacacional`;
}
