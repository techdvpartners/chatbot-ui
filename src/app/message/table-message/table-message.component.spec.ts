import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableMessageComponent } from './table-message.component';

describe('TableMessageComponent', () => {
  let component: TableMessageComponent;
  let fixture: ComponentFixture<TableMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
