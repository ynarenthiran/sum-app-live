import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateComponent } from './create/create.component';
import { CollaborationComponent } from './collaboration/collaboration.component';

const routes: Routes = [
  { path: 'create', component: CreateComponent },
  { path: ':id', component: CollaborationComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollaborationRoutingModule { }
