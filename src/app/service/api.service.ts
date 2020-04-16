import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  baseUri:string = '/backendapi/';
  goDaddyBaseUri:string = 'https://api.godaddy.com/v1/';
  yandexBaseUri:string = 'https://api.directory.yandex.net/v6/';
  yandexEmailBaseUri:string = 'https://pddimp.yandex.ru/api2/';
  headers = new HttpHeaders().set("x-debug", "true").set('Access-Control-Allow-Origin', '*').set('Content-Type', 'application/json').set('Authorization', "sso-key "+environment.godaddy.key+':'+environment.godaddy.secret);
  constructor(private http: HttpClient) { }

  // Create
  persisteGoDaddy(domain, data): Observable<any> {
    let url = `${this.goDaddyBaseUri}domains/`+domain+`/records`;
    return this.http.patch(url, data, {headers: this.headers})
      .pipe(
        catchError(this.errorMgmt)
      )
  }
  // checkAvailable
  checkAvailable(domain): Observable<any> {
    let url = `${this.goDaddyBaseUri}domains/available?domain=`+domain;
    return this.http.get(url, {headers: this.headers})
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  // Create
  createYandexDomain(domain): Observable<any> {
    let yandexheaders = new HttpHeaders().set("x-debug", "true")
      .set('Content-Type', 'application/json')
      .set('Authorization', "OAuth "+localStorage.getItem("yandexClientCode"))
      .set("X-Org-ID", environment.yandexClientID);
    let url = `${this.yandexBaseUri}domains/`;
    return this.http.post(url, {name: domain}, {headers: yandexheaders})
      .pipe(
        catchError(this.errorMgmt)
      )
  }
  // Create
  createYandexDomainEmails(data): Observable<any> {
    let yandexheaders = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('PddToken', data.pddToken);
    let url = `${this.yandexEmailBaseUri}admin/email/add`;
    return this.http.post(url, {domain: data.domain, login: data.login, password: data.password}, {headers: yandexheaders})
      .pipe(
        catchError(this.errorMgmt)
      )
  }
  // getYandexDomains
  getYandexDomains(): Observable<any> {
    let yandexheaders = new HttpHeaders().set("x-debug", "true")
      .set('Content-Type', 'application/json')
      .set('Authorization', "OAuth "+localStorage.getItem("yandexClientCode"))
      .set("X-Org-ID", environment.yandexClientID);
    let url = `${this.yandexBaseUri}domains/`;
    return this.http.get(url, {headers: yandexheaders})
      .pipe(
        catchError(this.errorMgmt)
      )
  }
  // SUBDOMAIN -----------------------------------------------------------------------------------------------


  // Create
  createMultipleSubdomain(data): Observable<any> {
    let url = `${this.baseUri}subdomain/createMultiple`;
    return this.http.post(url, {subdomains: data})
      .pipe(
        catchError(this.errorMgmt)
      )
  }
  createSubdomain(data): Observable<any> {
    let url = `${this.baseUri}subdomain/create`;
    return this.http.post(url, data)
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  // Get all subdomains
  getSubdomains() {
    return this.http.get(`${this.baseUri}subdomain`);
  }

  // Get subdomain
  getSubdomain(id): Observable<any> {
    let url = `${this.baseUri}subdomain/read/${id}`;
    return this.http.get(url, {headers: this.headers}).pipe(
      map((res: Response) => {
        return res || {}
      }),
      catchError(this.errorMgmt)
    )
  }

  // Update subdomain
  updateSubdomain(id, data): Observable<any> {
    let url = `${this.baseUri}subdomain/update/${id}`;
    return this.http.put(url, data, { headers: this.headers }).pipe(
      catchError(this.errorMgmt)
    )
  }

  // Delete subdomain
  deleteSubdomain(id): Observable<any> {
    let url = `${this.baseUri}subdomain/delete/${id}`;
    return this.http.delete(url, { headers: this.headers }).pipe(
      catchError(this.errorMgmt)
    )
  }







  // EMLPOYEE -----------------------------------------------------------------------------------------------
  // Create
  createEmployee(data): Observable<any> {
    let url = `${this.baseUri}employee/create`;
    return this.http.post(url, data)
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  // Get all employees
  getEmployees() {
    return this.http.get(`${this.baseUri}`);
  }

  // Get employee
  getEmployee(id): Observable<any> {
    let url = `${this.baseUri}employee/read/${id}`;
    return this.http.get(url, {headers: this.headers}).pipe(
      map((res: Response) => {
        return res || {}
      }),
      catchError(this.errorMgmt)
    )
  }

  // Update employee
  updateEmployee(id, data): Observable<any> {
    let url = `${this.baseUri}employee/update/${id}`;
    return this.http.put(url, data, { headers: this.headers }).pipe(
      catchError(this.errorMgmt)
    )
  }

  // Delete employee
  deleteEmployee(id): Observable<any> {
    let url = `${this.baseUri}employee/delete/${id}`;
    return this.http.delete(url, { headers: this.headers }).pipe(
      catchError(this.errorMgmt)
    )
  }

  // Error handling
  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

}
