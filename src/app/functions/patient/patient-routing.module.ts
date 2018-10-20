import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PatientComponent } from './patient.component';
import { AuthGuard } from '../../core';
import { PatientResolver } from './patient-resolver.service';

const routes: Routes = [
    {
        path: '',
        component: PatientComponent,
        // resolve: {
        //     isAuthenticated: PatientResolver
        // }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PatientRoutingModule { }
