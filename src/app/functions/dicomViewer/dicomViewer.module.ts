import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DicomViewerComponent } from './dicomViewer.component';
import { DicomViewerResolver } from './dicomViewer-resolver.service';
import { DicomViewerRoutingModule } from './dicomViewer-routing.module';
import { PageHeaderModule } from '../../shared';
import { SharedModule } from '../../shared';
import { RichTextEditorAllModule } from '@syncfusion/ej2-ng-richtexteditor';
import { ToolbarService, LinkService, ImageService, HtmlEditorService } from '@syncfusion/ej2-ng-richtexteditor';

@NgModule({
    imports: [
        DicomViewerRoutingModule,
        PageHeaderModule,
        SharedModule,
        RichTextEditorAllModule,
    ],
    declarations: [
        DicomViewerComponent,
    ],
    bootstrap: [DicomViewerComponent],
    providers: [
        ToolbarService,
        HtmlEditorService,
        DicomViewerResolver,
        LinkService,
        ImageService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DicomViewerModule { }
