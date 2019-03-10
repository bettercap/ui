import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LanTableComponent } from './lan-table.component';

describe('LanTableComponent', () => {
  let component: LanTableComponent;
  let fixture: ComponentFixture<LanTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LanTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LanTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
