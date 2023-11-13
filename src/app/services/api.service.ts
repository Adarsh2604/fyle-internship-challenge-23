import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getUser(githubUsername: string, page: number = 1, perPage: number = 10) {
    const params = new HttpParams()
    .set('page', page.toString())
    .set('per_page', perPage.toString());
    return this.httpClient.get(`https://api.github.com/users/${githubUsername}/repos`,{ params });
  }
  getAllRepos(githubUsername: string) {
    return this.httpClient.get(`https://api.github.com/users/${githubUsername}/repos`);
  }

}
