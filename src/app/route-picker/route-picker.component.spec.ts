import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoutesService } from '../services/routes.service';

import { RoutePickerComponent } from './route-picker.component';

describe('RoutePickerComponent', () => {
  let component: RoutePickerComponent;
  let fixture: ComponentFixture<RoutePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoutePickerComponent ],
      imports: [HttpClientTestingModule],
      providers: [RoutesService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
