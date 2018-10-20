import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Service, Patient } from '../../core/models';
import { PatientService } from '../../core';
import { ModalExportComponent } from '../../shared/modal/modal-export/modal-export.component';
import { ModalDiagnoseComponent } from '../../shared/modal/modal-diagnose/modal-diagnose.component';

@Component({
    selector: 'app-blank-page',
    templateUrl: './blank-page.component.html',
    styleUrls: ['./blank-page.component.scss']
})
export class BlankPageComponent implements OnInit {

    public modalities: Array<Service>;
    public patient: Patient;

    constructor(private modalService: NgbModal, private patientService: PatientService) { }

    ngOnInit() {
        this.getServices();
    }

    onExport() {
        const modalRef = this.modalService.open(ModalExportComponent, { size: 'lg' });
        modalRef.componentInstance.id = 1;
        modalRef.componentInstance.title = 'About';
        modalRef.componentInstance.modalities = this.modalities;
        modalRef.componentInstance.patient = this.patient;

        modalRef.result.then((result) => {
            console.log(result);
        }).catch((error) => {
            console.log('Err:' + error);
        });
    }

    getServices() {
        this.patientService.getServices()
            .subscribe(
                services => this.modalities = services
            );
    }

    onDiagnose() {
        const modalRef = this.modalService.open(ModalDiagnoseComponent, { size: 'lg' });
        modalRef.componentInstance.id = 1;
        modalRef.componentInstance.title = 'About';
        modalRef.componentInstance.modalities = this.modalities;
        modalRef.componentInstance.patient = this.patient;

        modalRef.result.then((result) => {
            console.log(result);
        }).catch((error) => {
            console.log('Err:' + error);
        });
    }
}

