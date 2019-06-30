import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './authentication/auth.guard';
import { TestComponent } from './test/test.component';
import { ShellComponent } from './shell/shell.component';

const routes: Routes = [
  { path: 'auth', loadChildren: './authentication/authentication.module#AuthenticationModule' },
  {
    path: '', component: ShellComponent, canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' },
      { path: 'collaboration', loadChildren: './collaboration/collaboration.module#CollaborationModule' },
      { path: 'configuration', loadChildren: './configuration/configuration.module#ConfigurationModule' }
    ]
  },
  { path: 'test', component: TestComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
