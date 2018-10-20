import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, ReplaySubject } from 'rxjs';
import { AuthService } from './auth.service';
import { ApiService } from './api.service';
import { AdminService } from './admin.service';
import { JwtService } from './jwt.service';
import { User } from '../models';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { TaiKhoan, NguoiDung } from '../models';

@Injectable()
export class UserService {
  private currentUserSubject = new BehaviorSubject<User>({} as User);
  public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor(
    private adminService: AdminService,
    private apiService: ApiService,
    private authService: AuthService,
    private http: HttpClient,
    private jwtService: JwtService
  ) { }

  // Verify JWT in localstorage with server & load user's info.
  // This runs once on application startup.
  populate() {
    // If JWT detected, attempt to get & store user's info
    if (this.jwtService.getToken()) {
      this.apiService.get('api/Account/users/me')
        .subscribe(
          data => {
            this.currentUserSubject.next(data);
            this.isAuthenticatedSubject.next(true);
            // this.setAuth(data);
            // console.log(data);
          },
          err => {
            // console.log(err);

            this.purgeAuth();
          }
        );
    } else {
      // Remove any potential remnants of previous auth states
      this.purgeAuth();
    }
  }

  setAuth(user: User) {
    // Save JWT sent from server in localstorage
    this.jwtService.saveToken(user.access_token);
    // Set current user data into observable
    this.currentUserSubject.next(user);
    // Set isAuthenticated to true
    this.isAuthenticatedSubject.next(true);
  }

  purgeAuth() {
    // Remove JWT from localstorage
    this.jwtService.destroyToken();
    // Set current user to an empty object
    this.currentUserSubject.next({} as User);
    // Set auth status to false
    this.isAuthenticatedSubject.next(false);
  }



  attemptAuth(type, credentials): Observable<TaiKhoan> {
    // const route = (type === 'login') ? '/login' : '';
    // return this.apiService.post('/users' + route, {user: credentials})
    return this.authService.login(credentials.userName, credentials.password)
      .pipe(map(
        data => {
          this.setAuth(data);
          return data;
        }
      ));
  }

  getCurrentUser(): User {
    return this.currentUserSubject.value;
  }

  // Update the user on the server (email, pass, etc)
  update(user): Observable<User> {
    return this.apiService
      .put('', { user })
      .pipe(map(data => {
        // Update the currentUser observable
        this.currentUserSubject.next(data.user);
        return data.user;
      }));
  }
  // get list User
  getAllUser() {
    return this.adminService.get('api/Admin/GetUsers');
  }
  getRoles() {
    return this.adminService.get('api/Admin/GetRoles');
  }
  createUser(user: NguoiDung) {
    return this.adminService.post('api/Admin/CreateUser', user);
  }
  getUserByUserName(userName: string) {
    return this.adminService.get('api/Admin/GetUser?userName=' + userName);
  }
  updateUser(user: NguoiDung) {
    return this.adminService.post('api/Admin/UpdateUser', user);
  }
  deleteUserByUserName(userName: string) {
    return this.adminService.delete('api/Admin/RemoveUser?username=' + userName);
  }
  // ---> Only adminstrator
  updateInfor(user: NguoiDung) {
    return this.adminService.post('api/Account/users/update', user);
  }
}
