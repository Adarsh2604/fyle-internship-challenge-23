import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { GithubComponent } from './github.component';
import { ApiService } from '../services/api.service'; // Replace with the actual path
import { of } from 'rxjs';

describe('GithubComponent', () => {
  let component: GithubComponent;
  let fixture: ComponentFixture<GithubComponent>;
  let apiService: jasmine.SpyObj<ApiService>;

  beforeEach(
    waitForAsync(() => {
      const spy = jasmine.createSpyObj('ApiService', ['getUser', 'getAllRepos']);

      TestBed.configureTestingModule({
        declarations: [GithubComponent],
        imports: [FormsModule],
        providers: [{ provide: ApiService, useValue: spy }],
      }).compileComponents(); 

      apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(GithubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getUser and getAllRepos on getRepositories', () => {
    const username = 'testUser';
    const currentPage = 1;
    const selectedPerPage = 10;

    apiService.getUser.and.returnValue(of([])); // Mock the getUser method
    
    apiService.getAllRepos.and.returnValue(of([])); // Mock the getAllRepos method

    component.username = username;
    component.currentPage = currentPage;
    component.selectedPerPage = selectedPerPage;

    component.getRepositories();

    expect(apiService.getUser).toHaveBeenCalledWith(username, currentPage, selectedPerPage);
    expect(apiService.getAllRepos).toHaveBeenCalledWith(username);
  });

  // Add more tests for other methods and behaviors as needed
});
