import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService, NguoiDung, Role, Errors } from '../../core';
import { SearchSettingsModel, PageSettingsModel, EditSettingsModel } from '@syncfusion/ej2-ng-grids';
import { GridComponent, RowSelectEventArgs } from '@syncfusion/ej2-ng-grids';
import { routerTransition } from '../../router.animations';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert';

@Component({
    selector: 'app-usermanagement',
    templateUrl: './userManagement.component.html',
    styleUrls: ['./userManagement.component.css'],
    encapsulation: ViewEncapsulation.None,
    animations: [routerTransition()]
})
export class UserManagementComponent implements OnInit {
    @ViewChild('element') element;
    errors: Errors = { errors: {} };
    public listUser: any;
    public sortOptions: Object;
    public listRole: any; // get all role
    public roleTemp: Array<Role> = []; // role temp when chosse change
    public rolesUser: Array<Role> = []; // role user need edit
    public rolesUserNew: Array<Role> = [];    // role user when you edit
    public nguoiDung = new NguoiDung();
    public nguoiDungtemp: Array<NguoiDung> = [];
    public formUser: FormGroup;
    public userName: string;
    closeResult: string;
    public errString: string;

    @ViewChild('grid')
    public grid: GridComponent;
    public editSettings: EditSettingsModel;
    public searchOptions: SearchSettingsModel;
    public initialPage: PageSettingsModel;
    toolbar: (string | { text: string; id: string; prefixIcon: string; })[];
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private spinner: NgxSpinnerService,
        private userService: UserService,
        private modalService: NgbModal,
        private _fromBuilder: FormBuilder,
    ) { }

    ngOnInit(): void {
        this.spinner.show();
        this.createForm();
        this.userService.getRoles().subscribe(
            (data: Role) => {
                this.listRole = data;
            },
            err => {
                this.errors = err;
            }
        );
        this.initialPage = { pageSize: 10 };
        this.searchOptions = {
            fields: ['userName', 'displayName', 'phoneNumber', 'email'],
            operator: 'contains', key: '', ignoreCase: true
        };
        this.toolbar = ['Search', {
            text: 'Thêm mới', id: 'addUser', prefixIcon: 'e-icons e-add'
        }];

        // get  list user
        this.userService.getAllUser()
            .subscribe(
                (data: NguoiDung) => {
                    this.listUser = data;
                    this.spinner.hide();
                },
                err => {
                    this.errors = err;
                }
            );

    }
    // create form
    createForm() {
        this.formUser = this._fromBuilder.group({
            userName: ['', [
                Validators.required,
            ]],
            email: ['',
                [
                    Validators.required,
                    Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')
                ]],
            password: ['', Validators.minLength(8)],
            confirmPassword: [''],
            displayName: [''],
            phoneNumber: [''],
            roles: this._fromBuilder.group({
                name: '',
                displayName: ''
            })
        });
    }
    // open modal
    open(content, event) {
        this.createForm();
        if (event.item.id === 'addUser') {
            this.modalService.open(content, { size: 'lg' }).result.then((result) => {
                this.closeResult = `Closed with: ${result}`;

            }, (reason) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            });
        }
    }
    open2(content) {
        this.createForm();
        this.modalService.open(content, { size: 'lg' }).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }
    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }
    submitAdd() {
        this.errString = '';
        this.formUser.value.roles = this.roleTemp;
        this.userService.createUser(this.formUser.value)
            .subscribe(
                data => {
                    swal('Đã thêm!', 'Thêm thành công', 'success')
                        .then(xl => {
                            this.modalService.dismissAll();
                            this.ngOnInit();
                        });
                },
                err => {
                    this.errors = err;
                    for (let i = 0; i < err.modelState[''].length; i++) {
                        this.errString += err.modelState[''][i] + '\r\n';
                    }
                    swal('Lỗi!', this.errString, 'error');
                });
    }
    // xử lý check roles when add user
    chooseRoles(event) {
        if (event.target.checked) {
            this.roleTemp.push(event.target.value);
        } else {
            this.roleTemp = this.roleTemp.filter(item => item !== event.target.value);
        }
        return this.roleTemp;
    }
    // select object into gird
    rowSelected(args: RowSelectEventArgs) {
        this.nguoiDungtemp = <NguoiDung[]>this.grid.getSelectedRecords();
        // tslint:disable-next-line:forin
        for (const i of this.nguoiDungtemp) {
            this.userName = this.nguoiDungtemp[0].userName;
            this.userService.getUserByUserName(this.userName)
                .subscribe(
                    (data: NguoiDung) => {
                        this.nguoiDung = data;
                        this.rolesUser = this.nguoiDung.roles;
                        this.getRoles();
                    },
                    err => {
                        this.errors = err;
                    }
                );
        }
    }
    // get role user edit
    getRoles() {
        this.userService.getRoles().subscribe(
            data => {
                this.listRole = data;
                for (let i = 0; i < this.rolesUser.length; i++) {
                    for (let j = 0; j < this.listRole.length; j++) {
                        if (this.rolesUser[i] === this.listRole[j].name) {
                            this.listRole[j].isChecked = true;
                            if (this.rolesUserNew.indexOf(this.listRole[j].name) < 0) {
                                this.rolesUserNew.push(this.listRole[j].name);
                            }
                        }
                    }
                }
            },
            err => {
                this.errors = err;
            }
        );
    }
    // change role form edit
    chageRole(event) {
        if (event.target.checked) {
            if (this.rolesUserNew.indexOf(event.target.value) < 0) {
                this.rolesUserNew.push(event.target.value);
            }
        } else {
            this.rolesUserNew = this.rolesUserNew.filter(item => item !== event.target.value);
        }
        return this.nguoiDung.roles = this.rolesUserNew;
    }
    // xl edit
    submitEdit(event) {
        this.nguoiDung.userName = event.target.userName.value;
        this.nguoiDung.email = event.target.email.value;
        this.nguoiDung.displayName = event.target.displayName.value;
        this.nguoiDung.phoneNumber = event.target.phoneNumber.value;
        this.userService.updateUser(this.nguoiDung)
            .subscribe(
                data => {
                    swal('Đã cập nhật!', 'Cập nhật thành công', 'success')
                        .then(xl => {
                            this.modalService.dismissAll();
                            this.ngOnInit();
                        });

                },
                err => {
                    this.errors = err;
                    swal('Lỗi!', 'Cập nhật thất bại', 'error');
                });
    }
    // xử lý xóa
    submitXoa() {
        swal({
            title: 'Xóa tài khoản người dùng',
            text: 'Bạn có chắc muốn xóa tài khoản ' + this.userName,
            icon: 'warning',
            dangerMode: true,
        })
            .then(willDelete => {
                if (willDelete) {
                    this.userService.deleteUserByUserName(this.userName)
                        .subscribe(
                            data => {
                                swal('Đã xóa!', 'Xóa thành công', 'success')
                                    .then(
                                        xl => {
                                            this.modalService.dismissAll();
                                            this.ngOnInit();
                                        }
                                    );
                            },
                            err => {
                                this.errors = err;
                                swal('Lỗi!', 'Xóa thất bại !', 'error');
                            });
                }
            });
    }
}
