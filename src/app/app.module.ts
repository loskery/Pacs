import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MomentModule } from 'ngx-moment';
import * as _ from 'lodash';

// import {
//   FooterComponent,
//   HeaderComponent,
//   SharedModule
// } from './shared';

import { AuthGuard, SharedPipesModule, PageHeaderModule, SharedModule } from './shared';
import { CoreModule } from './core/core.module';
import { BrowserModule } from '@angular/platform-browser';
import { GridModule, PageService, SortService, FilterService, GroupService } from '@syncfusion/ej2-ng-grids';
import { ButtonModule } from '@syncfusion/ej2-ng-buttons';

// AoT requires an exported function for factories
export const createTranslateLoader = (http: HttpClient) => {
  // for development
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,

    BrowserAnimationsModule,
    // NoopAnimationsModule,
    CoreModule,
    NgxSpinnerModule,
    SharedModule,
    //  HomeModule,
    // AuthModule,
    AppRoutingModule,
    PageHeaderModule,
    SharedPipesModule,
    MomentModule,
    BrowserModule,
    ButtonModule,
    GridModule,
    HttpClientModule,
    // RichTextEditorAllModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    AuthGuard,
    PageService,
    SortService,
    FilterService,
    GroupService,

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
