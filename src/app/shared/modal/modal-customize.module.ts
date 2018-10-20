import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalPopupComponent } from './modal-popup/modal-popup.component';
import { ModalExportComponent } from './modal-export/modal-export.component';
import { ModalDiagnoseComponent } from './modal-diagnose/modal-diagnose.component';


@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        ModalPopupComponent,
        ModalExportComponent,
        ModalDiagnoseComponent
    ],
    exports: [],
})
export class ModalCustomizeModule { }
