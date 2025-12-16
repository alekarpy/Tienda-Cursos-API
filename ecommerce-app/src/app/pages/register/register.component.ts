import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { environment } from "./../../../environments/environment";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: "./register.component.html",
  styleUrl: "./register.component.css",
})
export class RegisterComponent {
  registerForm: FormGroup;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  loading = false;
  errorMessage = "";
  successMessage = "";
  usernameError = "";
  emailError = "";
  passwordError = "";
  confirmPasswordError = "";

  // ajusta la URL a tu backend
  private apiUrl = `${environment.apiUrl}/auth/register`;
  private checkUserUrl = `${environment.apiUrl}/auth/check-user`;

  constructor(
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.registerForm = this.fb.group(
      {
        username: ["", [Validators.required, Validators.minLength(6)]],
        email: ["", [Validators.required, Validators.email]],
        password: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", [Validators.required]],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  // Validador personalizado para verificar que las contraseñas coincidan
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get("password");
    const confirmPassword = control.get("confirmPassword");

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value
      ? null
      : { passwordMismatch: true };
  }

  // Validar username en tiempo real
  validateUsername() {
    this.usernameError = "";
    const usernameControl = this.registerForm.get("username");

    if (!usernameControl) return true;

    if (usernameControl.hasError("minlength")) {
      this.usernameError = "El usuario debe tener al menos 6 caracteres";
      return false;
    }

    return true;
  }

  // Verificar si el usuario existe
  checkUserExists() {
    const username = this.registerForm.get("username")?.value;
    if (!username || !this.validateUsername()) {
      return;
    }

    this.http.post<any>(`${this.checkUserUrl}`, { username }).subscribe({
      next: (res) => {
        if (res.exists) {
          this.usernameError = "Este usuario ya existe";
        }
      },
      error: (err) => {
        console.error("Error al verificar usuario:", err);
      },
    });
  }

  // Validar email
  validateEmail() {
    this.emailError = "";
    const emailControl = this.registerForm.get("email");

    if (!emailControl) return true;

    if (emailControl.hasError("email")) {
      this.emailError = "Por favor ingresa un email válido";
      return false;
    }

    return true;
  }

  // Validar contraseña
  validatePassword() {
    this.passwordError = "";
    const passwordControl = this.registerForm.get("password");

    if (!passwordControl) return true;

    if (passwordControl.hasError("minlength")) {
      this.passwordError = "La contraseña debe tener al menos 6 caracteres";
      return false;
    }

    return true;
  }

  // Validar confirmación de contraseña
  validateConfirmPassword() {
    this.confirmPasswordError = "";

    // Actualizar la validación del formulario
    this.registerForm.updateValueAndValidity();

    if (this.registerForm.hasError("passwordMismatch")) {
      this.confirmPasswordError = "Las contraseñas no coinciden";
      return false;
    }

    return true;
  }

  // Alternar visibilidad de contraseña
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Alternar visibilidad de confirmación de contraseña
  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    this.errorMessage = "";
    this.successMessage = "";
    this.usernameError = "";
    this.emailError = "";
    this.passwordError = "";
    this.confirmPasswordError = "";

    // Marcar todos los campos como touched
    Object.keys(this.registerForm.controls).forEach((key) => {
      this.registerForm.get(key)?.markAsTouched();
    });

    // Validaciones antes de enviar
    if (
      !this.validateUsername() ||
      !this.validateEmail() ||
      !this.validatePassword() ||
      !this.validateConfirmPassword()
    ) {
      return;
    }

    if (!this.registerForm.valid) {
      this.errorMessage = "Por favor completa todos los campos correctamente";
      return;
    }

    this.loading = true;

    const formValue = this.registerForm.value;
    const body = {
      username: formValue.username,
      email: formValue.email,
      password: formValue.password,
    };

    this.http.post<any>(this.apiUrl, body).subscribe({
      next: (res) => {
        this.loading = false;
        this.successMessage =
          "Usuario creado correctamente. Ahora puedes iniciar sesión.";

        setTimeout(() => {
          this.router.navigate(["/login"]);
        }, 1200);
      },
      error: (err) => {
        this.loading = false;
        console.error("Error completo en registro:", err);
        this.errorMessage = err.error?.message || "Error al registrar usuario";

        // FIX: Manejar errores específicos SIN duplicar mensajes
        const errorMsg = err.error?.message || "Error al registrar usuario";

        if (errorMsg.includes("usuario") || errorMsg.includes("username")) {
          this.usernameError = errorMsg;
          this.errorMessage = ""; // Limpiar mensaje general
        } else if (errorMsg.includes("email") || errorMsg.includes("correo")) {
          this.emailError = errorMsg;
          this.errorMessage = ""; // Limpiar mensaje general
        } else if (
          errorMsg.includes("contraseña") ||
          errorMsg.includes("password")
        ) {
          this.passwordError = errorMsg;
          this.errorMessage = ""; // Limpiar mensaje general
        } else {
          // Solo mostrar error general si no es un error de campo específico
          this.errorMessage = errorMsg;
        }
      },
    });
  }
}
