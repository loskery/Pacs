import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { PatientRoutingModule } from './patient-routing.module';
import { PatientComponent } from './patient.component';

// tslint:disable-next-line:max-line-length
import { GridModule, PageService, SortService, FilterService, GroupService, CommandColumnService, EditService, ResizeService, ReorderService } from '@syncfusion/ej2-ng-grids';
import { PatientService, RisService } from '../../core';
import { ButtonModule } from '@syncfusion/ej2-ng-buttons';
import { AgePipe } from '../../shared/pipes/age-pipes';
import { GenderPipe } from '../../shared/pipes/gender-pipes';
import { ModalPopupComponent } from '../../shared/modal/modal-popup/modal-popup.component';

// import the DatePickerModule for the DatePicker component
import { DatePickerModule } from '@syncfusion/ej2-ng-calendars';
import { MultiSelectComponent, CheckBoxSelectionService } from '@syncfusion/ej2-ng-dropdowns';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CommonPipe } from '../../shared/pipes/common-pipes';
import { DicomViewerComponent } from '../DicomViewer/DicomViewer.component';

@NgModule({
    imports: [
        CommonModule,
        PatientRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule.forRoot(),
        GridModule,
        ButtonModule,
        HttpClientModule,
        DatePickerModule,
        NgxSpinnerModule,
    ],
    declarations: [
        PatientComponent,
        ModalPopupComponent,
        MultiSelectComponent,
        DicomViewerComponent,
    ],
    bootstrap: [PatientComponent],
    providers: [
        CommonPipe,
        DatePipe,
        AgePipe,
        GenderPipe,
        RisService,
        PatientService,
        PageService,
        SortService,
        FilterService,
        GroupService,
        EditService,
        CommandColumnService,
        ResizeService,
        ReorderService,
        CheckBoxSelectionService,
    ],
    entryComponents: [ModalPopupComponent, DicomViewerComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PatientModule { }
