import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModalityManagementComponent } from './modalityManagement.component';
import { ModalityManagementResolver } from './modalityManagement-resolver.service';
import { AuthGuard } from '../../core';

const routes: Routes = [
    {
        path: '',
        component: ModalityManagementComponent,
        // canActivate: [AuthGuard]
        resolve: {
            isAuthenticated: ModalityManagementResolver
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ModalityManagementRoutingModule { }
