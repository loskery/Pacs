import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { DepartmentService, Errors, Department, User, UserService, NguoiDung, UserDepartment } from '../../core';
import { SearchSettingsModel, PageSettingsModel, EditSettingsModel } from '@syncfusion/ej2-ng-grids';
import { GridComponent, RowSelectEventArgs } from '@syncfusion/ej2-ng-grids';
import { routerTransition } from '../../router.animations';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import swal from 'sweetalert';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-userdepartment',
    templateUrl: './userDepartment.component.html',
    styleUrls: ['./userDepartment.component.css'],
    encapsulation: ViewEncapsulation.None,
    animations: [routerTransition()]
})
export class UserDepartmentComponent implements OnInit {
    @ViewChild('element') element;
    errors: Errors = { errors: {} };
    public listUser: any;
    public sortOptions: Object;
    public nguoiDung = new NguoiDung();
    public nguoiDungtemp: Array<NguoiDung> = [];
    public formDepartment: FormGroup;
    public userName: string;
    closeResult: string;
    public errString: string;
    public titleDepartment: any;
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
        private userService: UserService,
        private modalService: NgbModal,
        private _fromBuilder: FormBuilder,
        private activatedRoute: ActivatedRoute,
    ) { }

    ngOnInit(): void {
        this.spinner.show();
        this.createForm();
        this.departmentService.getDepartmentById(this.activatedRoute.snapshot.params['id'])
            .subscribe(
                (data: Department) => {
                    this.titleDepartment = data.name;
                }
            );

        this.initialPage = { pageSize: 10 };
        // get  list user
        this.userService.getAllUser()
            .subscribe(
                (data: User) => {
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
        this.formDepartment = this._fromBuilder.group({
            id: [''],
            name: [''],
            type: [''],
        });
    }
    // open modal
    open(content) {
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
    buttonAdd(args: any) {
        this.userName = args.currentTarget.parentNode.parentNode.parentNode.cells[0].innerHTML;
        this.userDepartment.userId = this.userName;
        this.userDepartment.department = this.activatedRoute.snapshot.params['id'];
        swal({
            text: 'Thêm người dùng ' + this.userName + ' vào phòng ' + this.titleDepartment,
        })
            .then(willDelete => {
                if (willDelete) {
                    this.departmentService.addUserDepartment(this.userDepartment)
                        .subscribe(
                            data => {
                                swal('Đã thêm!', 'Thêm thành công', 'success')
                                    .then(
                                        xl => {
                                            this.modalService.dismissAll();
                                            this.ngOnInit();
                                        }
                                    );
                            },
                            err => {
                                this.errors = err;
                                swal('Lỗi!', 'Thêm thất bại !', 'error');
                            });
                }
            });
    }
}

