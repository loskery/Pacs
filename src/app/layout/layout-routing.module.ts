import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,

        children: [
            { path: '', redirectTo: 'patient' },
            // { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' },
            {
                path: 'patient',
                loadChildren: '../functions/patient/patient.module#PatientModule',
                pathMatch: 'prefix'
            },
            {
                path: 'diagnostics',
                loadChildren: '../functions/diagnostics/diagnostics.module#DiagnosticsModule'
            },
            {
                path: 'profile',
                loadChildren: '../functions/profile/profile.module#ProfileModule'
            },
            {
                path: 'usermanagement',
                loadChildren: '../functions/userManagement/userManagement.module#UserManagementModule'
            },
            {
                path: 'modalitymanagement',
                loadChildren: '../functions/modalityManagement/modalityManagement.module#ModalityManagementModule'
            },
            {
                path: 'dicomviewer',
                loadChildren: '../functions/dicomViewer/dicomViewer.module#DicomViewerModule'
            },

            {
                path: 'departmentManagement',
                loadChildren: '../functions/departmentManagement/departmentManagement.module#DepartmentManagementModule'
            },
            {
                path: 'userDepartment/:id',
                loadChildren: '../functions/userDepartment/userDepartmentmodule#UserDepartmentModule'
            },
            // { path: 'charts', loadChildren: './charts/charts.module#ChartsModule' },
            // { path: 'tables', loadChildren: './tables/tables.module#TablesModule' },
            // { path: 'forms', loadChildren: './form/form.module#FormModule' },
            // { path: 'bs-element', loadChildren: './bs-element/bs-element.module#BsElementModule' },
            // { path: 'grid', loadChildren: './grid/grid.module#GridModule' },
            // { path: 'components', loadChildren: './bs-component/bs-component.module#BsComponentModule' },
            // { path: 'blank-page', loadChildren: './blank-page/blank-page.module#BlankPageModule' }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule { }
