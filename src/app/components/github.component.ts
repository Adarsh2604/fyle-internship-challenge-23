// github.component.ts

import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service'; // Replace with the actual path
declare var Array: any;
@Component({
  selector: 'app-github',
  template: `
    <div class="container mx-auto mt-8">
      <!-- <input
        class="border p-2"
        type="text"
        [(ngModel)]="username"
        placeholder="Enter GitHub username"
      />
      <button class="bg-blue-500 text-white p-2 ml-2" (click)="getRepositories()">Get Repos</button> -->

      <!-- <div *ngIf="repositories?.length > 0" class="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div *ngFor="let repo of repositories" class="bg-white p-4 shadow rounded">
          <h3 class="text-lg font-semibold">{{ repo.name }}</h3>
          <p class="mt-2 text-gray-600">{{ repo.description }}</p>
          <div class="mt-4">
            <span
              *ngFor="let topic of repo.topics"
              class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2"
            >
              {{ topic }}
            </span>
          </div>
        </div>
      </div> -->
      <input
        class="border p-2"
        type="text"
        [(ngModel)]="username"
        placeholder="Enter GitHub username"
      />
      <button class="bg-blue-500 text-white p-2 ml-2" (click)="getRepositories()">Get Repos</button>
    <!-- Repositories list with skeleton loading -->
    <div *ngIf="loading; else content" class="skeleton-loading">
      <ng-container *ngFor="let _ of skeletonArray()">
        <div class="bg-gray-200 p-4 shadow rounded animate-pulse mb-2">
          <h3 class="text-lg font-semibold">&nbsp;</h3>
          <p class="mt-2 text-gray-600">&nbsp;</p>
          <div class="mt-4">
            <span
              *ngFor="let _ of skeletonArray()"
              class="inline-block bg-gray-300 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2"
            >
              &nbsp;
            </span>
          </div>
        </div>
      </ng-container>
    </div>
      <ng-template #content>
        <!-- Actual repositories content -->
        <div *ngIf="repositories?.length > 0" class="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div *ngFor="let repo of repositories" class="bg-white p-4 shadow rounded">
            <h3 class="text-lg font-semibold">{{ repo.name }}</h3>
            <p class="mt-2 text-gray-600">{{ repo.description }}</p>
            <div class="mt-4">
              <span
                *ngFor="let topic of repo.topics"
                class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2"
              >
                {{ topic }}
              </span>
            </div>
          </div>
        </div>
      </ng-template>

      <!-- Pagination -->
      <div class="mt-4 flex items-center">
      <button
        class="bg-blue-500 text-white p-2 mr-2"
        [disabled]="currentPage === 1"
        (click)="changePage(currentPage - 1)"
      >
        Prev
      </button>
      <button
        *ngFor="let pageNum of pageNumbers"
        class="bg-blue-500 text-white p-2 mr-2"
        [class.font-semibold]="pageNum === currentPage"
        (click)="changePage(pageNum)"
      >
        {{ pageNum }}
      </button>
      <button
        class="bg-blue-500 text-white p-2"
        [disabled]="currentPage === pageNumbers.length"
        (click)="changePage(currentPage + 1)"
      >
        Next
      </button>
      <div class="ml-4">
        <span>Show per page:</span>
        <select [(ngModel)]="selectedPerPage" (change)="changePerPage()">
          <option *ngFor="let option of repositoriesPerPageOptions" [value]="option">{{ option }}</option>
        </select>
      </div>
      <div class="ml-4">
        <span>Go to page:</span>
        <input type="number" [(ngModel)]="goToPage" />
        <button class="bg-blue-500 text-white p-2 ml-2" (click)="goToSpecificPage()">Go</button>
      </div>
    </div>
  `,
  styles: [`
  .skeleton-loading {
    display: flex;
    flex-direction: column;
  }
  .animate-pulse {
    animation: pulse 1.5s infinite;
  }
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
  }
`],
})
export class GithubComponent implements OnInit {
  @Input() username: string = '';
  loading: boolean = false;
  repositories: any;
  AllRepositories: any;
  currentPage: number = 1;
  repositoriesPerPageOptions: number[] = [10, 25, 50, 100];
  selectedPerPage: number = 10;
  pageNumbers: number[] = [];
  goToPage: number | undefined;
  skeletonArray(): any[] {
    const array = [];
    for (let i = 0; i < this.selectedPerPage; i++) {
      array.push(i);
    }
    return array;
  }
  constructor(private ApiService: ApiService) {}

  ngOnInit() {
    // You can initialize any properties or make API calls on component initialization if needed
  }
  changePage(page: number) {
    console.log("Current page:-",page)
    if (page >= 1 && page <= this.pageNumbers?.length) {
      this.currentPage = page;
      this.getRepositories();
    }
  }

  changePerPage() {
    this.currentPage = 1;
    this.getRepositories();
  }

  goToSpecificPage() {
    if (this.goToPage && this.goToPage >= 1 && this.goToPage <= this.pageNumbers?.length) {
      this.currentPage = this.goToPage;
      this.getRepositories();
    }
  }

  getRepositories() {
    this.loading = true;
    if (this.username) {
      this.ApiService
        .getUser(this.username, this.currentPage, this.selectedPerPage)
        .subscribe(
          (data) => {
            console.log(data)
            this.repositories = data;
            this.calculatePageNumbers();
            this.loading=false;
          },
          (error) => {
            this.loading = false;
            console.error('Error fetching repositories:', error);
          }
        );
    }
    if (this.username) {
      this.ApiService
        .getAllRepos(this.username)
        .subscribe(
          (data) => {
            console.log(data)
            this.AllRepositories = data
            this.calculatePageNumbers();
          },
          (error) => {
            console.error('Error fetching repositories:', error);
          }
        );
    }
  }



  private calculatePageNumbers() {
    // Calculate total pages based on the number of repositories and repositories per page
    const totalPages = Math.ceil(this.AllRepositories?.length / this.selectedPerPage);
    this.pageNumbers = Array.from({ length: totalPages }, (_:any, i:number) => i + 1);
  }
}
