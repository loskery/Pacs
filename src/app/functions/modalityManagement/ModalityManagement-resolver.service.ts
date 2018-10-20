import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtService } from '../../core/services/jwt.service';

import { TaiKhoan, UserService, ArticlesService } from '../../core';
import { take } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
@Injectable()
export class ModalityManagementResolver implements Resolve<TaiKhoan> {

  constructor(
    private articlesService: ArticlesService,
    private router: Router,
    private userService: UserService,
    private jwtService: JwtService
  ) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    if (this.jwtService.getToken()) {
      return this.userService.isAuthenticated.pipe(take(1));
    } else {
      this.router.navigateByUrl('/login');
      return this.userService.isAuthenticated.pipe(take(0));
    }

  }
}
