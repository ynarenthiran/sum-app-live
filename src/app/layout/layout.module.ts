import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  MatButtonModule,
  MatIconModule,
  MatMenuModule,
  MatToolbarModule,
  MatCardModule,
  MatListModule
} from '@angular/material';

import {
  PageComponent,
  PageListComponent,
  PageSection,
  PageTitle,
  PageSubTitle,
  PageSectionContent,
  PageSectionToolbar,
  PageSectionDetail,
  PageSectionDefinition,
  PageService
} from './page.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule,
    MatCardModule,
    MatListModule
  ],
  declarations: [
    PageComponent,
    PageListComponent,
    PageSection,
    PageTitle,
    PageSubTitle,
    PageSectionDefinition,
    PageSectionContent,
    PageSectionToolbar,
    PageSectionDetail
  ],
  exports: [
    PageComponent,
    PageListComponent,
    PageSection,
    PageTitle,
    PageSubTitle,
    PageSectionDefinition,
    PageSectionContent,
    PageSectionToolbar,
    PageSectionDetail
  ],
  providers: [
    PageService
  ],
  entryComponents: [
  ]
})
export class LayoutModule { }