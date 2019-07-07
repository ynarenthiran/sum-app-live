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
  PageSectionContent,
  PageSectionToolbar,
  PageSectionDetail,
  PageSectionDefinition,
  PageService,
  PageTreeComponent,
  PageNode,
  PageHeader
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
    PageHeader,
    PageSection,
    PageSectionDefinition,
    PageSectionContent,
    PageSectionToolbar,
    PageSectionDetail,
    PageNode
  ],
  exports: [
    PageComponent,
    PageListComponent,
    PageTreeComponent,
    PageHeader,
    PageSection,
    PageSectionDefinition,
    PageSectionContent,
    PageSectionToolbar,
    PageSectionDetail,
    PageNode
  ],
  providers: [
    PageService
  ],
  entryComponents: [
  ]
})
export class LayoutModule { }