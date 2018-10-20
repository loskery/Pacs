import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ModalityDeviceService, Modality, Errors } from '../../core';
import { SearchSettingsModel, PageSettingsModel, EditSettingsModel } from '@syncfusion/ej2-ng-grids';
import { GridComponent, RowSelectEventArgs } from '@syncfusion/ej2-ng-grids';
import { routerTransition } from '../../router.animations';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import swal from 'sweetalert';

@Component({
    selector: 'app-modalitymanagement',
    templateUrl: './modalityManagement.component.html',
    styleUrls: ['./modalityManagement.component.css'],
    encapsulation: ViewEncapsulation.None,
    animations: [routerTransition()]
})
export class ModalityManagementComponent implements OnInit {
    @ViewChild('element') element;
    errors: Errors = { errors: {} };
    public listModality: any;
    public sortOptions: Object;
    public modality = new Modality();
    public formModality: FormGroup;
    public idModality: number;
    public modalityName: string;
    public modalityTemp: Array<Modality> = [];
    public checkActive: boolean;
    closeResult: string;
    public errString: string;

    @ViewChild('grid')
    public grid: GridComponent;
    public editSettings: EditSettingsModel;
    public searchOptions: SearchSettingsModel;
    public initialPage: PageSettingsModel;
    toolbar: (string | { text: string; id: string; prefixIcon: string; })[];
    constructor(
        private spinner: NgxSpinnerService,
        private modalityDeviceService: ModalityDeviceService,
        private modalService: NgbModal,
        private _fromBuilder: FormBuilder,
    ) { }

    ngOnInit(): void {
        this.spinner.show();
        this.createForm();
        this.initialPage = { pageSize: 10 };
        this.searchOptions = {
            fields: ['id', 'modality', 'manufacture', 'serial', 'model', 'ipAddress'],
            operator: 'contains', key: '', ignoreCase: true
        };
        this.toolbar = ['Search', {
            text: 'Thêm mới', id: 'addModality', prefixIcon: 'e-icons e-add'
        }];

        // get  list modality
        this.modalityDeviceService.getAllModality()
            .subscribe(
                (data: Modality) => {
                    this.listModality = data;
                    this.spinner.hide();
                },
                err => {
                    this.errors = err;
                }
            );

    }
    // create form
    createForm() {
        this.formModality = this._fromBuilder.group({
            id: [''],
            modality: [''],
            manufacture: [''],
            serial: [''],
            model: [''],
            isActive: [''],
            ipAddress: [''],
            emrGroup: [''],
            emrCapitalType: [''],
            aeTitle: [''],
        });
    }
    // open modal
    open(content, event) {
        this.createForm();
        if (event.item.id === 'addModality') {
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
        this.errors = { errors: {} };
        this.modalityDeviceService.saveDevice(this.formModality.value)
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
    // select object into gird
    rowSelected(args: RowSelectEventArgs) {
        this.modalityTemp = <Modality[]>this.grid.getSelectedRecords();
        // tslint:disable-next-line:forin
        for (const i of this.modalityTemp) {
            this.idModality = this.modalityTemp[0].id;
            this.modalityDeviceService.getModalityById(this.idModality)
                .subscribe(
                    (data: Modality) => {
                        this.modality = data;
                        if (data.isActive === true) {
                            this.checkActive = true;
                        } else {
                            this.checkActive = false;
                        }
                    },
                    err => {
                        this.errors = err;
                    }
                );
        }
    }

    // xl edit
    submitEdit(event) {
        this.modality.id = event.target.id.value;
        this.modality.modality = event.target.modality.value;
        this.modality.manufacture = event.target.manufacture.value;
        this.modality.serial = event.target.serial.value;
        this.modality.emrGroup = event.target.emrGroup.value;
        this.modality.emrCapitalType = event.target.emrCapitalType.value;
        this.modality.model = event.target.model.value;
        this.modality.aeTitle = event.target.aeTitle.value;
        this.modality.ipAddress = event.target.ipAddress.value;
        if (event.target.isActive[0].checked === true) {
            this.modality.isActive = true;
        } else {
            this.modality.isActive = false;
        }
        // console.log(this.modality);
        swal('chưa có api update');
        // this.userService.updateUser(this.nguoiDung)
        //     .subscribe(
        //         data => {
        //             swal('Đã cập nhật!', 'Cập nhật thành công', 'success')
        //                 .then(xl => {
        //                     this.modalService.dismissAll();
        //                     this.ngOnInit();
        //                 });

        //         },
        //         err => {
        //             this.errors = err;
        //             swal('Lỗi!', 'Cập nhật thất bại', 'error');
        //         });
    }
    // xử lý xóa

    submitXoa() {
        swal('Chưa có api xóa');
        // swal({
        //     title: 'Xóa tài khoản người dùng',
        //     text: 'Bạn có chắc muốn xóa tài khoản ' + this.modalityName,
        //     icon: 'warning',
        //     dangerMode: true,
        // })
        //     .then(willDelete => {
        //         if (willDelete) {
        //             this.userService.deleteUserByUserName(this.modalityName)
        //                 .subscribe(
        //                     data => {
        //                         swal('Đã xóa!', 'Xóa thành công', 'success')
        //                             .then(
        //                                 xl => {
        //                                     this.modalService.dismissAll();
        //                                     this.ngOnInit();
        //                                 }
        //                             );
        //                     },
        //                     err => {
        //                         this.errors = err;
        //                         swal('Lỗi!', 'Xóa thất bại !', 'error');
        //                     });
        //         }
        //     });
    }
    chooseIsActive(event) {
        if (event.target.id === 'isActive') {
            this.formModality.value.isActive = true;
        } else {
            this.formModality.value.isActive = false;
        }
        return this.formModality;
    }
}
