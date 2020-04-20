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
  addedRecordSuccess= false;
  generatedsnform: FormGroup;
  yandexEmailsForm: FormGroup;
  manualSubdomainForm: FormGroup;
  validateDomainsForm: FormGroup;
  generatedSubdomains = [];
  yandexSetup:any;
  emailsSetup:any;
  domainsStatus:any;
  files: any = [];

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
      subdomainLevels: ['', [Validators.required]],
      subdomainCount: ['', [Validators.required]]
    })
    this.manualSubdomainForm = this.fb.group({
      manualSubdomain: ['', [Validators.required]]
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
          let newsubdomain =this.makeid(5)+".";
          for (let j = 0; j < this.generatedsnform.value.subdomainLevels; j++) {
            newsubdomain +=this.makeid(5)+".";
          }
          newsubdomain+=this.generatedsnform.value.domain;
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
    console.log('this.validateDomainsForm.value', this.validateDomainsForm.value)
  }
  addManuallySubdomain() {
    this.submitted = true;
    if (!this.manualSubdomainForm.valid) {
      return false;
    } else {
      this.generatedSubdomains.push(this.manualSubdomainForm.value.manualSubdomain)
      this.manualSubdomainForm.value.manualSubdomain = "";
    }
    let group={}
    this.generatedSubdomains.forEach(domain_input=>{
      group[domain_input]=new FormControl('');
    })
    this.validateDomainsForm = new FormGroup(group);
  }

  validateDomainsSubmit(){
    let godaddydata = []

    for (let i = 0; i < this.generatedSubdomains.length; i++) {
      if(this.validateDomainsForm.value[this.generatedSubdomains[i]])
        godaddydata.push({
          "data": "yandex-verification: "+this.validateDomainsForm.value[this.generatedSubdomains[i]],
          "name": this.generatedSubdomains[i].substring(0, 5),
          "type": "TXT"
        })
        godaddydata.push({
          "data": "mx.yandex.net",
          "name": this.generatedSubdomains[i].substring(0, 5),
          "type": "MX",
          "priority": 10
        })
    }
    console.log('godaddydata', godaddydata)
    this.apiService.persisteGoDaddy(this.generatedsnform.value.domain, godaddydata).subscribe(
      (res) => {
        if(res == "") this.addedRecordSuccess = true;
        this.persisteSubdomainsInDatabse();
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
  persisteSubdomainsInDatabse(){
    let databasePersistance = [];
    for (let i = 0; i < this.generatedSubdomains.length; i++) {
        databasePersistance.push({
          "name": this.generatedSubdomains[i]
        })
    }
    this.apiService.createMultipleSubdomain(databasePersistance).subscribe(
      (res) => {
        console.log('Employee successfully created!')
      }, (error) => {
        console.log(error);
      });
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
  exportSubdomains(){
    let exportData = [];
    for (let i = 0; i < this.generatedSubdomains.length; i++) {
        exportData.push({domain: this.generatedSubdomains[i], pdd: ""});
    }
    this.apiService.exportSubdomains(exportData).subscribe(
      (res) => {
        this.apiService.downloadExportedSubdomains();
      }, (error) => {
        console.log(error);
      });
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

    uploadFile(file) {
    if (file) {
        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = (evt: any) => {
            let importedJson = JSON.parse(evt.target["result"])
            console.log('importedJson', importedJson)
            if(!this.generatedSubdomains) this.generatedSubdomains = [];
            if(!this.validateDomainsForm) {
              let group={}
              this.validateDomainsForm = new FormGroup(group);
            }
            for (let i = 0; i < importedJson.length; i++) {
                if(this.generatedSubdomains.indexOf(importedJson[i].domain) == -1) {
                  this.generatedSubdomains.push(importedJson[i].domain);
                }
            }
            console.log('this.generatedSubdomains', this.generatedSubdomains)
            let group={}
            this.generatedSubdomains.forEach(domain_input=>{
              group[domain_input]=new FormControl('');
            })
            this.validateDomainsForm = new FormGroup(group);

            for (let i = 0; i < importedJson.length; i++) {
                this.validateDomainsForm.controls[importedJson[i].domain].setValue(importedJson[i].pdd);
                // this.validateDomainsForm.value[importedJson[i].domain] = importedJson[i].pdd;
            }
            console.log('this.validateDomainsForm.value', this.validateDomainsForm.value)
        }
        reader.onerror = function (evt) {
            console.log('error reading file');
        }
    }
      console.log('this.files', this.files)
    }
    deleteAttachment(index) {
      this.files.splice(index, 1)
    }

}
