import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCoordinatesComponent } from './select-coordinates.component';

describe('SelectCoordinatesComponent', () => {
  let component: SelectCoordinatesComponent;
  let fixture: ComponentFixture<SelectCoordinatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectCoordinatesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectCoordinatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
