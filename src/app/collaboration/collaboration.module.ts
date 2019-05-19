import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatIconModule,
  MatTableModule,
  MatButtonModule,
  MatListModule,
  MatButtonToggleModule,
  MatTooltipModule
} from '@angular/material';

import { CollaborationRoutingModule } from './collaboration-routing.module';
import { CreateComponent } from './create/create.component';
import { CollaborationComponent } from './collaboration/collaboration.component';
import { LayoutModule } from '../layout/layout.module';
import { DialogModule } from '../dialog/dialog.module';
import { CollaborationService } from './collaboration.service';
import { MemberComponent } from './member/member.component';
import { DocumentComponent, DocumentBreadcrumbs, DocumentDropArea } from './document/document.component';

@NgModule({
  declarations: [
    CreateComponent,
    CollaborationComponent,
    MemberComponent,
    DocumentComponent,
    DocumentBreadcrumbs,
    DocumentDropArea
  ],
  imports: [
    CommonModule,
    CollaborationRoutingModule,
    LayoutModule,
    DialogModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatListModule,
    MatButtonToggleModule,
    MatTooltipModule
  ],
  providers: [
    CollaborationService
  ]
})
export class CollaborationModule { }
