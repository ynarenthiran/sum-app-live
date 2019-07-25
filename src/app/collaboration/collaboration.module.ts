import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatIconModule,
  MatTableModule,
  MatButtonModule,
  MatListModule,
  MatButtonToggleModule,
  MatTooltipModule,
  MatChipsModule,
  MatRippleModule,
  MatFormFieldModule,
  MatInputModule
} from '@angular/material';

import { CollaborationRoutingModule } from './collaboration-routing.module';
import { CreateComponent } from './create/create.component';
import { CollaborationComponent } from './collaboration/collaboration.component';
import { LayoutModule } from '../layout/layout.module';
import { DialogModule } from '../dialog/dialog.module';
import { CollaborationService } from './collaboration.service';
import { MemberComponent } from './member/member.component';
import {
  DocumentComponent,
  DocumentDropArea
} from './document/document.component';
import { ListComponent } from './list/list.component';
import { ObjectModule } from '../object/object.module';
import { PostComponent } from './post/post.component';
import { MomentModule } from 'ngx-moment';
import { TextFieldModule } from '@angular/cdk/text-field';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    CreateComponent,
    CollaborationComponent,
    MemberComponent,
    DocumentComponent,
    DocumentDropArea,
    ListComponent,
    PostComponent
  ],
  imports: [
    CommonModule,
    CollaborationRoutingModule,
    LayoutModule,
    DialogModule,
    ObjectModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatListModule,
    MatButtonToggleModule,
    MatTooltipModule,
    MatRippleModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    TextFieldModule,
    FormsModule,
    MomentModule
  ],
  providers: [
    CollaborationService
  ]
})
export class CollaborationModule { }
