import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DiagnosticsComponent } from './diagnostics.component';
import { DiagnosticsRoutingModule } from './diagnostics-routing.module';

import { RichTextEditorAllModule } from '@syncfusion/ej2-ng-richtexteditor';
import { ButtonModule } from '@syncfusion/ej2-ng-buttons';
import { DropDownListComponent } from '@syncfusion/ej2-ng-dropdowns';
import { ToolbarService, HtmlEditorService } from '@syncfusion/ej2-ng-richtexteditor';
import { GridModule, PageService, SearchService } from '@syncfusion/ej2-ng-grids';
import { HttpClientModule } from '@angular/common/http';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToolbarService as ToolbarService2 } from '@syncfusion/ej2-ng-grids';
import { RisService, DiagnosticService, PatientService } from '../../core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { PageHeaderModule } from '../../shared';

@NgModule({
    declarations: [
        DiagnosticsComponent,
        DropDownListComponent
    ],
    imports: [
        PageHeaderModule,
        CommonModule,
        DiagnosticsRoutingModule,
        RichTextEditorAllModule,
        GridModule,
        ButtonModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule.forRoot(),
        NgxSpinnerModule
    ],
    providers: [
        ToolbarService,
        HtmlEditorService,
        // RisService,
        // DiagnosticService,
        PatientService,
        DatePipe,
        PageService,
        SearchService,
        ToolbarService2,
    ],
    bootstrap: [DiagnosticsComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DiagnosticsModule { }
