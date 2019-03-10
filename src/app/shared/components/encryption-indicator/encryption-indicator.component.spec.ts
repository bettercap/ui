import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EncryptionIndicatorComponent } from './encryption-indicator.component';

describe('EncryptionIndicatorComponent', () => {
  let component: EncryptionIndicatorComponent;
  let fixture: ComponentFixture<EncryptionIndicatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EncryptionIndicatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EncryptionIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
