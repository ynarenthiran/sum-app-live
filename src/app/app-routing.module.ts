import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './authentication/auth.guard';
import { ShellComponent } from './shell/shell.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

const routes: Routes = [
  { path: 'auth', loadChildren: './authentication/authentication.module#AuthenticationModule' },
  {
    path: '', component: ShellComponent, canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', data: { title: 'Dashboard' }, loadChildren: './dashboard/dashboard.module#DashboardModule' },
      { path: 'collaboration', data: { title: 'Collaborations' }, loadChildren: './collaboration/collaboration.module#CollaborationModule' },
      { path: 'configuration', data: { title: 'Configuration' }, loadChildren: './configuration/configuration.module#ConfigurationModule' },
      { path: 'user', data: { title: 'User Profile' }, component: UserProfileComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
