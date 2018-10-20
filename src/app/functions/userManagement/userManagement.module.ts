import { NgModule } from '@angular/core';
import { GridModule, SortService, PageService, SearchService, ToolbarService, EditService } from '@syncfusion/ej2-ng-grids';
import { CommandColumnService } from '@syncfusion/ej2-ng-grids';
import { UserManagementComponent } from './userManagement.component';
import { UserManagementResolver } from './userManagement-resolver.service';
import { UserManagementRoutingModule } from './userManagement-routing.module';
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
        UserManagementRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        GridModule,
        ButtonModule,
        PageHeaderModule,
        NgxSpinnerModule,
        NgbModule.forRoot(),
        SharedModule
    ],
    declarations: [UserManagementComponent],
    bootstrap: [UserManagementComponent],
    providers: [
        UserManagementResolver,
        SortService,
        PageService,
        SearchService,
        ToolbarService,
        PageService,
        EditService,
        CommandColumnService
    ]
})
export class UserManagementModule { }
