import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";

import { CartFullComponent } from "./cart-full.component";

describe("CartFullComponent", () => {
  let component: CartFullComponent;
  let fixture: ComponentFixture<CartFullComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartFullComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CartFullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
