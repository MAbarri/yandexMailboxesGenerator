import { Component, OnInit } from '@angular/core';
import { ApiService } from './../service/api.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-users-managements',
  templateUrl: './users-managements.component.html',
  styleUrls: ['./users-managements.component.css']
})
export class UsersManagementsComponent implements OnInit {
  files: any = [];
  subdomains: any = [];
  selectedSubdomain: any;
  selectedSubdomainPDD: any;
  created = 0;
  total = 0;
  loaded = false;

  constructor( private apiService: ApiService) {
    this.getAllSubdomains();
   }

  ngOnInit() {
  }

  getAllSubdomains(){
    this.apiService.getSubdomains().subscribe((data) => {
     this.subdomains = data;
     this.loaded = true;
    })
  }
  exportUsers(){
    this.apiService.exportUsers(this.selectedSubdomain);
  }

    uploadFile(file) {
    if (file) {
        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = (evt: any) => {
            let importedJson = evt.target["result"]
            console.log('importedJson', importedJson)
            var allTextLines = importedJson.split(/\r\n|\n/);
            this.total = allTextLines.length-2;
            for (let i = 1; i < allTextLines.length; i++) {
              let requestParams = {};
              let breakedLine = allTextLines[i].split(',')
              requestParams['domain'] = breakedLine[0].split('@')[1];
              requestParams['login'] = breakedLine[0];
              requestParams['password'] = breakedLine[1];
              requestParams['iname'] = breakedLine[2];
              requestParams['fname'] = breakedLine[3];
              requestParams['birth_date'] = breakedLine[4];
              requestParams['sex'] = breakedLine[5];
              if(requestParams['login'] && requestParams['password']) {
                this.apiService.fillYandexDomainUserData({pddToken: this.selectedSubdomainPDD, content: requestParams}).subscribe(
                  (res) => {
                    console.log('success')
                    this.created ++;
                  }, (error) => {
                    console.log(error);
                  });
              }
            }
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
