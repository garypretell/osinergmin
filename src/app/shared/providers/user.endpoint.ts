import { environment } from '@environments/environment';

export class UserEndpoint {
  public static GetUser = `${environment.urlService}api/vacaciones/bandeja/obtenerDatosEmpleado`;
}
