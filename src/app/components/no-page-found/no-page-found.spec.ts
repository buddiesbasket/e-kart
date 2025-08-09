import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoPageFound } from './no-page-found';

describe('NoPageFound', () => {
  let component: NoPageFound;
  let fixture: ComponentFixture<NoPageFound>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoPageFound]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoPageFound);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
