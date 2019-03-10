import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WifiTableComponent } from './wifi-table.component';

describe('WifiTableComponent', () => {
  let component: WifiTableComponent;
  let fixture: ComponentFixture<WifiTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WifiTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WifiTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
