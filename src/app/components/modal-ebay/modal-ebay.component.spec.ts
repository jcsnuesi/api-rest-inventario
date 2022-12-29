import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEbayComponent } from './modal-ebay.component';

describe('ModalEbayComponent', () => {
  let component: ModalEbayComponent;
  let fixture: ComponentFixture<ModalEbayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalEbayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEbayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
