import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminTeamsPage } from './admin-teams.page';

describe('AdminTeamsPage', () => {
  let component: AdminTeamsPage;
  let fixture: ComponentFixture<AdminTeamsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTeamsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
