import { Component } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { environment } from "./../../../environments/environment";
import { AuthService } from "../../services/auth.service"; // ← Importa el AuthService
import { CarritoService } from "../../services/cart.service";

interface User {
  id: string;
  email: string;
  role: string;
  username?: string;
}

interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.css",
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword: boolean = false;

  loading = false;
  errorMessage = "";
  errorMessage2 = "";
  usernameError = "";
  emailError = "";
  passwordError = "";

  private apiUrl = `${environment.apiUrl}/auth`;
  private loginUrl = `${this.apiUrl}/login`;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService, // ← Inyecta el AuthService
    private fb: FormBuilder,
    private cartService: CarritoService // ← Inyecta el CarritoService
  ) {
    this.loginForm = this.fb.group({
      username: ["", [Validators.required, Validators.minLength(6)]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });
  }

  // Validar username en tiempo real
  validateUsername(): boolean {
    this.usernameError = "";
    const usernameControl = this.loginForm.get("username");

    if (!usernameControl) return true;

    if (usernameControl.hasError("required")) {
      return true; // No mostrar error si está vacío, se validará al enviar
    }

    if (usernameControl.hasError("minlength")) {
      this.usernameError = "El usuario debe tener al menos 6 caracteres";
      return false;
    }

    return true;
  }

  // Nota: En login no necesitamos verificar si el usuario existe antes de intentar iniciar sesión
  // El backend se encargará de validar las credenciales al hacer el login

  // Validar email
  validateEmail(): boolean {
    this.emailError = "";
    const emailControl = this.loginForm.get("email");

    if (!emailControl) return true;

    if (emailControl.hasError("required")) {
      return true; // No mostrar error si está vacío, se validará al enviar
    }

    if (emailControl.hasError("email")) {
      this.emailError = "Por favor ingresa un email válido";
      return false;
    }

    return true;
  }

  // Validar password
  validatePassword(): boolean {
    this.passwordError = "";
    const passwordControl = this.loginForm.get("password");

    if (!passwordControl) return true;

    if (passwordControl.hasError("required")) {
      return true; // No mostrar error si está vacío, se validará al enviar
    }

    if (passwordControl.hasError("minlength")) {
      this.passwordError = "La contraseña debe tener al menos 6 caracteres";
      return false;
    }

    return true;
  }

  // Validar todos los campos antes de enviar
  validateForm(): boolean {
    // Marcar todos los campos como touched para mostrar errores
    Object.keys(this.loginForm.controls).forEach((key) => {
      this.loginForm.get(key)?.markAsTouched();
    });

    // Validar cada campo
    const usernameValid = this.validateUsername();
    const emailValid = this.validateEmail();
    const passwordValid = this.validatePassword();

    return usernameValid && emailValid && passwordValid && this.loginForm.valid;
  }

  // Alternar visibilidad de contraseña
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    // Resetear mensajes de error
    this.errorMessage = "";
    this.errorMessage2 = "";
    this.usernameError = "";
    this.emailError = "";
    this.passwordError = "";

    // Validar formulario
    if (!this.validateForm()) {
      this.errorMessage2 = "Por favor corrige los errores en el formulario";
      return;
    }

    const formValue = this.loginForm.value;

    console.log("🔍 Enviando datos de login:", {
      username: formValue.username,
      email: formValue.email,
      password: formValue.password,
    });

    console.log("🔍 URLs:", {
      loginUrl: this.loginUrl,
    });

    this.loading = true;

    // Preparar datos para enviar al backend
    const body = {
      username: formValue.username,
      email: formValue.email,
      password: formValue.password,
    };

    this.http.post<AuthResponse>(this.loginUrl, body).subscribe({
      next: (res) => {
        this.loading = false;

        if (res.success && res.token) {
          // USAR EL AUTH SERVICE PARA MANTENER CONSISTENCIA
          const userWithUsername = {
            ...res.user,
            username: res.user.username || formValue.username,
            name: res.user.username || formValue.username, // ← Agrega name para el perfil
          };

          // Limpiar el carrito del usuario anterior antes de iniciar sesión
          this.cartService.clearCart();

          // Esto guarda todos los datos necesarios en localStorage
          this.authService.setAuthFromLogin(res.token, userWithUsername);

          console.log("✅ Login exitoso, redirigiendo...");
          this.router.navigate(["/inicio"]);
        } else {
          this.errorMessage2 =
            "Error en la autenticación. Por favor intenta nuevamente.";
          console.error("❌ Respuesta del servidor sin éxito:", res);
        }
      },
      error: (err) => {
        this.loading = false;

        console.error("❌ Error en login:", err);

        // Manejar diferentes tipos de errores
        if (err.status === 401) {
          this.errorMessage2 = "Usuario, email o contraseña incorrectos";
        } else if (err.status === 400) {
          this.errorMessage2 =
            err.error?.message || "Datos de entrada inválidos";
        } else if (err.status === 404) {
          this.errorMessage2 =
            "Servicio no disponible. Por favor intenta más tarde.";
        } else if (err.status === 0) {
          this.errorMessage2 =
            "Error de conexión. Verifica tu conexión a internet.";
        } else {
          this.errorMessage2 =
            err.error?.message ||
            "Error del servidor. Por favor intenta más tarde.";
        }
      },
    });
  }

  // Método para limpiar todos los campos
  clearForm() {
    this.loginForm.reset();
    this.usernameError = "";
    this.emailError = "";
    this.passwordError = "";
    this.errorMessage2 = "";
    this.showPassword = false;
  }

  // Verificar si el formulario puede ser enviado
  canSubmit(): boolean {
    return (
      !this.loading &&
      !this.usernameError &&
      !this.emailError &&
      !this.passwordError &&
      this.loginForm.valid
    );
  }
}
