import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDonerFormComponent } from './new-doner-form.component';

describe('NewDonerFormComponent', () => {
  let component: NewDonerFormComponent;
  let fixture: ComponentFixture<NewDonerFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewDonerFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewDonerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
