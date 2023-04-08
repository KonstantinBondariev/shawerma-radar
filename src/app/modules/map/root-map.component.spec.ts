import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RootMapComponent } from './root-map.component';

describe('MapComponent', () => {
  let component: RootMapComponent;
  let fixture: ComponentFixture<RootMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RootMapComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RootMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
