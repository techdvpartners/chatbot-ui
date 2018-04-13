import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalviewComponent } from './modalview.component';

describe('ModalviewComponent', () => {
  let component: ModalviewComponent;
  let fixture: ComponentFixture<ModalviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
