import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrequencyIndicatorComponent } from './frequency-indicator.component';

describe('FrequencyIndicatorComponent', () => {
  let component: FrequencyIndicatorComponent;
  let fixture: ComponentFixture<FrequencyIndicatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrequencyIndicatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrequencyIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
