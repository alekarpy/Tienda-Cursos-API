import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectordetemasComponent } from './selectordetemas.component';

describe('SelectordetemasComponent', () => {
  let component: SelectordetemasComponent;
  let fixture: ComponentFixture<SelectordetemasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectordetemasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectordetemasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
