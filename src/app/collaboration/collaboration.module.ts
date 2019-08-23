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
  MatInputModule,
  MatSnackBarModule
} from '@angular/material';

import { CollaborationRoutingModule } from './collaboration-routing.module';
import { CreateComponent } from './create/create.component';
import { LayoutModule } from '../layout/layout.module';
import { DialogModule } from '../dialog/dialog.module';
import { CollaborationService } from './collaboration.service';
import {
  DocumentComponent,
  DocumentDropArea
} from './document/document.component';
import { ListComponent } from './list/list.component';
import { ObjectModule } from '../object/object.module';
import { MomentModule } from 'ngx-moment';
import { TextFieldModule } from '@angular/cdk/text-field';
import { FormsModule } from '@angular/forms';
import { CollaborationComponent } from './collaboration.component';
import { GenericDataReader } from './util/common';
import { ComponentTable, ComponentList, ComponentListTemplate } from './components/components';

@NgModule({
  declarations: [
    CreateComponent,
    CollaborationComponent,
    DocumentComponent,
    DocumentDropArea,
    ListComponent,
    ComponentTable,
    ComponentList,
    ComponentListTemplate
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
    MatSnackBarModule,
    TextFieldModule,
    FormsModule,
    MomentModule
  ],
  providers: [
    CollaborationService,
    GenericDataReader
  ]
})
export class CollaborationModule { }
