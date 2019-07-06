import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { FormComponent } from './form/form.component';
import { ListComponent } from './list/list.component';

const routes: Routes = [
  {
    path: '', component: MainComponent,
    children: [
      { path: '', redirectTo: 'collaborationTypes', pathMatch: 'full' },
      {
        path: 'collaborationTypes',
        data: { title: 'Collaboration Types', fields: { name: 'Name', description: 'Description' } },
        children: [
          { path: '', component: ListComponent, pathMatch: 'full' },
          {
            path: ':typeId',
            children: [
              { path: '', component: FormComponent, pathMatch: 'full' },
              {
                path: 'caseModels',
                data: { title: 'Case Models', fields: { name: 'Name', description: 'Description' } },
                children: [
                  { path: '', component: ListComponent, pathMatch: 'full' },
                  {
                    path: ':modelId',
                    children: [
                      { path: '', component: FormComponent, pathMatch: 'full' }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        path: 'caseModels',
        data: { title: 'Case Models', fields: { name: 'Name', description: 'Description' } },
        children: [
          { path: '', component: ListComponent, pathMatch: 'full' },
          {
            path: ':modelId',
            children: [
              { path: '', component: FormComponent, pathMatch: 'full' }
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
