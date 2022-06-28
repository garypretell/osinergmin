import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUserBody, IUserRequest } from '@shared/models/common/interfaces/user.interface';
import { UserEndpoint } from '@shared/providers/user.endpoint';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({providedIn: 'root'})
export class UserService {

  constructor(private readonly apiService: ApiService, private http: HttpClient) {}

  /**
   * Obtener Usuario
   */
   getUser(
    body: IUserBody
  ): Observable<any> {
    return this.apiService.post(UserEndpoint.GetUser, body);
  }

}