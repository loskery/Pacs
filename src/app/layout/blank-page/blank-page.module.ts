import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { BlankPageRoutingModule } from './blank-page-routing.module';
import { BlankPageComponent } from './blank-page.component';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PatientService } from '../../core/services';
import { ModalExportComponent } from '../../shared/modal/modal-export/modal-export.component';
import { ModalDiagnoseComponent } from '../../shared/modal/modal-diagnose/modal-diagnose.component';
// import { DropDownListComponent } from '@syncfusion/ej2-ng-dropdowns';
import { RichTextEditorAllModule } from '@syncfusion/ej2-ng-richtexteditor';
import { DialogModule } from '@syncfusion/ej2-ng-popups';

@NgModule({
    declarations: [
        BlankPageComponent,
        ModalExportComponent,
        ModalDiagnoseComponent
    ],
    imports: [
        CommonModule,
        BlankPageRoutingModule,
        NgbModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,

        RichTextEditorAllModule,
        DialogModule
    ],
    bootstrap: [BlankPageComponent],
    providers: [NgbActiveModal, PatientService, DatePipe],
    entryComponents: [
        ModalExportComponent,
        ModalDiagnoseComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BlankPageModule { }
