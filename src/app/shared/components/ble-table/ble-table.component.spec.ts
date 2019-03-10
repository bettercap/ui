import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BleTableComponent } from './ble-table.component';

describe('BleTableComponent', () => {
  let component: BleTableComponent;
  let fixture: ComponentFixture<BleTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BleTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BleTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
