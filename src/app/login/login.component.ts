import { Component, OnInit } from '@angular/core';
import { environment } from './../../environments/environment';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import {Router} from "@angular/router"

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  yandexClientID:any;
  production:any;
  generateForm: FormGroup;


  constructor(
    public fb: FormBuilder,
    private router: Router
  ) {
    this.mainForm();
  }

  ngOnInit() {
    this.yandexClientID = environment.yandexClientID;
    this.production = environment.production;
  }

  mainForm() {
    this.generateForm = this.fb.group({
      resultCode: ['', [Validators.required]]
    })
  }
  generateCode(){
    if (!this.generateForm.valid) {
      return false;
    } else {
      localStorage.setItem("yandexClientCode", this.generateForm.value.resultCode);
      this.router.navigate(['/dns-management'])
    }
  }
}
