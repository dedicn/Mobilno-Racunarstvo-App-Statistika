import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminPlayersPage } from './admin-players.page';

describe('AdminPlayersPage', () => {
  let component: AdminPlayersPage;
  let fixture: ComponentFixture<AdminPlayersPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPlayersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
