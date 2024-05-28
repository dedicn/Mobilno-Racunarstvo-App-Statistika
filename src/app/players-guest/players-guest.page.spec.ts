import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayersGuestPage } from './players-guest.page';

describe('PlayersGuestPage', () => {
  let component: PlayersGuestPage;
  let fixture: ComponentFixture<PlayersGuestPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayersGuestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
