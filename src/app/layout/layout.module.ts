import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  MatButtonModule,
  MatIconModule,
  MatMenuModule,
  MatToolbarModule,
  MatCardModule,
  MatListModule,
  MatRippleModule,
  MatTreeModule
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
  PageService,
  PageTreeComponent,
  PageNode,
  PageNodeView
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
    MatListModule,
    MatRippleModule,
    MatTreeModule
  ],
  declarations: [
    PageComponent,
    PageListComponent,
    PageTreeComponent,
    PageSection,
    PageTitle,
    PageSubTitle,
    PageSectionDefinition,
    PageSectionContent,
    PageSectionToolbar,
    PageSectionDetail,
    PageNode,
    PageNodeView
  ],
  exports: [
    PageComponent,
    PageListComponent,
    PageTreeComponent,
    PageSection,
    PageTitle,
    PageSubTitle,
    PageSectionDefinition,
    PageSectionContent,
    PageSectionToolbar,
    PageSectionDetail,
    PageNode,
    PageNodeView
  ],
  providers: [
    PageService
  ],
  entryComponents: [
  ]
})
export class LayoutModule { }