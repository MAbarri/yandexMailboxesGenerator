import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailboxManagementComponent } from './mailbox-management.component';

describe('MailboxManagementComponent', () => {
  let component: MailboxManagementComponent;
  let fixture: ComponentFixture<MailboxManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailboxManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailboxManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
