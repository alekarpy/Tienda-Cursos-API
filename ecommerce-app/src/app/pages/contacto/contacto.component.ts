import { Component } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-contacto",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./contacto.component.html",
  styleUrl: "./contacto.component.css",
})
export class ContactoComponent {
  contactForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      nombre: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      mensaje: ["", [Validators.required, Validators.minLength(10)]],
    });
  }

  onSubmit() {
    if (this.contactForm.invalid) {
      // Marcar todos los campos como touched para mostrar errores
      Object.keys(this.contactForm.controls).forEach((key) => {
        this.contactForm.get(key)?.markAsTouched();
      });
      return;
    }

    const formData = this.contactForm.value;
    console.log("Datos del contacto:", formData);
    // Aquí puedes agregar la lógica para enviar el mensaje
    alert("Mensaje enviado correctamente");
    this.contactForm.reset();
  }
}
