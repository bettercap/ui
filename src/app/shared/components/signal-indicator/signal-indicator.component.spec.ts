import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignalIndicatorComponent } from './signal-indicator.component';

describe('SignalIndicatorComponent', () => {
  let component: SignalIndicatorComponent;
  let fixture: ComponentFixture<SignalIndicatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignalIndicatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignalIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
