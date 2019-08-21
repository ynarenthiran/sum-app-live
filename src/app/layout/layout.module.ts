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
  MatTreeModule,
  MatExpansionModule,
  MatSidenavModule
} from '@angular/material';
import { GridsterModule } from 'angular2gridster';

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
import {
  FlexiblePageComponent, FlexiblePageSection, FlexiblePageSectionAction,
  FlexiblePageSectionFab, FlexiblePageSectionContent, FlexiblePageSectionFooter,
  FlexiblePageSectionContainer,
  FlexiblePageSectionInstance
} from './page2.component';
import { DialogModule } from '../dialog/dialog.module';

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
    MatExpansionModule,
    MatSidenavModule,
    GridsterModule,
    DialogModule
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
    PageNode,
    FlexiblePageSectionAction,
    FlexiblePageSectionFab,
    FlexiblePageSectionContent,
    FlexiblePageSectionFooter,
    FlexiblePageSectionContainer,
    FlexiblePageSectionInstance
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
    PageNode,
    FlexiblePageSectionAction,
    FlexiblePageSectionFab,
    FlexiblePageSectionContent,
    FlexiblePageSectionFooter,
    FlexiblePageSectionContainer,
    FlexiblePageSectionInstance
  ],
  providers: [
    PageService
  ],
  entryComponents: [
  ]
})
export class LayoutModule { }