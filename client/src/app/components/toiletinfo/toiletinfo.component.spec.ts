import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToiletinfoComponent } from './toiletinfo.component';

describe('ToiletinfoComponent', () => {
  let component: ToiletinfoComponent;
  let fixture: ComponentFixture<ToiletinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToiletinfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToiletinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
