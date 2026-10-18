import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MySave } from './my-save';

describe('MySave', () => {
  let component: MySave;
  let fixture: ComponentFixture<MySave>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MySave],
    }).compileComponents();

    fixture = TestBed.createComponent(MySave);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
