import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AdminService } from './admin.service';
import { Profile } from '../models';
import { map } from 'rxjs/operators';
import { dashCaseToCamelCase } from '@angular/animations/browser/src/util';

@Injectable()
export class ProfilesService {
  constructor(
    private adminService: AdminService
  ) { }

  get(): Observable<Profile> {
    return this.adminService.get('api/Account/users/me');
  }

  follow(username: string): Observable<Profile> {
    return this.adminService.post('/profiles/' + username + '/follow');
  }

  unfollow(username: string): Observable<Profile> {
    return this.adminService.delete('/profiles/' + username + '/follow');
  }

}
