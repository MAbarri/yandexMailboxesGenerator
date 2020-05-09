import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import { EmployeeCreateComponent } from './components/employee-create/employee-create.component';
// import { EmployeeListComponent } from './components/employee-list/employee-list.component';
// import { EmployeeEditComponent } from './components/employee-edit/employee-edit.component';
// import { DnsManagementComponent } from './dns-management/dns-management.component';
// import { LoginComponent } from './login/login.component';
// import { SettingsComponent } from './settings/settings.component';
// import { MailboxManagementComponent } from './mailbox-management/mailbox-management.component';

import { UsersManagementsComponent } from './components/admin/users-managements/users-managements.component';
import { HomeComponent } from './home/home.component';
import { EmployeeCreateComponent } from './components/admin/employee-create/employee-create.component';
import { EmployeeListComponent } from './components/admin/employee-list/employee-list.component';
import { EmployeeEditComponent } from './components/admin/employee-edit/employee-edit.component';
import { DnsManagementComponent } from './components/admin/dns-management/dns-management.component';
import { LoginComponent } from './components/admin/login/login.component';
import { MailboxManagementComponent } from './components/admin/mailbox-management/mailbox-management.component';
import { SettingsComponent } from './components/admin/settings/settings.component';
import { DashboardComponent } from './components/front/dashboard/dashboard.component';
import { SendEmailComponent } from './components/front/send-email/send-email.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'HomeComponent' },
  // { path: 'create-employee', component: EmployeeCreateComponent },
  // { path: 'edit-employee/:id', component: EmployeeEditComponent },
  // { path: 'employees-list', component: EmployeeListComponent },
  { path: 'home', component: HomeComponent },
  { path: 'dns-management', component: DnsManagementComponent },
  { path: 'mailbox-management', component: MailboxManagementComponent },
  { path: 'login', component: LoginComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'users', component: UsersManagementsComponent },
  { path: 'sendEmail', component: SendEmailComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
