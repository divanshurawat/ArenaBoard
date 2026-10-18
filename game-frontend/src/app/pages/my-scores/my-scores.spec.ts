import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyScores } from './my-scores';

describe('MyScores', () => {
  let component: MyScores;
  let fixture: ComponentFixture<MyScores>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyScores],
    }).compileComponents();

    fixture = TestBed.createComponent(MyScores);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
