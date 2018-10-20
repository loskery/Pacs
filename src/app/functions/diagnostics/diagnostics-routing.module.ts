import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DiagnosticsComponent } from './diagnostics.component';

const routes: Routes = [
    {
        path: '',
        component: DiagnosticsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DiagnosticsRoutingModule { }
