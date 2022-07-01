import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBandejaRequest, IBandejaResponse, IPlazosBody, IPlazosResponse } from '@shared/models/common/interfaces/bandeja.interface';
import { BandejaEndpoint } from '@shared/providers/bandeja.endpoint';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({providedIn: 'root'})
export class BandejaService {

  constructor(private readonly apiService: ApiService, private http: HttpClient) {}

  /**
   * Obtener Bandeja
   */
   getBandeja(
    params: IBandejaRequest
  ): Observable<IBandejaResponse> {
    return this.apiService.get(BandejaEndpoint.GetBandeja, {params, default: []});
  }

  /**
   * Obtener Plazos Vacacionales
   */
   getPlazos(body: IPlazosBody): Observable<any> {
    return this.apiService.post(BandejaEndpoint.PostDeadlines, body);
  }

}