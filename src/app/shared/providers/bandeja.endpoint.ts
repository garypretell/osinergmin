import { environment } from '@environments/environment';

export class BandejaEndpoint {
  public static GetBandeja = `${environment.urlService}api/vacaciones/bandeja/obtenerDatosBandejaUrl?identificacion={identificacion}`;
  public static PostDeadlines = `${environment.urlService}api/vacaciones/bandeja/listarPlazosVacacionales`;
}
