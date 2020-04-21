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
  goDaddyBaseUri:string = '/v1/';
  yandexBaseUri:string = '/v6/';
  yandexEmailBaseUri:string = '/api2/';
  headers = new HttpHeaders().set("x-debug", "true").set('Access-Control-Allow-Origin', '*').set('Content-Type', 'application/json').set('Authorization', "sso-key "+localStorage.getItem("godaddyKey")+':'+localStorage.getItem("godaddySecret"));
  constructor(private http: HttpClient) { }

  // Create
  persisteGoDaddy(domain, data): Observable<any> {

    let url = `${this.baseUri}makeExternalCall`;
    // let url = `${this.yandexBaseUri}domains/`;
    let requestheaders = { 'Content-Type': 'application/json', 'Authorization': "sso-key "+localStorage.getItem("godaddyKey")+':'+localStorage.getItem("godaddySecret")}
    let requestbody = {
        host:"api.godaddy.com",
        path:`${this.goDaddyBaseUri}domains/`+domain+`/records`,
        method:"PATCH",
        headers:requestheaders,
        body:data
    }

    return this.http.post(url, requestbody)
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
      let url = `${this.baseUri}createMultipleMailboxs`;
      // let url = `${this.yandexBaseUri}domains/`;
      let requestheaders = { 'Content-Type': 'application/json', 'PddToken': data.pddToken}
      let requestbody = {
        host:"pddimp.yandex.ru",
        path:`${this.yandexEmailBaseUri}admin/email/add`,
        method:"POST",
        headers:requestheaders,
        body: {domain: data.domain, login: data.login, password: data.password},
        paramstype: "querystring"
      }
      console.log('requestbody', requestbody)
      return this.http.post(url, requestbody)
      .pipe(
        catchError(this.errorMgmt)
      )

  }
  // Create
  createSubdomainsOrganizations(domain, pdd): Observable<any> {
      let url = `${this.baseUri}makeExternalCall`;
      // let url = `${this.yandexBaseUri}domains/`;
      let requestheaders = { 'Content-Type': 'application/json', 'PddToken': pdd}
      let requestbody = {
        host:"pddimp.yandex.ru",
        path:`${this.yandexEmailBaseUri}admin/domain/register`,
        method:"POST",
        headers:requestheaders,
        body: {domain: domain},
        paramstype: "querystring"
      }
      console.log('requestbody', requestbody)
      return this.http.post(url, requestbody)
      .pipe(
        catchError(this.errorMgmt)
      )

  }
  // getYandexDomains
  getYandexDomains(pdd): Observable<any> {

    let url = `${this.baseUri}makeExternalCall`;
    // let url = `${this.yandexBaseUri}domains/`;
    let requestheaders = { 'Content-Type': 'application/json', 'PddToken': pdd}
    let requestbody = {
        host:"pddimp.yandex.ru",
        path:"/api2/admin/domain/domains",
        method:"GET",
        headers:requestheaders,
        body:undefined
    }

    return this.http.post(url, requestbody)
      .pipe(
        catchError(this.errorMgmt)
      )
  }
  // SUBDOMAIN -----------------------------------------------------------------------------------------------


  // geneateCSV
    // Get all subdomains
    exportExistingUsers() {
      window.open(`${this.baseUri}exportExistingUsers`)
    }
    downloadExportedSubdomains() {
      window.open(`${this.baseUri}downloadExportedSubdomains`)
    }
    // Get all subdomains
    exportSubdomains(data) {
      let url = `${this.baseUri}exportSubdomains`;
      return this.http.post(url, {data: data})
        .pipe(
          catchError(this.errorMgmt)
        )
    }
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
