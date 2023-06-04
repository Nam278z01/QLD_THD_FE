import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointTypeManagementComponent } from './point-type-management.component';

describe('PointTypeManagementComponent', () => {
  let component: PointTypeManagementComponent;
  let fixture: ComponentFixture<PointTypeManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PointTypeManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PointTypeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
