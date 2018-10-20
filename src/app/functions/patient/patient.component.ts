import { Component, OnInit, ViewChild, AfterViewInit, Input } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { ChangeEventArgs } from '@syncfusion/ej2-inputs';
import { GridComponent, PageSettingsModel, EditSettingsModel, IRow, Column } from '@syncfusion/ej2-ng-grids';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService, JwtService, Department } from '../../core';
import { Service } from '../../core/models/service.model';
import { FormBuilder, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { closest } from '@syncfusion/ej2-base';
import { NgbTabset, NgbTabChangeEvent, ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Series } from '../../core/models/series.model';
import { __ } from 'lodash';
import { AgePipe } from '../../shared/pipes/age-pipes';
import { GenderPipe } from '../../shared/pipes/gender-pipes';
import moment from 'moment';
import { ModalPopupComponent } from '../../shared/modal/modal-popup/modal-popup.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonPipe } from '../../shared/pipes/common-pipes';
import { TabsComponent } from '../../layout/bs-component/components/tabs/tabs.component';
import swal from 'sweetalert';
import { DepartmentService } from '../../core/services/department.service';
export interface ITab {
    id: string;
    title: string;
}
@Component({
    selector: 'app-patient',
    templateUrl: './patient.component.html',
    styleUrls: ['./patient.component.scss'],
    // encapsulation: ViewEncapsulation.None,
    animations: [routerTransition()]
})
export class PatientComponent implements OnInit, AfterViewInit {
    public Patient: Series;
    public patientList: Series[];
    public initialPage: PageSettingsModel;
    errors: Object = {};
    public sortOptions: Object;
    public editSettings: EditSettingsModel;
    public patient: any;
    public searchPatientForm: FormGroup;
    public ld: __;
    public startDate: Date = moment().add(-1, 'month').toDate();
    public endDate: Date = moment().toDate();
    public maxDate: Date = new Date();
    public modalities: Array<Service>;
    public message: string;
    public fields: Object = { text: 'serviceCode', value: 'id' };
    public mode: string;
    public selectAllText: string;
    public unSelectAllText: string;
    public maximumSelectionLength: number;
    public popupHeight = '300px';
    public selectedItems = [];
    // modalitiesSettings = {};
    // @ViewChild('app-dicomviewer') dicomViewerForm;
    @ViewChild(TabsComponent) tabsComponent;
    @ViewChild('tabs')
    private ngbTabset: NgbTabset;
    public tabs: ITab[] = [];
    public prospectId: number;
    public selectedTab: string;
    public token: String;
    public userCurrent: string;
    private departmentType: string;

    @ViewChild('grid')
    public grid: GridComponent;
    toolbar: (string | { text: string; id: string; prefixIcon: string; })[];

    constructor(
        private fromBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private patientService: PatientService,
        private commonPipe: CommonPipe,
        private agePipe: AgePipe,
        private genderPipe: GenderPipe,
        private modalService: NgbModal,
        private spinner: NgxSpinnerService,
        private jwtService: JwtService,
        private departmentService: DepartmentService,

    ) {
        this.route.data.subscribe(d => {
            this.selectedTab = d.name;
        });
    }

    ngOnInit(): void {
        this.message = '';
        this.mode = 'CheckBox';
        this.selectAllText = 'Chọn tất cả';
        this.unSelectAllText = 'Bỏ chọn';
        this.maximumSelectionLength = 10;

        // this.modalitiesSettings = {
        //     singleSelection: false,
        //     idField: 'serviceCode',
        //     textField: 'serviceCode',
        //     selectAllText: 'Select All',
        //     unSelectAllText: 'UnSelect All',
        //     itemsShowLimit: 10,
        //     allowSearchFilter: false
        // };

        this.createSearchForm();
        this.initialPage = { pageSize: 25 };
        this.editSettings = { allowEditing: false, allowDeleting: false };

        this.route.params.subscribe(
            params => {
                this.prospectId = +params['prospectid'];
            }
        );
        this.getModalityType();
        // get patient list (init)
        this.getPatients(this.startDate, this.endDate);
    }

    ngAfterViewInit(): void {

        // get modalities (init)
        this.getServices();

        // get patient list (init)
        // this.getPatients(this.startDate, this.endDate);
    }

    change(args: ChangeEventArgs) {
        this.initialPage = { currentPage: args.value };
    }

    createSearchForm() {
        this.searchPatientForm = this.fromBuilder.group({
            acc: [
                '',
                Validators.required
            ],
            patientName: [
                '',
                Validators.required
            ],
            startDate: [
                // { year: this.startDate.getFullYear(), month: this.startDate.getMonth() + 1, day: this.startDate.getDate() },
                this.startDate,
                Validators.required
            ],
            endDate: [
                // { year: this.endDate.getFullYear(), month: this.endDate.getMonth() + 1, day: this.endDate.getDate() },
                this.endDate,
                Validators.required
            ],
            selectedItems: [
                this.modalities,
                Validators.required
            ],
        });
    }

    onSearchPatient() {
        this.message = '';
        const acc = this.searchPatientForm.value.acc;
        const patientName = this.searchPatientForm.value.patientName;
        this.selectedItems = this.searchPatientForm.value.selectedItems;
        // const startDate: Date = moment(this.searchPatientForm.value.startDate, 'DD-MM-YYYY').toDate();
        // const endDate: Date = moment(this.searchPatientForm.value.endDate, 'DD-MM-YYYY').toDate();
        const startDate: Date = this.searchPatientForm.value.startDate;
        const endDate: Date = this.searchPatientForm.value.endDate;
        const isDiagnose = false;
        if (!this.commonPipe.isValidDate(startDate) || !this.commonPipe.isValidDate(endDate)) {
            swal('Định dạng ngày không đúng. Vui lòng chọn lại.');
            return;
        }
        if (startDate > endDate) {
            swal('Ngày bắt đầu lớn hơn ngày kết thúc. Vui lòng chọn lại ngày bắt đầu.');
            return;
        }
        this.getPatients(startDate, endDate, isDiagnose);
    }

    getServices() {
        this.patientService.getServices()
            .pipe()
            .subscribe(
                services => this.modalities = services,
                error => this.message = error
            );
    }

    getPatients(startDate: Date, endDate: Date, isDiagnose: boolean = false): void {
        this.spinner.show();
        this.patientService.getSeries(startDate, endDate, isDiagnose)
            .subscribe(
                (list: Array<Series>) => {
                    this.patientList = new Array<Series>();
                    let flag: boolean;

                    list.reverse().forEach(element => {
                        flag = true;

                        for (let index = 0; index < this.patientList.length; index++) {
                            const item = this.patientList[index];
                            if (element.seriesStudyId === item.seriesStudyId && element.seriesModality === item.seriesModality) {
                                flag = false;
                                break;
                            }
                        }
                        if (flag === true) {
                            // tslint:disable-next-line:max-line-length
                            element.qnuRis_Study.qnuRis_Patient.patientAge = this.agePipe.transform(element.qnuRis_Study.qnuRis_Patient.patientBirthday);
                            // tslint:disable-next-line:max-line-length
                            element.qnuRis_Study.qnuRis_Patient.patientGender = this.genderPipe.transform(element.qnuRis_Study.qnuRis_Patient.patientSex);
                            if (element.seriesModality === this.departmentType) {
                                this.patientList.push(element);
                            }
                        }
                    });
                    this.spinner.hide();
                },
                err => {
                    swal('Lỗi kết nối server');
                }
            );
    }

    onViewDicom(args: Event): void {
        const rowObj: IRow<Column> = this.grid.getRowObjectFromUID(closest(<Element>args.target, '.e-row').getAttribute('data-uid'));
        const rowData: any = rowObj.data;
        this.addTab(rowData);
    }

    showTabDicomViewer(args: Event): void {
        const rowObj: IRow<Column> = this.grid.getRowObjectFromUID(closest(<Element>args.target, '.e-row').getAttribute('data-uid'));
        const rowData: any = rowObj.data;
        this.addTab(rowData);
    }

    addTab(series: Series): void {
        if (this.tabs.length >= 3) {
            this.openModalPopup();
            return;
        }
        this.Patient = series;
        this.tabs = this.tabs.concat({
            id: series.seriesSeriesInstanceUID,
            title: series.qnuRis_Study.qnuRis_Patient.patientName
        });
    }

    public onCloseTab(tab: ITab, $event): void {
        this.tabs = this.tabs
            .filter((currentTab: ITab): boolean => currentTab !== tab);
        $event.preventDefault();
    }

    // ngAfterViewChecked(): void {
    //     if (this.ngbTabset) {
    //         this.ngbTabset.select(this.selectedTab);
    //     }
    // }

    onTabChange($event: NgbTabChangeEvent) {
        const routes = {
            details: `/prospect/${this.prospectId}/details`,
            appointments: `/prospect/${this.prospectId}/appointments`,
            followups: `/prospect/${this.prospectId}/followups`,
            notes: `/prospect/${this.prospectId}/notes`,
            dials: `/prospect/${this.prospectId}/dials`,
        };

        this.router.navigateByUrl(routes[$event.nextId]);
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

    openModalPopup() {
        const modalRef = this.modalService.open(ModalPopupComponent);
        modalRef.componentInstance.message = 'Số lượng tab mở đã tối đa.';
    }

    dataBound() {
        // tslint:disable-next-line:max-line-length
        this.grid.autoFitColumns(['qnuRis_Study.studyAccessionNumber', 'qnuRis_Study.qnuRis_Patient.patientGender', 'qnuRis_Study.qnuRis_Patient.patientAge', 'seriesModality', 'qnuRis_Study.studyStudyDescription']);
    }
    getModalityType() {
        if (this.jwtService.getToken()) {
            this.token = this.jwtService.getToken();
            this.departmentService.getDepartmentByUserId(this.jwtService.getDecodedAccessToken(this.token).unique_name)
                .subscribe(
                    (data: Department) => {
                        return this.departmentType = data.type;
                    },
                    err => {
                        alert('User have not department');
                    }
                );
        }
    }
}
