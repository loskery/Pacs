import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserDepartmentComponent } from './userDepartment.component';
import { UserDepartmentResolver } from './userDepartment-resolver.service';
import { AuthGuard } from '../../core';

const routes: Routes = [
    {
        path: '',
        component: UserDepartmentComponent,
        // canActivate: [AuthGuard]
        resolve: {
            isAuthenticated: UserDepartmentResolver
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserDepartmentRoutingModule { }
