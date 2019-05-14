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
  PageContent
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
    PageContent
  ],
  exports: [
    PageComponent,
    PageSection,
    PageTitle,
    PageContent
  ],
  providers: [
  ],
  entryComponents: [
  ]
})
export class LayoutModule { }