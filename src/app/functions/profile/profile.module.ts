import { NgModule } from '@angular/core';
import { PageHeaderModule } from '../../shared';
import { ProfileComponent } from './profile.component';
import { ProfileResolver } from './profile-resolver.service';
import { SharedModule } from '../../shared';
import { ProfileRoutingModule } from './profile-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
@NgModule({
    imports: [SharedModule, ProfileRoutingModule, ReactiveFormsModule, PageHeaderModule, FormsModule],
    declarations: [ProfileComponent],
    bootstrap: [ProfileComponent],
    providers: [ProfileResolver]
})
export class ProfileModule { }
