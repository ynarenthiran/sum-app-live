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
import { AngularDraggableModule } from 'angular2-draggable';

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
import { FlexiblePageComponent, FlexiblePageSection } from './page2.component';

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
    MatTreeModule,
    AngularDraggableModule
  ],
  declarations: [
    PageComponent,
    FlexiblePageComponent,
    PageListComponent,
    PageTreeComponent,
    PageHeader,
    PageSection,
    FlexiblePageSection,
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
    FlexiblePageComponent,
    PageHeader,
    PageSection,
    FlexiblePageSection,
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