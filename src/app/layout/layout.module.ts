import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  PageContent,
  PageSubTitle,
  PageSectionContent,
  PageSectionToolbar,
  PageSectionDetail
} from './page.component';

@NgModule({
  imports: [
    CommonModule,
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
    PageContent,
    PageSectionContent,
    PageSectionToolbar,
    PageSectionDetail
  ],
  exports: [
    PageComponent,
    PageSection,
    PageTitle,
    PageSubTitle,
    PageContent,
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