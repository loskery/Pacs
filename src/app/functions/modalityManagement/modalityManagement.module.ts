import { NgModule } from '@angular/core';
import { GridModule, SortService, PageService, SearchService, ToolbarService, EditService } from '@syncfusion/ej2-ng-grids';
import { CommandColumnService } from '@syncfusion/ej2-ng-grids';
import { ModalityManagementComponent } from './modalityManagement.component';
import { ModalityManagementResolver } from './modalityManagement-resolver.service';
import { ModalityManagementRoutingModule } from './modalityManagement-routing.module';
import { ButtonModule } from '@syncfusion/ej2-ng-buttons';
import { enableRipple } from '@syncfusion/ej2-base';
import { PageHeaderModule } from '../../shared';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared';

enableRipple(true);
@NgModule({
    imports: [
        ModalityManagementRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        GridModule,
        ButtonModule,
        PageHeaderModule,
        NgxSpinnerModule,
        NgbModule.forRoot(),
        SharedModule
    ],
    declarations: [ModalityManagementComponent],
    bootstrap: [ModalityManagementComponent],
    providers: [
        ModalityManagementResolver,
        SortService,
        PageService,
        SearchService,
        ToolbarService,
        PageService,
        EditService,
        CommandColumnService
    ]
})
export class ModalityManagementModule { }
