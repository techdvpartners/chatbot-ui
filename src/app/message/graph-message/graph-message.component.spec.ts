import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphMessageComponent } from './graph-message.component';

describe('GraphMessageComponent', () => {
  let component: GraphMessageComponent;
  let fixture: ComponentFixture<GraphMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
