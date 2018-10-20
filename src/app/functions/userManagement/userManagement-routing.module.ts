import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserManagementComponent } from './userManagement.component';
import { UserManagementResolver } from './userManagement-resolver.service';
import { AuthGuard } from '../../core';

const routes: Routes = [
    {
        path: '',
        component: UserManagementComponent,
        // canActivate: [AuthGuard]
        resolve: {
            isAuthenticated: UserManagementResolver
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserManagementRoutingModule { }
