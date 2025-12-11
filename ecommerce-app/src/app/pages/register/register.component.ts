import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterLink
    ],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})
export class RegisterComponent {

    username: string = '';
    email: string = '';
    password: string = '';
    confirmPassword: string = '';
    showPassword: boolean = false;
    showConfirmPassword: boolean = false;

    loading = false;
    errorMessage = '';
    successMessage = '';
    usernameError = '';
    emailError = '';
    passwordError = '';
    confirmPasswordError = '';

    // ajusta la URL a tu backend
    private apiUrl = `${environment.apiUrl}/auth/register`;
    private checkUserUrl = `${environment.apiUrl}/auth/check-user`;

    constructor(
        private http: HttpClient,
        private router: Router
    ) {}

    // Validar username en tiempo real
    validateUsername() {
        this.usernameError = '';

        if (this.username.length > 0 && this.username.length < 3) {
            this.usernameError = 'El usuario debe tener al menos 3 caracteres';
            return false;
        }

        if (this.username && !/^[a-zA-Z0-9]+$/.test(this.username)) {
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

        this.http.post<any>(`${this.checkUserUrl}`, { username: this.username })
            .subscribe({
                next: (res) => {
                    if (res.exists) {
                        this.usernameError = 'Este usuario ya existe';
                    }
                },
                error: (err) => {
                    console.error('Error al verificar usuario:', err);
                }
            });
    }

    // Validar email
    validateEmail() {
        this.emailError = '';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (this.email && !emailRegex.test(this.email)) {
            this.emailError = 'Por favor ingresa un email válido';
            return false;
        }

        return true;
    }

    // Validar contraseña
    validatePassword() {
        this.passwordError = '';

        if (this.password.length > 0 && this.password.length < 6) {
            this.passwordError = 'La contraseña debe tener al menos 6 caracteres';
            return false;
        }

        return true;
    }

    // Validar confirmación de contraseña
    validateConfirmPassword() {
        this.confirmPasswordError = '';

        if (this.confirmPassword && this.password !== this.confirmPassword) {
            this.confirmPasswordError = 'Las contraseñas no coinciden';
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
        this.errorMessage = '';
        this.successMessage = '';
        this.usernameError = '';
        this.emailError = '';
        this.passwordError = '';
        this.confirmPasswordError = '';

        // Validaciones antes de enviar
        if (!this.validateUsername() || !this.validateEmail() ||
            !this.validatePassword() || !this.validateConfirmPassword()) {
            return;
        }

        if (this.password !== this.confirmPassword) {
            this.confirmPasswordError = 'Las contraseñas no coinciden';
            return;
        }

        if (!this.username || !this.email || !this.password || !this.confirmPassword) {
            this.errorMessage = 'Por favor completa todos los campos';
            return;
        }

        this.loading = true;

        const body = {
            username: this.username,
            email: this.email,
            password: this.password,
        };

        this.http.post<any>(this.apiUrl, body).subscribe({
            next: (res) => {
                this.loading = false;
                this.successMessage = 'Usuario creado correctamente. Ahora puedes iniciar sesión.';

                setTimeout(() => {
                    this.router.navigate(['/login']);
                }, 1200);
            },
            error: (err) => {
                this.loading = false;
                console.error('Error completo en registro:', err);
                this.errorMessage = err.error?.message || 'Error al registrar usuario';

                // FIX: Manejar errores específicos SIN duplicar mensajes
                const errorMsg = err.error?.message || 'Error al registrar usuario';

                if (errorMsg.includes('usuario') || errorMsg.includes('username')) {
                    this.usernameError = errorMsg;
                    this.errorMessage = ''; // Limpiar mensaje general
                }
                else if (errorMsg.includes('email') || errorMsg.includes('correo')) {
                    this.emailError = errorMsg;
                    this.errorMessage = ''; // Limpiar mensaje general
                }
                else if (errorMsg.includes('contraseña') || errorMsg.includes('password')) {
                    this.passwordError = errorMsg;
                    this.errorMessage = ''; // Limpiar mensaje general
                }
                else {
                    // Solo mostrar error general si no es un error de campo específico
                    this.errorMessage = errorMsg;
                }
            }
        });
    }
}