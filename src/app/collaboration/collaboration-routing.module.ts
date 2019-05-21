import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateComponent } from './create/create.component';
import { CollaborationComponent } from './collaboration/collaboration.component';
import { MemberComponent } from './member/member.component';
import { DocumentComponent, DocumentDetail } from './document/document.component';

const routes: Routes = [
  { path: 'create', component: CreateComponent },
  {
    path: ':id', component: CollaborationComponent,
    children: [
      { path: 'members', component: MemberComponent },
      { path: 'documents', component: DocumentComponent },
      { path: 'documentDetails/:fileid', component: DocumentDetail, outlet: 'detail' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollaborationRoutingModule { }
