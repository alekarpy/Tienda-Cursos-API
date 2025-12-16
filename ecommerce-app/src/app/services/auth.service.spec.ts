import { TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { AuthService } from "./auth.service";

describe("AuthService", () => {
  let service: AuthService;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj("Router", ["navigate"]);

    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: routerSpy }],
    });
    service = TestBed.inject(AuthService);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  // Prueba 1: setAuthFromLogin - debe guardar token y usuario en localStorage
  it("should save token and user to localStorage when setAuthFromLogin is called", () => {
    const token = "mock-jwt-token";
    const user = {
      id: "123",
      email: "test@example.com",
      role: "cliente",
      username: "testuser",
    };

    service.setAuthFromLogin(token, user);

    expect(localStorage.getItem("token")).toBe(token);
    expect(localStorage.getItem("isLoggedIn")).toBe("true");
    expect(localStorage.getItem("user")).toBe(JSON.stringify(user));
    expect(localStorage.getItem("currentUser")).toBe(JSON.stringify(user));
  });

  // Prueba 2: setAuthFromLogin - debe actualizar el estado de autenticación
  it("should update authentication state when setAuthFromLogin is called", (done) => {
    const token = "mock-jwt-token";
    const user = {
      id: "123",
      email: "test@example.com",
      role: "cliente",
      username: "testuser",
    };

    service.isAuthenticated$.subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        expect(isAuthenticated).toBe(true);
        done();
      }
    });

    service.setAuthFromLogin(token, user);
  });

  // Prueba 3: logout - debe limpiar todos los datos de autenticación
  it("should clear all authentication data on logout", () => {
    // Primero establecer autenticación
    service.setAuthFromLogin("token", { id: "123", email: "test@example.com" });

    // Verificar que hay datos
    expect(localStorage.getItem("token")).toBeTruthy();
    expect(localStorage.getItem("isLoggedIn")).toBeTruthy();

    // Hacer logout
    service.logout();

    // Verificar que todo fue limpiado
    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("isLoggedIn")).toBeNull();
    expect(localStorage.getItem("currentUser")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
  });

  // Prueba 4: logout - debe navegar a /login
  it("should navigate to /login on logout", () => {
    service.logout();

    expect(router.navigate).toHaveBeenCalledWith(["/login"]);
  });

  // Prueba 5: logout - debe actualizar el estado de autenticación a false
  it("should update authentication state to false on logout", (done) => {
    // Primero establecer autenticación
    service.setAuthFromLogin("token", { id: "123", email: "test@example.com" });

    // Suscribirse al observable
    let authStates: boolean[] = [];
    service.isAuthenticated$.subscribe((isAuthenticated) => {
      authStates.push(isAuthenticated);

      // Después del logout, el último valor debe ser false
      if (authStates.length >= 2) {
        expect(authStates[authStates.length - 1]).toBe(false);
        done();
      }
    });

    service.logout();
  });

  // Prueba 6: isLoggedIn - debe retornar true cuando hay token
  it("should return true from isLoggedIn when token exists", () => {
    localStorage.setItem("token", "mock-token");

    expect(service.isLoggedIn()).toBe(true);
  });

  // Prueba 7: isLoggedIn - debe retornar true cuando isLoggedIn flag está en true
  it("should return true from isLoggedIn when isLoggedIn flag is true", () => {
    localStorage.setItem("isLoggedIn", "true");

    expect(service.isLoggedIn()).toBe(true);
  });

  // Prueba 8: isLoggedIn - debe retornar false cuando no hay datos de autenticación
  it("should return false from isLoggedIn when no authentication data exists", () => {
    localStorage.clear();

    expect(service.isLoggedIn()).toBe(false);
  });

  // Prueba 9: getCurrentUser - debe retornar usuario de currentUser si existe
  it("should return user from currentUser when it exists", () => {
    const user = {
      id: "123",
      email: "test@example.com",
      role: "cliente",
      username: "testuser",
    };

    localStorage.setItem("currentUser", JSON.stringify(user));

    const currentUser = service.getCurrentUser();

    expect(currentUser).toEqual(user);
  });

  // Prueba 10: getCurrentUser - debe retornar usuario de user si currentUser no existe
  it("should return user from user when currentUser does not exist", () => {
    const user = {
      id: "123",
      email: "test@example.com",
      role: "cliente",
      username: "testuser",
    };

    localStorage.setItem("user", JSON.stringify(user));

    const currentUser = service.getCurrentUser();

    expect(currentUser).toEqual(user);
  });

  // Prueba 11: getCurrentUser - debe retornar null cuando no hay usuario
  it("should return null from getCurrentUser when no user exists", () => {
    localStorage.clear();

    const currentUser = service.getCurrentUser();

    expect(currentUser).toBeNull();
  });

  // Prueba 12: checkAuthStatus - debe retornar true cuando hay token
  it("should return true from checkAuthStatus when token exists", () => {
    localStorage.setItem("token", "mock-token");

    // Usamos isLoggedIn que internamente llama a checkAuthStatus
    expect(service.isLoggedIn()).toBe(true);
  });

  // Prueba 13: checkAuthStatus - debe retornar true cuando isLoggedIn flag está en true
  it("should return true from checkAuthStatus when isLoggedIn flag is true", () => {
    localStorage.setItem("isLoggedIn", "true");

    expect(service.isLoggedIn()).toBe(true);
  });

  // Prueba 14: checkAuthStatus - debe retornar false cuando no hay datos
  it("should return false from checkAuthStatus when no authentication data exists", () => {
    localStorage.clear();

    expect(service.isLoggedIn()).toBe(false);
  });

  // Prueba 15: login (método legacy) - debe establecer autenticación y navegar
  it("should set authentication and navigate on login (legacy method)", () => {
    const credentials = { email: "test@example.com" };

    const result = service.login(credentials);

    expect(result).toBe(true);
    expect(localStorage.getItem("isLoggedIn")).toBe("true");
    expect(localStorage.getItem("currentUser")).toBeTruthy();
    expect(router.navigate).toHaveBeenCalledWith(["/profile"]);
  });

  // Prueba 16: login (método legacy) - debe guardar usuario en localStorage
  it("should save user to localStorage on login (legacy method)", () => {
    const credentials = { email: "test@example.com" };

    service.login(credentials);

    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    expect(currentUser.email).toBe("test@example.com");
    expect(currentUser.name).toBe("Usuario Ejemplo");
  });

  // Prueba 17: isAuthenticated$ - debe emitir el estado inicial correcto
  it("should emit initial authentication state correctly", (done) => {
    localStorage.clear();

    service.isAuthenticated$.subscribe((isAuthenticated) => {
      expect(isAuthenticated).toBe(false);
      done();
    });
  });

  // Prueba 18: isAuthenticated$ - debe emitir true después de setAuthFromLogin
  it("should emit true after setAuthFromLogin", (done) => {
    let callCount = 0;

    service.isAuthenticated$.subscribe((isAuthenticated) => {
      callCount++;
      if (callCount === 2) {
        expect(isAuthenticated).toBe(true);
        done();
      }
    });

    service.setAuthFromLogin("token", { id: "123", email: "test@example.com" });
  });

  // Prueba 19: setAuthFromLogin - debe manejar usuario sin username
  it("should handle user without username in setAuthFromLogin", () => {
    const token = "mock-jwt-token";
    const user = {
      id: "123",
      email: "test@example.com",
      role: "cliente",
    };

    service.setAuthFromLogin(token, user);

    const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
    expect(savedUser).toEqual(user);
  });

  // Prueba 20: Múltiples llamadas a setAuthFromLogin - debe actualizar correctamente
  it("should update correctly on multiple setAuthFromLogin calls", () => {
    const token1 = "token1";
    const user1 = { id: "1", email: "user1@example.com" };

    service.setAuthFromLogin(token1, user1);
    expect(localStorage.getItem("token")).toBe(token1);

    const token2 = "token2";
    const user2 = { id: "2", email: "user2@example.com" };

    service.setAuthFromLogin(token2, user2);
    expect(localStorage.getItem("token")).toBe(token2);
    expect(localStorage.getItem("user")).toBe(JSON.stringify(user2));
  });
});
