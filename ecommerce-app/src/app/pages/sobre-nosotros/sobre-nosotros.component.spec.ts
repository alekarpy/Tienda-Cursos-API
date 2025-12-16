import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";

import { SobreNosotrosComponent } from "./sobre-nosotros.component";

describe("SobreNosotrosComponent", () => {
  let component: SobreNosotrosComponent;
  let fixture: ComponentFixture<SobreNosotrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SobreNosotrosComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SobreNosotrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
