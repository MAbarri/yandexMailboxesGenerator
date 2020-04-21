import { Component, OnInit } from '@angular/core';
import { environment } from './../../environments/environment';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import {Router} from "@angular/router"

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  settingsForm: FormGroup;

  constructor(
    public fb: FormBuilder,
    private router: Router) {
    this.mainForm();
   }

  ngOnInit() {
  }

  mainForm() {
    this.settingsForm = this.fb.group({
      apikey: ['', [Validators.required]],
      apisecret: ['', [Validators.required]]
    })
    this.settingsForm.controls["apikey"].setValue(localStorage.getItem("godaddyKey") ? localStorage.getItem("godaddyKey") : environment.godaddy.key);
    this.settingsForm.controls["apisecret"].setValue(localStorage.getItem("godaddySecret") ? localStorage.getItem("godaddySecret") : environment.godaddy.secret);
  }
  saveSettings(){
    if (!this.settingsForm.valid) {
      return false;
    } else {
      localStorage.setItem("godaddyKey", this.settingsForm.value.apikey);
      localStorage.setItem("godaddySecret", this.settingsForm.value.apisecret);
      this.router.navigate(['/dns-management'])
    }
  }
}
