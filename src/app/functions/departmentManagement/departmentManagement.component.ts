import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { DepartmentService, Errors, Department, User, UserService, NguoiDung, UserDepartment } from '../../core';
import { SearchSettingsModel, PageSettingsModel, EditSettingsModel } from '@syncfusion/ej2-ng-grids';
import { GridComponent, RowSelectEventArgs } from '@syncfusion/ej2-ng-grids';
import { routerTransition } from '../../router.animations';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import swal from 'sweetalert';
import { Router } from '@angular/router';


@Component({
    selector: 'app-departmentmanagement',
    templateUrl: './departmentManagement.component.html',
    styleUrls: ['./departmentManagement.component.css'],
    encapsulation: ViewEncapsulation.None,
    animations: [routerTransition()]
})
export class DepartmentManagementComponent implements OnInit {
    @ViewChild('element') element;
    errors: Errors = { errors: {} };
    public listDepartment: any;
    public listUser: Array<User>;
    public sortOptions: Object;
    public department = new Department();
    public departmenttemp: Array<Department> = [];
    public usertemp: Array<NguoiDung> = [];
    public formDepartment: FormGroup;
    public departmentId: number;
    closeResult: string;
    public errString: string;
    public userIdTemp: Array<string> = [];
    public id: any;
    public userDepartment = new UserDepartment();

    @ViewChild('grid')
    public grid: GridComponent;
    public editSettings: EditSettingsModel;
    public searchOptions: SearchSettingsModel;
    public initialPage: PageSettingsModel;
    toolbar: (string | { text: string; id: string; prefixIcon: string; })[];
    constructor(
        private spinner: NgxSpinnerService,
        private departmentService: DepartmentService,
        private modalService: NgbModal,
        private _fromBuilder: FormBuilder,
        private userService: UserService,
        private router: Router,
    ) { }

    ngOnInit(): void {
        this.spinner.show();
        this.createForm();
        this.initialPage = { pageSize: 10 };
        this.searchOptions = {
            fields: ['id', 'name', 'type'],
            operator: 'contains', key: '', ignoreCase: true
        };
        this.toolbar = ['Search', {
            text: 'Thêm phòng/ban', id: 'addDepartment', prefixIcon: 'e-icons e-add'
        }];
        // get  list user
        this.departmentService.loadDepartment()
            .subscribe(
                (data: Department) => {
                    this.listDepartment = data;
                    this.spinner.hide();
                },
                err => {
                    this.errors = err;
                }
            );
    }
    // create form
    createForm() {
        this.formDepartment = this._fromBuilder.group({
            id: [''],
            name: [''],
            type: [''],
        });
    }
    // open modal
    open(content, event) {
        this.createForm();
        if (event.item.id === 'addDepartment') {
            this.modalService.open(content, { size: 'sm' }).result.then((result) => {
                this.closeResult = `Closed with: ${result}`;
            }, (reason) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            });
        }
    }
    open2(content) {
        this.createForm();
        this.modalService.open(content, { size: 'sm' }).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }
    open3(content) {
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
        this.departmentService.saveDepartment(this.formDepartment.value)
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
    // select object into gird parent
    rowSelected(args: RowSelectEventArgs) {
        this.departmenttemp = <Department[]>this.grid.getSelectedRecords();
        // tslint:disable-next-line:forin
        for (const i of this.departmenttemp) {
            this.departmentId = this.departmenttemp[0].id;
            this.departmentService.getDepartmentById(this.departmentId)
                .subscribe(
                    (data: Department) => {
                        this.department = data;
                    },
                    err => {
                        this.errors = err;
                    }
                );
        }
        return this.department;
    }

    // xl edit
    submitEdit(event) {
        this.department.id = event.target.id.value;
        this.department.name = event.target.name.value;
        this.department.type = event.target.type.value;
        this.departmentService.saveDepartment(this.department)
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
            title: 'Xóa phòng/ban',
            text: 'Bạn có chắc muốn xóa phòng/ban ' + this.departmentId,
            icon: 'warning',
            dangerMode: true,
        })
            .then(willDelete => {
                if (willDelete) {
                    this.departmentService.deleteDeprtment(this.departmentId)
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
    GetList(content, args: any) {
        this.listUser = new Array();
        this.id = args.currentTarget.parentNode.parentNode.parentNode.cells[0].innerHTML;
        this.userService.getAllUser()
            .subscribe(
                (data: Array<User>) => {
                    this.departmentService.getUserByDepartment(this.id)
                        .subscribe(
                            (res: Array<UserDepartment>) => {
                                for (let i = 0; i < data.length; i++) {
                                    for (let j = 0; j < res.length; j++) {
                                        if (data[i].userName === res[j].userId) {
                                            this.listUser.push(data[i]);
                                        }
                                    }
                                }
                                this.open3(content);
                            });
                });
    }
    addNhanVien(args: any) {
        this.id = args.currentTarget.parentNode.parentNode.parentNode.cells[0].innerHTML;
        this.router.navigateByUrl('/userDepartment/' + this.id);
    }
    deleteUserDepartment(args: any) {
        this.userDepartment.userId = args.currentTarget.parentNode.parentNode.parentNode.cells[0].innerHTML;
        this.userDepartment.department = this.id;
        this.departmentService.deleteUserDepartment(this.userDepartment)
            .subscribe(
                data => {
                    swal('Đã xóa!', 'Xóa thành công', 'success');
                    // chưa refesh lại modal dc
                    this.modalService.dismissAll();
                },
                err => {
                    this.errors = err;
                    swal('Lỗi', 'Xóa thất bại', 'error');
                }
            );
    }
}

