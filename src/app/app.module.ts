import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// import { EmployeeCreateComponent } from './components/employee-create/employee-create.component';
// import { EmployeeListComponent } from './components/employee-list/employee-list.component';
// import { EmployeeEditComponent } from './components/employee-edit/employee-edit.component';
// import { SettingsComponent } from './settings/settings.component';
import { ApiService } from './service/api.service';

import { HomeComponent } from './home/home.component';

import { DragDropDirective } from './directives/drag-drop.directive';


import { AdminComponent } from './components/admin/admin.component';
import { UsersManagementsComponent } from './components/admin/users-managements/users-managements.component';
import { EmployeeCreateComponent } from './components/admin/employee-create/employee-create.component';
import { EmployeeListComponent } from './components/admin/employee-list/employee-list.component';
import { EmployeeEditComponent } from './components/admin/employee-edit/employee-edit.component';
import { DnsManagementComponent } from './components/admin/dns-management/dns-management.component';
import { LoginComponent } from './components/admin/login/login.component';
import { MailboxManagementComponent } from './components/admin/mailbox-management/mailbox-management.component';
import { SettingsComponent } from './components/admin/settings/settings.component';
import { DashboardComponent } from './components/front/dashboard/dashboard.component';
import { SendEmailComponent } from './components/front/send-email/send-email.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    EmployeeCreateComponent,
    EmployeeListComponent,
    EmployeeEditComponent,
    DnsManagementComponent,
    LoginComponent,
    MailboxManagementComponent,
    DragDropDirective,
    SettingsComponent,
    UsersManagementsComponent,
    DashboardComponent,
    HomeComponent,
    SendEmailComponent
  ],
  imports: [
    NgbModule,
    NgSelectModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})

export class AppModule { }
