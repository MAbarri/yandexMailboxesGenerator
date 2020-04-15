import { Router } from '@angular/router';
import { Component, OnInit, NgZone } from '@angular/core';
import { ApiService } from './../service/api.service';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { environment } from './../../environments/environment';

@Component({
  selector: 'app-dns-management',
  templateUrl: './dns-management.component.html',
  styleUrls: ['./dns-management.component.css']
})
export class DnsManagementComponent implements OnInit {
  submitted = false;
  generatedsnform: FormGroup;
  yandexEmailsForm: FormGroup;
  yandexForm: FormGroup;
  validateDomainsForm: FormGroup;
  generatedSubdomains:any = [];
  yandexSetup:any;
  emailsSetup:any;
  domainsStatus:any;

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private apiService: ApiService) {
      this.mainForm();
    }

  ngOnInit() {
    console.log('environment', environment)
    this.domainsStatus = {};
  }

  mainForm() {
    this.generatedsnform = this.fb.group({
      domain: ['', [Validators.required]],
      subdomainCount: ['', [Validators.required]]
    })
    this.yandexForm = this.fb.group({
      apitoken: ['', [Validators.required]]
    })
    this.yandexEmailsForm = this.fb.group({
      emailCount: ['', [Validators.required]]
    })
  }

  generateDNS() {
    this.submitted = true;
    if (!this.generatedsnform.valid) {
      return false;
    } else {
      for (let i = 0; i < this.generatedsnform.value.subdomainCount; i++) {
        let alreadyCreated = true
        while (alreadyCreated) {
          let newsubdomain =this.makeid(5)+"."+this.generatedsnform.value.domain
          alreadyCreated = this.generatedSubdomains.indexOf(newsubdomain) != -1;
          if(!alreadyCreated) {
            this.generatedSubdomains.push(newsubdomain)
            alreadyCreated = false
          }
        }
      }
    }
    let group={}
    this.generatedSubdomains.forEach(domain_input=>{
      group[domain_input]=new FormControl('');
    })
    this.validateDomainsForm = new FormGroup(group);
    console.log('this.validateDomainsForm', this.validateDomainsForm)
  }
  yandexSubmit() {
    this.submitted = true;
    if (!this.generatedsnform.valid) {
      return false;
    } else {
      for (let i = 0; i < this.generatedsnform.value.subdomainCount; i++) {
        let alreadyCreated = true
        while (alreadyCreated) {
          let newsubdomain =this.makeid(5)+"."+this.generatedsnform.value.domain
          alreadyCreated = this.generatedSubdomains.indexOf(newsubdomain) != -1;
          if(!alreadyCreated) {
            this.generatedSubdomains.push(newsubdomain)
            alreadyCreated = false
          }
        }
      }
    }

  }

  validateDomainsSubmit(){
    let godaddydata = []

    for (let i = 0; i < this.generatedSubdomains.length; i++) {
      if(this.validateDomainsForm.value[this.generatedSubdomains[i]])
        godaddydata.push({
          "data": this.validateDomainsForm.value[this.generatedSubdomains[i]],
          "name": "yandex-verification",
          "type": "TXT"
        })
    }
    godaddydata.push({
      "data": "Record",
      "name": "Record",
      "type": "MX"
    })
    console.log('godaddydata', godaddydata)
    this.apiService.persisteGoDaddy(this.generatedsnform.value.domain, godaddydata).subscribe(
      (res) => {
        console.log('Employee successfully created!')
        this.emailsSetup = true;
      }, (error) => {
        console.log(error);
        this.emailsSetup = true;
      });
      let group={}
      this.generatedSubdomains.forEach(domain_input=>{
        group[domain_input]=new FormControl('');
      })
      this.yandexEmailsForm = new FormGroup(group);
      console.log('this.yandexEmailsForm', this.yandexEmailsForm)
  }
  createYandexDomain(){
    for (let i = 0; i < this.generatedSubdomains.length; i++) {
      this.apiService.createYandexDomain(this.generatedSubdomains[i]).subscribe(
        (res) => {
          console.log('Employee successfully created!')
        }, (error) => {
          console.log(error);
        });
    }
    setTimeout(()=>{
      this.getYandexDomains();
     }, 3000);
  }
  yandexEmailsSubmit(){
    for (let i = 0; i < this.generatedSubdomains.length; i++) {
      if(true || this.domainsStatus[this.generatedSubdomains[i]] && this.domainsStatus[this.generatedSubdomains[i]].isverified) {
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
  getYandexDomains(){
      this.apiService.getYandexDomains().subscribe(
        (res) => {
        this.yandexSetup = true;
          console.log('res!', res)
          for (let i = 0; i < res.data.length; i++) {
              this.domainsStatus[res.data[i].name] = {isverified: res.data[i].owned};
          }
        }, (error) => {
          console.log(error);
          this.yandexSetup = true;
        });
  }
  persisteInNameCheap(){
    console.log('persisting in name cheap')
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