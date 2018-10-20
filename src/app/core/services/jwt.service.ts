import { Injectable } from '@angular/core';
import * as jwt_decode from 'jwt-decode';
import { User } from '../models';

@Injectable()
export class JwtService {

  getToken(): String {
    return window.localStorage['jwtToken'];
  }

  saveToken(token: String) {
    window.localStorage['jwtToken'] = token;
  }

  destroyToken() {
    console.log('destroy token');

    window.localStorage.removeItem('jwtToken');
  }
  getDecodedAccessToken(token: String): User {
    if (token) {
      return jwt_decode(token);
    }
  }
}
