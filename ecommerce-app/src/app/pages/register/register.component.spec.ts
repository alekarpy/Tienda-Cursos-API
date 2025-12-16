import { ComponentFixture, TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { Router } from "@angular/router";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { RegisterComponent } from "./register.component";
import { environment } from "../../../environments/environment";
import { fakeAsync, tick } from "@angular/core/testing";

describe("RegisterComponent", () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let httpMock: HttpTestingController;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj("Router", ["navigate"]);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, HttpClientTestingModule],
      providers: [{ provide: Router, useValue: routerSpy }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    // No llamar detectChanges() para evitar errores de router
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  afterEach(() => {
    if (httpMock) {
      httpMock.verify();
    }
    localStorage.clear();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  // Prueba 1: Validación de username - debe validar username válido
  it("should validate username correctly when username is valid", () => {
    component.username = "testuser123";
    const result = component.validateUsername();

    expect(result).toBe(true);
    expect(component.usernameError).toBe("");
  });

  // Prueba 2: Validación de username - debe rechazar username muy corto
  it("should reject username shorter than 3 characters", () => {
    component.username = "ab";
    const result = component.validateUsername();

    expect(result).toBe(false);
    expect(component.usernameError).toBe(
      "El usuario debe tener al menos 3 caracteres"
    );
  });

  // Prueba 3: Validación de username - debe rechazar caracteres especiales
  it("should reject username with special characters", () => {
    component.username = "test-user!";
    const result = component.validateUsername();

    expect(result).toBe(false);
    expect(component.usernameError).toBe(
      "El usuario solo puede contener letras y números"
    );
  });

  // Prueba 4: Validación de email - debe validar email válido
  it("should validate email correctly when email is valid", () => {
    component.email = "test@example.com";
    const result = component.validateEmail();

    expect(result).toBe(true);
    expect(component.emailError).toBe("");
  });

  // Prueba 5: Validación de email - debe rechazar email inválido
  it("should reject invalid email format", () => {
    component.email = "invalid-email";
    const result = component.validateEmail();

    expect(result).toBe(false);
    expect(component.emailError).toBe("Por favor ingresa un email válido");
  });

  // Prueba 6: Validación de password - debe validar password válido
  it("should validate password correctly when password is valid", () => {
    component.password = "password123";
    const result = component.validatePassword();

    expect(result).toBe(true);
    expect(component.passwordError).toBe("");
  });

  // Prueba 7: Validación de password - debe rechazar password muy corto
  it("should reject password shorter than 6 characters", () => {
    component.password = "pass";
    const result = component.validatePassword();

    expect(result).toBe(false);
    expect(component.passwordError).toBe(
      "La contraseña debe tener al menos 6 caracteres"
    );
  });

  // Prueba 8: Validación de confirmación de password - debe validar cuando coinciden
  it("should validate confirm password when passwords match", () => {
    component.password = "password123";
    component.confirmPassword = "password123";
    const result = component.validateConfirmPassword();

    expect(result).toBe(true);
    expect(component.confirmPasswordError).toBe("");
  });

  // Prueba 9: Validación de confirmación de password - debe rechazar cuando no coinciden
  it("should reject confirm password when passwords do not match", () => {
    component.password = "password123";
    component.confirmPassword = "different123";
    const result = component.validateConfirmPassword();

    expect(result).toBe(false);
    expect(component.confirmPasswordError).toBe("Las contraseñas no coinciden");
  });

  // Prueba 10: Toggle de visibilidad de contraseña
  it("should toggle password visibility", () => {
    expect(component.showPassword).toBe(false);

    component.togglePasswordVisibility();
    expect(component.showPassword).toBe(true);

    component.togglePasswordVisibility();
    expect(component.showPassword).toBe(false);
  });

  // Prueba 11: Toggle de visibilidad de confirmación de contraseña
  it("should toggle confirm password visibility", () => {
    expect(component.showConfirmPassword).toBe(false);

    component.toggleConfirmPasswordVisibility();
    expect(component.showConfirmPassword).toBe(true);

    component.toggleConfirmPasswordVisibility();
    expect(component.showConfirmPassword).toBe(false);
  });

  // Prueba 12: Registro exitoso - debe navegar a /login después de 1200ms
  it("should navigate to /login after successful registration", fakeAsync(() => {
    component.username = "testuser123";
    component.email = "test@example.com";
    component.password = "password123";
    component.confirmPassword = "password123";

    const mockResponse = {
      success: true,
      token: "mock-jwt-token",
      user: {
        id: "123",
        email: "test@example.com",
        role: "cliente",
        username: "testuser123",
      },
    };

    component.onSubmit();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toEqual({
      username: "testuser123",
      email: "test@example.com",
      password: "password123",
    });

    req.flush(mockResponse);

    expect(component.loading).toBe(false);
    expect(component.successMessage).toBe(
      "Usuario creado correctamente. Ahora puedes iniciar sesión."
    );

    tick(1200);
    expect(router.navigate).toHaveBeenCalledWith(["/login"]);
  }));

  // Prueba 13: Registro fallido - debe manejar error de usuario duplicado
  it("should handle duplicate username error", () => {
    component.username = "existinguser";
    component.email = "test@example.com";
    component.password = "password123";
    component.confirmPassword = "password123";

    component.onSubmit();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
    req.flush(
      { message: "El nombre de usuario ya está en uso" },
      { status: 400, statusText: "Bad Request" }
    );

    expect(component.loading).toBe(false);
    expect(component.usernameError).toBe("El nombre de usuario ya está en uso");
    expect(component.errorMessage).toBe("");
  });

  // Prueba 14: Registro fallido - debe manejar error de email duplicado
  it("should handle duplicate email error", () => {
    component.username = "newuser";
    component.email = "existing@example.com";
    component.password = "password123";
    component.confirmPassword = "password123";

    component.onSubmit();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
    req.flush(
      { message: "El email ya está registrado" },
      { status: 400, statusText: "Bad Request" }
    );

    expect(component.loading).toBe(false);
    expect(component.emailError).toBe("El email ya está registrado");
    expect(component.errorMessage).toBe("");
  });

  // Prueba 15: Registro fallido - debe manejar error de contraseña
  it("should handle password error", () => {
    component.username = "newuser";
    component.email = "test@example.com";
    component.password = "weak";
    component.confirmPassword = "weak";

    component.onSubmit();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
    req.flush(
      { message: "La contraseña debe tener al menos 6 caracteres" },
      { status: 400, statusText: "Bad Request" }
    );

    expect(component.loading).toBe(false);
    expect(component.passwordError).toBe(
      "La contraseña debe tener al menos 6 caracteres"
    );
    expect(component.errorMessage).toBe("");
  });

  // Prueba 16: Registro fallido - debe manejar error genérico
  it("should handle generic error", () => {
    component.username = "newuser";
    component.email = "test@example.com";
    component.password = "password123";
    component.confirmPassword = "password123";

    component.onSubmit();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
    req.flush(
      { message: "Error del servidor" },
      { status: 500, statusText: "Internal Server Error" }
    );

    expect(component.loading).toBe(false);
    expect(component.errorMessage).toBe("Error del servidor");
  });

  // Prueba 17: onSubmit - no debe enviar si las contraseñas no coinciden
  it("should not submit when passwords do not match", () => {
    component.username = "testuser123";
    component.email = "test@example.com";
    component.password = "password123";
    component.confirmPassword = "different123";

    component.onSubmit();

    expect(component.confirmPasswordError).toBe("Las contraseñas no coinciden");
    httpMock.expectNone(`${environment.apiUrl}/auth/register`);
  });

  // Prueba 18: onSubmit - no debe enviar si faltan campos requeridos
  it("should not submit when required fields are missing", () => {
    component.username = "";
    component.email = "";
    component.password = "";
    component.confirmPassword = "";

    component.onSubmit();

    expect(component.errorMessage).toBe("Por favor completa todos los campos");
    httpMock.expectNone(`${environment.apiUrl}/auth/register`);
  });

  // Prueba 19: onSubmit - no debe enviar si las validaciones fallan
  it("should not submit when validations fail", () => {
    component.username = "ab"; // Muy corto
    component.email = "invalid-email"; // Inválido
    component.password = "123"; // Muy corto
    component.confirmPassword = "123";

    component.onSubmit();

    httpMock.expectNone(`${environment.apiUrl}/auth/register`);
  });

  // Prueba 20: checkUserExists - debe verificar si el usuario existe
  it("should check if user exists", () => {
    component.username = "testuser123";
    spyOn(component, "validateUsername").and.returnValue(true);

    component.checkUserExists();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/check-user`);
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toEqual({ username: "testuser123" });

    req.flush({ exists: true });

    expect(component.usernameError).toBe("Este usuario ya existe");
  });

  // Prueba 21: checkUserExists - no debe verificar si el username es inválido
  it("should not check user exists when username is invalid", () => {
    component.username = "ab";
    spyOn(component, "validateUsername").and.returnValue(false);

    component.checkUserExists();

    httpMock.expectNone(`${environment.apiUrl}/auth/check-user`);
  });

  // Prueba 22: checkUserExists - debe limpiar error si el usuario no existe
  it("should clear error when user does not exist", () => {
    component.username = "testuser123";
    component.usernameError = "Error previo";
    spyOn(component, "validateUsername").and.returnValue(true);

    component.checkUserExists();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/check-user`);
    req.flush({ exists: false });

    expect(component.usernameError).toBe("");
  });
});
