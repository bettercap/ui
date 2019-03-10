import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewContainerComponent } from './view-container.component';

describe('ViewContainerComponent', () => {
  let component: ViewContainerComponent;
  let fixture: ComponentFixture<ViewContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
