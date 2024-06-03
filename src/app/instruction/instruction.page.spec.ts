import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InstructionPage } from './instruction.page';

describe('InstructionPage', () => {
  let component: InstructionPage;
  let fixture: ComponentFixture<InstructionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
