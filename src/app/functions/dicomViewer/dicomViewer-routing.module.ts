import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DicomViewerComponent } from './DicomViewer.component';
import { DicomViewerResolver } from './DicomViewer-resolver.service';
import { AuthGuard } from '../../core';

const routes: Routes = [
    {
        path: '',
        component: DicomViewerComponent,
        // canActivate: [AuthGuard]
        resolve: {
            isAuthenticated: DicomViewerResolver
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DicomViewerRoutingModule { }
