import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateComponent } from './create/create.component';
import { CollaborationComponent } from './collaboration/collaboration.component';
import { MemberComponent } from './member/member.component';
import { DocumentComponent } from './document/document.component';
import { ListComponent } from './list/list.component';
import { PostComponent } from './post/post.component';
import { TestComponent } from './test/test.component';

const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: ListComponent },
  { path: 'create', component: CreateComponent },
  { path: 'test', component: TestComponent },
  {
    path: ':id', component: CollaborationComponent,
    children: [
      { path: 'members', component: MemberComponent },
      { path: 'documents', component: DocumentComponent },
      { path: 'posts', component: PostComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollaborationRoutingModule { }
