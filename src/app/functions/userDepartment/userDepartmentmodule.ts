import { NgModule } from '@angular/core';
import { GridModule, SortService, PageService, SearchService, ToolbarService, EditService } from '@syncfusion/ej2-ng-grids';
import { CommandColumnService } from '@syncfusion/ej2-ng-grids';
import { UserDepartmentComponent } from './userDepartment.component';
import { UserDepartmentResolver } from './userDepartment-resolver.service';
import { UserDepartmentRoutingModule } from './userDepartment-routing.module';
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
        UserDepartmentRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        GridModule,
        ButtonModule,
        PageHeaderModule,
        NgxSpinnerModule,
        NgbModule.forRoot(),
        SharedModule
    ],
    declarations: [UserDepartmentComponent],
    bootstrap: [UserDepartmentComponent],
    providers: [
        UserDepartmentResolver,
        SortService,
        PageService,
        SearchService,
        ToolbarService,
        PageService,
        EditService,
        CommandColumnService
    ]
})
export class UserDepartmentModule { }
