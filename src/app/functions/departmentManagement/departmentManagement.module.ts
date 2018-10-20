import { NgModule } from '@angular/core';
import { GridModule, SortService, PageService, SearchService, ToolbarService, EditService } from '@syncfusion/ej2-ng-grids';
import { CommandColumnService } from '@syncfusion/ej2-ng-grids';
import { DepartmentManagementComponent } from './departmentManagement.component';
import { DepartmentManagementResolver } from './departmentManagement-resolver.service';
import { DepartmentManagementRoutingModule } from './departmentManagement-routing.module';
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
        DepartmentManagementRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        GridModule,
        ButtonModule,
        PageHeaderModule,
        NgxSpinnerModule,
        NgbModule.forRoot(),
        SharedModule
    ],
    declarations: [
        DepartmentManagementComponent,

    ],
    bootstrap: [DepartmentManagementComponent],
    providers: [
        DepartmentManagementResolver,
        SortService,
        PageService,
        SearchService,
        ToolbarService,
        PageService,
        EditService,
        CommandColumnService,

    ]
})
export class DepartmentManagementModule { }
