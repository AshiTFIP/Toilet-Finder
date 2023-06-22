import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditToiletComponent } from './edit-toilet.component';

describe('EditToiletComponent', () => {
  let component: EditToiletComponent;
  let fixture: ComponentFixture<EditToiletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditToiletComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditToiletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
