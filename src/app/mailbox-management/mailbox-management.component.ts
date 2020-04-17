import { Router } from '@angular/router';
import { Component, OnInit, NgZone } from '@angular/core';
import { ApiService } from './../service/api.service';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { environment } from './../../environments/environment';

@Component({
  selector: 'app-mailbox-management',
  templateUrl: './mailbox-management.component.html',
  styleUrls: ['./mailbox-management.component.css']
})
export class MailboxManagementComponent implements OnInit {
  loaded = false;
  yandexEmailsForm: FormGroup;
  yandexForm: FormGroup;
  validateDomainsForm: FormGroup;
  generatedSubdomains:any = [];
  subdomains:any = [];
  yandexSetup:any;
  emailsSetup:any;
  domainsStatus:any;

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private apiService: ApiService) {
      this.getAllSubdomains();
      // this.mainForm();
    }

  ngOnInit() {
    console.log('environment', environment)
    this.domainsStatus = {};
  }

  mainForm() {
  }
  getAllSubdomains(){
    this.apiService.getSubdomains().subscribe((data) => {
     this.subdomains = data;
     for (let i = 0; i < this.subdomains.length; i++) {
         this.generatedSubdomains.push(this.subdomains[i].name);
     }
     this.yandexForm = this.fb.group({
       apitoken: ['', [Validators.required]]
     })
     let group={}
     this.generatedSubdomains.forEach(domain_input=>{
       group[domain_input]=new FormControl('');
     })
     this.yandexEmailsForm = new FormGroup(group);
     this.loaded = true;
    })
  }
  yandexEmailsSubmit(){
    for (let i = 0; i < this.generatedSubdomains.length; i++) {
      if(this.yandexEmailsForm.value[this.generatedSubdomains[i]]) {
        let requestData = {pddToken : this.yandexEmailsForm.value[this.generatedSubdomains[i]], domain: this.generatedSubdomains[i], login: this.makeid(6), password: this.makeid(10)}
        console.log('requestData', requestData)
        this.apiService.createYandexDomainEmails(requestData).subscribe(
          (res) => {
            console.log('Employee successfully created!')
          }, (error) => {
            console.log(error);
          });
      }
    }
  }
  makeid(length) {
     var result           = '';
     var characters       = 'abcdefghijklmnopqrstuvwxyz0123456789'
     var charactersLength = characters.length
     for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
     }
     return result
  }

}
