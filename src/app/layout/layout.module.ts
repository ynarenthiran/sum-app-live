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
  PageSection,
  PageTitle,
  PageSubTitle,
  PageSectionContent,
  PageSectionToolbar,
  PageSectionDetail,
  PageSectionDefinition
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
    PageSection,
    PageTitle,
    PageSubTitle,
    PageSectionDefinition,
    PageSectionContent,
    PageSectionToolbar,
    PageSectionDetail
  ],
  providers: [
  ],
  entryComponents: [
  ]
})
export class LayoutModule { }