import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateComponent } from './create/create.component';
import { DocumentComponent } from './document/document.component';
import { ListComponent } from './list/list.component';
import { CollaborationComponent } from './collaboration.component';

const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: ListComponent },
  { path: 'create', component: CreateComponent },
  {
    path: ':id', component: CollaborationComponent,
    /*children: [
      { path: 'members', component: MemberComponent },
      { path: 'documents', component: DocumentComponent },
      { path: 'posts', component: PostComponent }
    ]*/
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollaborationRoutingModule { }
