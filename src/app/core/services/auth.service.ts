import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { JwtService } from './jwt.service';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient,
    private jwtService: JwtService) { }

  private formatErrors(error: any) {
    return throwError(error.error);
  }

  login(userName: string, password: string): Observable<any> {
    const formData = 'grant_type=password&client_id=webAdminApp&username='
      + userName + '&password=' + password;
    //  console.log(formData);
    return this.http.post(environment.api_url_QNU + '/oauth2/token', formData,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
      .pipe(catchError(this.formatErrors));
  }
}
