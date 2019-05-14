import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CollaborationRoutingModule } from './collaboration-routing.module';
import { CreateComponent } from './create/create.component';

@NgModule({
  declarations: [CreateComponent],
  imports: [
    CommonModule,
    CollaborationRoutingModule
  ]
})
export class CollaborationModule { }
