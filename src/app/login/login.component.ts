import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../router.animations';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { TaiKhoan } from '../core/models/taiKhoan.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../core';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit {
    authType: String = 'login';
    authForm: FormGroup;
    credentials = new TaiKhoan();
    constructor(public router: Router,
        private route: ActivatedRoute,
        private userService: UserService,
        private spinner: NgxSpinnerService,
        private fb: FormBuilder) {
        this.authForm = this.fb.group({
            'userName': ['', Validators.required],
            'password': ['', Validators.required]
        });
    }

    ngOnInit() {
    }
    submitForm(event) {
        this.spinner.show();
        event.preventDefault();
        const target = event.target;
        this.credentials.userName = target.querySelector('#userName').value;
        this.credentials.password = target.querySelector('#password').value;
        this.credentials.grant_type = 'password';
        this.credentials.client_id = 'webAdminApp';
        this.userService
            .attemptAuth(this.authType, this.credentials)
            .subscribe(
                data => {
                    this.spinner.hide();
                    this.router.navigateByUrl('/');
                },

                err => {
                    this.spinner.hide();
                    swal(err.error_description);
                });
    }
}
