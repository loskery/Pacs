import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDiagnoseComponent } from './modal-diagnose.component';

describe('ModalDiagnoseComponent', () => {
  let component: ModalDiagnoseComponent;
  let fixture: ComponentFixture<ModalDiagnoseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDiagnoseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDiagnoseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
