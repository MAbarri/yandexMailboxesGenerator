import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { ApiService } from './service/api.service';
import { DragDropDirective } from './directives/drag-drop.directive';

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

@NgModule({
  declarations: [
    AppComponent,
    EmployeeCreateComponent,
    EmployeeListComponent,
    EmployeeEditComponent,
    DnsManagementComponent,
    LoginComponent,
    MailboxManagementComponent,
    DragDropDirective,
    SettingsComponent,
    DashboardComponent,
    HomeComponent,
    SendEmailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})

export class AppModule { }
