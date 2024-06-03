import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OverallStatsPage } from './overall-stats.page';

describe('OverallStatsPage', () => {
  let component: OverallStatsPage;
  let fixture: ComponentFixture<OverallStatsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OverallStatsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
