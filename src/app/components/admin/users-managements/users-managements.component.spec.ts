import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersManagementsComponent } from './users-managements.component';

describe('UsersManagementsComponent', () => {
  let component: UsersManagementsComponent;
  let fixture: ComponentFixture<UsersManagementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersManagementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersManagementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
