import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitScore } from './submit-score';

describe('SubmitScore', () => {
  let component: SubmitScore;
  let fixture: ComponentFixture<SubmitScore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmitScore],
    }).compileComponents();

    fixture = TestBed.createComponent(SubmitScore);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
