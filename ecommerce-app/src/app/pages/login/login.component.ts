import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from './../../../environments/environment';
import { AuthService } from '../../services/auth.service'; // ← Importa el AuthService

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

interface CheckUserResponse {
    exists: boolean;
}

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterLink
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {

    username: string = '';
    email: string = '';
    password: string = '';
    showPassword: boolean = false;

    loading = false;
    errorMessage = '';
    errorMessage2 = '';
    usernameError = '';
    emailError = '';
    passwordError = '';

    private apiUrl = `${environment.apiUrl}/auth`;
    private loginUrl = `${this.apiUrl}/login`;
    private checkUserUrl = `${this.apiUrl}/check-user`;

    constructor(
        private http: HttpClient,
        private router: Router,
        private authService: AuthService // ← Inyecta el AuthService
    ) {}

    // Validar username en tiempo real
    validateUsername(): boolean {
        this.usernameError = '';

        if (!this.username) {
            return true; // No mostrar error si está vacío, se validará al enviar
        }

        if (this.username.length > 0 && this.username.length < 6) {
            this.usernameError = 'El usuario debe tener al menos 6 caracteres';
            return false;
        }

        if (!/^[a-zA-Z0-9]+$/.test(this.username)) {
            this.usernameError = 'El usuario solo puede contener letras y números';
            return false;
        }

        return true;
    }

    // Verificar si el usuario existe
    checkUserExists() {
        if (!this.username || !this.validateUsername()) {
            return;
        }

        this.http.post<CheckUserResponse>(this.checkUserUrl, { username: this.username })
            .subscribe({
                next: (res) => {
                    if (res.exists) {
                        this.usernameError = 'Este usuario ya existe';
                    } else {
                        this.usernameError = ''; // Limpiar error si no existe
                    }
                },
                error: (err) => {
                    console.error('Error al verificar usuario:', err);
                    // No mostramos error al usuario para no confundir
                }
            });
    }

    // Validar email
    validateEmail(): boolean {
        this.emailError = '';

        if (!this.email) {
            return true; // No mostrar error si está vacío, se validará al enviar
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.email)) {
            this.emailError = 'Por favor ingresa un email válido';
            return false;
        }

        return true;
    }

    // Validar password
    validatePassword(): boolean {
        this.passwordError = '';

        if (!this.password) {
            return true; // No mostrar error si está vacío, se validará al enviar
        }

        if (this.password.length < 6) {
            this.passwordError = 'La contraseña debe tener al menos 6 caracteres';
            return false;
        }

        return true;
    }

    // Validar todos los campos antes de enviar
    validateForm(): boolean {
        let isValid = true;

        // Validar username
        if (!this.username) {
            this.usernameError = 'El nombre de usuario es requerido';
            isValid = false;
        } else if (!this.validateUsername()) {
            isValid = false;
        }

        // Validar email
        if (!this.email) {
            this.emailError = 'El email es requerido';
            isValid = false;
        } else if (!this.validateEmail()) {
            isValid = false;
        }

        // Validar password
        if (!this.password) {
            this.passwordError = 'La contraseña es requerida';
            isValid = false;
        } else if (!this.validatePassword()) {
            isValid = false;
        }

        return isValid;
    }

    // Alternar visibilidad de contraseña
    togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
    }

    onSubmit() {
        // Resetear mensajes de error
        this.errorMessage = '';
        this.errorMessage2 = '';
        this.usernameError = '';
        this.emailError = '';
        this.passwordError = '';

        // Validar formulario
        if (!this.validateForm()) {
            this.errorMessage2 = 'Por favor corrige los errores en el formulario';
            return;
        }

        console.log('🔍 Enviando datos de login:', {
            username: this.username,
            email: this.email,
            password: this.password
        });

        console.log('🔍 URLs:', {
            loginUrl: this.loginUrl,
            checkUserUrl: this.checkUserUrl
        });

        this.loading = true;

        // Preparar datos para enviar al backend
        const body = {
            username: this.username,
            email: this.email,
            password: this.password
        };

        this.http.post<AuthResponse>(this.loginUrl, body).subscribe({
            next: (res) => {
                this.loading = false;

                if (res.success && res.token) {
                    // USAR EL AUTH SERVICE PARA MANTENER CONSISTENCIA
                    const userWithUsername = {
                        ...res.user,
                        username: res.user.username || this.username,
                        name: res.user.username || this.username // ← Agrega name para el perfil
                    };

                    // Esto guarda todos los datos necesarios en localStorage
                    this.authService.setAuthFromLogin(res.token, userWithUsername);

                    console.log('✅ Login exitoso, redirigiendo...');
                    this.router.navigate(['/inicio']);
                } else {
                    this.errorMessage2 = 'Error en la autenticación. Por favor intenta nuevamente.';
                    console.error('❌ Respuesta del servidor sin éxito:', res);
                }
            },
            error: (err) => {
                this.loading = false;

                console.error('❌ Error en login:', err);

                // Manejar diferentes tipos de errores
                if (err.status === 401) {
                    this.errorMessage2 = 'Usuario, email o contraseña incorrectos';
                } else if (err.status === 400) {
                    this.errorMessage2 = err.error?.message || 'Datos de entrada inválidos';
                } else if (err.status === 404) {
                    this.errorMessage2 = 'Servicio no disponible. Por favor intenta más tarde.';
                } else if (err.status === 0) {
                    this.errorMessage2 = 'Error de conexión. Verifica tu conexión a internet.';
                } else {
                    this.errorMessage2 = err.error?.message || 'Error del servidor. Por favor intenta más tarde.';
                }
            }
        });
    }

    // Método para limpiar todos los campos
    clearForm() {
        this.username = '';
        this.email = '';
        this.password = '';
        this.usernameError = '';
        this.emailError = '';
        this.passwordError = '';
        this.errorMessage2 = '';
        this.showPassword = false;
    }

    // Verificar si el formulario puede ser enviado
    canSubmit(): boolean {
        return !this.loading &&
            !this.usernameError &&
            !this.emailError &&
            !this.passwordError &&
            !!this.username &&
            !!this.email &&
            !!this.password;
    }
}