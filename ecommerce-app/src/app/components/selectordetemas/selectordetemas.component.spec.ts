import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Renderer2 } from "@angular/core";

import { TemaSelectorComponent } from "./selectordetemas.component";

describe("TemaSelectorComponent", () => {
  let component: TemaSelectorComponent;
  let fixture: ComponentFixture<TemaSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemaSelectorComponent],
      providers: [Renderer2],
    }).compileComponents();

    fixture = TestBed.createComponent(TemaSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
