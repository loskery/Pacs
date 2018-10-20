import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DepartmentManagementComponent } from './departmentManagement.component';
import { DepartmentManagementResolver } from './departmentManagement-resolver.service';
import { AuthGuard } from '../../core';

const routes: Routes = [
    {
        path: '',
        component: DepartmentManagementComponent,
        // canActivate: [AuthGuard]
        resolve: {
            isAuthenticated: DepartmentManagementResolver
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DepartmentManagementRoutingModule { }
