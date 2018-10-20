import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Errors, UserService } from '../core';
import { TaiKhoan } from '../core/models/taiKhoan.model';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit {
  authType: String = '';
  title: String = '';
  errors: Errors = { errors: {} };
  isSubmitting = false;
  authForm: FormGroup;
  credentials = new TaiKhoan();
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    // use FormBuilder to create a form group
    this.authForm = this.fb.group({
      'username': ['', Validators.required],
      'password': ['', Validators.required]
    });
  }

  ngOnInit() {
    this.route.url.subscribe(data => {
      // Get the last piece of the URL (it's either 'login' or 'register')
      this.authType = data[data.length - 1].path;
      // Set a title for the page accordingly
      this.title = (this.authType === 'login') ? 'Sign in' : 'Sign up';
      // add form control for username if this is the register page
      if (this.authType === 'register') {
        this.authForm.addControl('email', new FormControl());
      }
    });
  }

  submitForm(event) {
    this.isSubmitting = true;
    this.errors = { errors: {} };
    event.preventDefault();
    const target = event.target;
    this.credentials.userName = target.querySelector('#userName').value;
    this.credentials.password = target.querySelector('#password').value;
    this.credentials.grant_type = 'password';
    this.credentials.client_id = 'webAdminApp';
    console.log(this.credentials);
    this.userService
      .attemptAuth(this.authType, this.credentials)
      .subscribe(
        data => this.router.navigateByUrl('/'),
        err => {
          this.errors = err;
          this.isSubmitting = false;
        }
      );
  }
}
