import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayersHomePage } from './players-home.page';

describe('PlayersHomePage', () => {
  let component: PlayersHomePage;
  let fixture: ComponentFixture<PlayersHomePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayersHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
