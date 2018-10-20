import { Component, OnInit } from '@angular/core';
import { UserService, NguoiDung, Errors } from '../../core';
import { ActivatedRoute, Router } from '@angular/router';
import { routerTransition } from '../../router.animations';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AdminService } from '../../core/services';
import swal from 'sweetalert';
@Component({
    selector: 'app-profile',
    templateUrl: './Profile.component.html',
    styleUrls: ['./Profile.component.css'],
    animations: [routerTransition()]
})
export class ProfileComponent implements OnInit {
    errors: Errors = { errors: {} };
    public nguoiDung = new NguoiDung();
    public formUser: FormGroup;
    constructor(
        private _fromBuilder: FormBuilder,
        private userService: UserService,
        public activeRoute: ActivatedRoute,
        private router: Router,
        private adminService: AdminService,
    ) { }

    ngOnInit() {
        this.createForm();
        this.adminService.get('/api/Account/users/me')
            .subscribe(data => {
                this.nguoiDung = data;
            },
                err => {
                    this.errors = err;
                });
    }
    createForm() {
        this.formUser = this._fromBuilder.group({
            userName: [''],
            email: [''],
            displayName: [''],
            phoneNumber: [''],
            roles: this._fromBuilder.group({
                name: '',
                displayName: ''
            })
        });
    }
    submitForm(event) {
        this.nguoiDung.userName = event.target.userName.value;
        this.nguoiDung.email = event.target.email.value;
        this.nguoiDung.displayName = event.target.displayName.value;
        this.nguoiDung.phoneNumber = event.target.phoneNumber.value;
        this.userService.updateInfor(this.nguoiDung)
            .subscribe(
                data => {
                    swal('Đã cập nhật!', 'Cập nhật thành công', 'success')
                        .then(xl => {
                            this.router.navigateByUrl('/');
                        });
                },
                err => {
                    this.errors = err;
                    swal('Lỗi!', 'Cập nhật thất bại', 'error');
                });
    }
}
