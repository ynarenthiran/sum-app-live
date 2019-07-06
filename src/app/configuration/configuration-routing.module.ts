import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { FormComponent } from './form/form.component';
import { ListComponent } from './list/list.component';

const routes: Routes = [
  {
    path: '', component: MainComponent,
    children: [
      { path: 'form', component: FormComponent },
      { path: 'list', component: ListComponent }
    ]
  },
  {
    path: 'test',
    children: [
      {
        path: 'collaborationTypes',
        children: [
          { path: 'list', component: ListComponent },
          {
            path: ':id',
            children: [
              { path: 'form', component: FormComponent },
              {
                path: 'caseModels',
                children: [
                  { path: 'list', component: ListComponent }
                ]
              }
            ]
          }
        ]
      },
      {
        path: 'caseModels',
        children: [
          { path: 'list', component: ListComponent },
          {
            path: ':id',
            children: [
              { path: 'form', component: FormComponent }
            ]
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationRoutingModule { }
