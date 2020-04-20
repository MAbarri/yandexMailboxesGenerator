import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmployeeCreateComponent } from './components/employee-create/employee-create.component';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { EmployeeEditComponent } from './components/employee-edit/employee-edit.component';
import { DnsManagementComponent } from './dns-management/dns-management.component';
import { LoginComponent } from './login/login.component';
import { MailboxManagementComponent } from './mailbox-management/mailbox-management.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dns-management' },
  // { path: 'create-employee', component: EmployeeCreateComponent },
  // { path: 'edit-employee/:id', component: EmployeeEditComponent },
  // { path: 'employees-list', component: EmployeeListComponent },
  { path: 'dns-management', component: DnsManagementComponent },
  { path: 'mailbox-management', component: MailboxManagementComponent },
  { path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
