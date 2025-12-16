import { ComponentFixture, TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { Router } from "@angular/router";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { LoginComponent } from "./login.component";
import { AuthService } from "../../services/auth.service";
import { environment } from "../../../environments/environment";

describe("LoginComponent", () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpMock: HttpTestingController;
  let router: jasmine.SpyObj<Router>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj("Router", ["navigate"]);
    const authServiceSpy = jasmine.createSpyObj("AuthService", [
      "setAuthFromLogin",
    ]);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, HttpClientTestingModule],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    // No llamar detectChanges() para evitar errores de router
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
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

  // Prueba 1: Validación de username - debe validar correctamente un username válido
  it("should validate username correctly when username is valid", () => {
    component.username = "testuser123";
    const result = component.validateUsername();

    expect(result).toBe(true);
    expect(component.usernameError).toBe("");
  });

  // Prueba 2: Validación de username - debe rechazar username muy corto
  it("should reject username shorter than 6 characters", () => {
    component.username = "test";
    const result = component.validateUsername();

    expect(result).toBe(false);
    expect(component.usernameError).toBe(
      "El usuario debe tener al menos 6 caracteres"
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

  // Prueba 8: Validación de formulario completo - debe validar cuando todos los campos son válidos
  it("should validate complete form when all fields are valid", () => {
    component.username = "testuser123";
    component.email = "test@example.com";
    component.password = "password123";

    const result = component.validateForm();

    expect(result).toBe(true);
    expect(component.usernameError).toBe("");
    expect(component.emailError).toBe("");
    expect(component.passwordError).toBe("");
  });

  // Prueba 9: Validación de formulario completo - debe rechazar cuando faltan campos
  it("should reject form when required fields are missing", () => {
    component.username = "";
    component.email = "";
    component.password = "";

    const result = component.validateForm();

    expect(result).toBe(false);
    expect(component.usernameError).toBe("El nombre de usuario es requerido");
    expect(component.emailError).toBe("El email es requerido");
    expect(component.passwordError).toBe("La contraseña es requerida");
  });

  // Prueba 10: Toggle de visibilidad de contraseña
  it("should toggle password visibility", () => {
    expect(component.showPassword).toBe(false);

    component.togglePasswordVisibility();
    expect(component.showPassword).toBe(true);

    component.togglePasswordVisibility();
    expect(component.showPassword).toBe(false);
  });

  // Prueba 11: Login exitoso - debe navegar a /inicio y guardar token
  it("should navigate to /inicio and save token on successful login", () => {
    component.username = "testuser123";
    component.email = "test@example.com";
    component.password = "password123";

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

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toEqual({
      username: "testuser123",
      email: "test@example.com",
      password: "password123",
    });

    req.flush(mockResponse);

    expect(authService.setAuthFromLogin).toHaveBeenCalledWith(
      "mock-jwt-token",
      jasmine.objectContaining({
        username: "testuser123",
        name: "testuser123",
      })
    );
    expect(router.navigate).toHaveBeenCalledWith(["/inicio"]);
    expect(component.loading).toBe(false);
  });

  // Prueba 12: Login fallido - debe manejar error 401
  it("should handle 401 unauthorized error", () => {
    component.username = "testuser123";
    component.email = "test@example.com";
    component.password = "wrongpassword";

    component.onSubmit();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    req.flush(
      { message: "Unauthorized" },
      { status: 401, statusText: "Unauthorized" }
    );

    expect(component.loading).toBe(false);
    expect(component.errorMessage2).toBe(
      "Usuario, email o contraseña incorrectos"
    );
    expect(router.navigate).not.toHaveBeenCalled();
  });

  // Prueba 13: Login fallido - debe manejar error 400
  it("should handle 400 bad request error", () => {
    component.username = "testuser123";
    component.email = "test@example.com";
    component.password = "password123";

    component.onSubmit();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    req.flush(
      { message: "Datos inválidos" },
      { status: 400, statusText: "Bad Request" }
    );

    expect(component.loading).toBe(false);
    expect(component.errorMessage2).toBe("Datos inválidos");
  });

  // Prueba 14: Login fallido - debe manejar error de conexión
  it("should handle connection error (status 0)", () => {
    component.username = "testuser123";
    component.email = "test@example.com";
    component.password = "password123";

    component.onSubmit();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    req.error(new ProgressEvent("error"), { status: 0 });

    expect(component.loading).toBe(false);
    expect(component.errorMessage2).toBe(
      "Error de conexión. Verifica tu conexión a internet."
    );
  });

  // Prueba 15: canSubmit - debe retornar true cuando el formulario es válido
  it("should return true from canSubmit when form is valid and not loading", () => {
    component.loading = false;
    component.username = "testuser123";
    component.email = "test@example.com";
    component.password = "password123";
    component.usernameError = "";
    component.emailError = "";
    component.passwordError = "";

    expect(component.canSubmit()).toBe(true);
  });

  // Prueba 16: canSubmit - debe retornar false cuando está cargando
  it("should return false from canSubmit when loading", () => {
    component.loading = true;
    component.username = "testuser123";
    component.email = "test@example.com";
    component.password = "password123";

    expect(component.canSubmit()).toBe(false);
  });

  // Prueba 17: clearForm - debe limpiar todos los campos
  it("should clear all form fields and errors", () => {
    component.username = "testuser";
    component.email = "test@example.com";
    component.password = "password";
    component.usernameError = "Error";
    component.emailError = "Error";
    component.passwordError = "Error";
    component.errorMessage2 = "Error";
    component.showPassword = true;

    component.clearForm();

    expect(component.username).toBe("");
    expect(component.email).toBe("");
    expect(component.password).toBe("");
    expect(component.usernameError).toBe("");
    expect(component.emailError).toBe("");
    expect(component.passwordError).toBe("");
    expect(component.errorMessage2).toBe("");
    expect(component.showPassword).toBe(false);
  });

  // Prueba 18: onSubmit - no debe enviar si el formulario es inválido
  it("should not submit form when validation fails", () => {
    component.username = "";
    component.email = "invalid-email";
    component.password = "123";

    component.onSubmit();

    expect(component.errorMessage2).toBe(
      "Por favor corrige los errores en el formulario"
    );
    httpMock.expectNone(`${environment.apiUrl}/auth/login`);
  });

  // Prueba 19: Login fallido - debe manejar respuesta sin success
  it("should handle response without success flag", () => {
    component.username = "testuser123";
    component.email = "test@example.com";
    component.password = "password123";

    const mockResponse = {
      success: false,
      token: null,
      user: null,
    };

    component.onSubmit();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    req.flush(mockResponse);

    expect(component.errorMessage2).toBe(
      "Error en la autenticación. Por favor intenta nuevamente."
    );
    expect(router.navigate).not.toHaveBeenCalled();
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
});
