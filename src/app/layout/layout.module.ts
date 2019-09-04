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
import { DragDropModule } from '@angular/cdk/drag-drop';
import { GridsterModule } from 'angular2gridster';

import {
  PageComponent,
  PageBasicComponent,
  PageSection,
  PageSectionContent,
  PageSectionToolbar,
  PageSectionDetail,
  PageSectionDefinition,
  PageService,
  PageTreeComponent,
  PageNode,
  PageHeader,
  PageContent,
  PageSidebarContent,
  PageSidebarHeader
} from './page.component';
import {
  FlexiblePageComponent, FlexiblePageSection, FlexiblePageSectionAction
} from './page2.component';
import { DialogModule } from '../dialog/dialog.module';
import { UIModule } from '../ui/ui.module';
import { DragulaModule } from 'ng2-dragula';

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
    DragulaModule,
    GridsterModule,
    DialogModule,
    UIModule
  ],
  declarations: [
    PageComponent,
    FlexiblePageComponent,
    PageBasicComponent,
    PageContent,
    PageSidebarContent,
    PageSidebarHeader,
    PageTreeComponent,
    PageHeader,
    PageSection,
    FlexiblePageSection,
    PageSectionDefinition,
    PageSectionContent,
    PageSectionToolbar,
    PageSectionDetail,
    PageNode,
    FlexiblePageSectionAction
  ],
  exports: [
    PageComponent,
    PageBasicComponent,
    PageContent,
    PageSidebarContent,
    PageSidebarHeader,
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
    FlexiblePageSectionAction
  ],
  providers: [
    PageService
  ],
  entryComponents: [
  ]
})
export class LayoutModule { }