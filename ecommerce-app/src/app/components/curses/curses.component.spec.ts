import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";

import { CursesComponent } from "./curses.component";

describe("CursesComponent", () => {
  let component: CursesComponent;
  let fixture: ComponentFixture<CursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CursesComponent, HttpClientTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
