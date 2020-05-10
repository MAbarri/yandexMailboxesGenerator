import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ApiService } from './../../../service/api.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.css']
})
export class SendEmailComponent implements OnInit {
  emailContentForm: FormGroup;
  senders: any = [];
  receivers: any = [];
  sendMailResponses: any = {};
  sendFinished: any = false;

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private apiService: ApiService) {
    this.mainForm();
  }

  ngOnInit() {
  }
  mainForm() {
    this.emailContentForm = this.fb.group({
      subject: ['', [Validators.required]],
      emailTemplate: ['', [Validators.required]]
    })
  }
  sendEmails() {
    this.apiService.sendEmails({subject: this.emailContentForm.value.subject, template: this.emailContentForm.value.emailTemplate, emails: this.senders, receivers: this.receivers}).subscribe(
      (res: any) => {
        this.sendFinished = true;
        this.sendMailResponses['responses'] = res.responses;
        this.sendMailResponses['success'] = _.filter(res.responses, function(item){ return item['status'] == "SUCCESS"}).length;
        this.sendMailResponses['login'] = _.filter(res.responses, function(item){ return item['status'] == "AUTHENTICATION"}).length;
        this.sendMailResponses['eula'] = _.filter(res.responses, function(item){ return item['status'] == "EULA"}).length;
        console.log('this.sendMailResponses', this.sendMailResponses)
      }, (error) => {
      });
  }

  uploadFile(file) {
    if (file) {
      var reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = (evt: any) => {
        let importedJson = JSON.parse(evt.target["result"])
        console.log('importedJson', importedJson)

        for (let i = 0; i < importedJson.length; i++) {
            this.senders.push(importedJson[i]);
        }
      }
      reader.onerror = function(evt) {
        console.log('error reading file');
      }
    }
    console.log('this.senders', this.senders)
  }
  deleteAttachment(index) {
    this.senders.splice(index, 1)
  }
  uploadFilereceivers(file) {
    if (file) {
      var reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = (evt: any) => {
        let importedJson = JSON.parse(evt.target["result"])
        console.log('importedJson', importedJson)

        for (let i = 0; i < importedJson.length; i++) {
            this.receivers.push(importedJson[i]);
        }
      }
      reader.onerror = function(evt) {
        console.log('error reading file');
      }
    }
    console.log('this.receivers', this.receivers)
  }
  deleteAttachmentreceivers(index) {
    this.receivers.splice(index, 1)
  }
}
