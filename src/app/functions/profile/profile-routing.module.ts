import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { ProfileResolver } from './profile-resolver.service';
import { AuthGuard } from '../../core';

const routes: Routes = [
    {
        path: '',
        component: ProfileComponent,
        // canActivate: [AuthGuard]
        resolve: {
            isAuthenticated: ProfileResolver
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProfileRoutingModule { }
