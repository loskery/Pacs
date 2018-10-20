import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgePipe } from './age-pipes';
import { GenderPipe } from './gender-pipes';
import { CommonPipe } from './common-pipes';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        CommonPipe,
        AgePipe,
        GenderPipe
    ],
    exports: [
        CommonPipe,
        AgePipe,
        GenderPipe
    ]
})
export class SharedPipesModule { }
