import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonList,
  IonSelectOption,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { RouterLink, Router } from '@angular/router';
import { ApiError, QuejasApiService } from '../Services/quejas-api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    IonButton,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonList,
    IonItem,
    IonSelectOption,
    IonInput,
  ],
})
export class RegisterPage {
  private readonly api = inject(QuejasApiService);
  private readonly router = inject(Router);
  private readonly changeDetector = inject(ChangeDetectorRef);
  registroData = {
    nombre_completo: '',
    correo_institucional: '',
    identificador_carnet: '',
    password: '',
    rol: '',
    departamento_o_carrera: '',
  };

  cargando = false;

  async guardarUsuario() {
    // 1. Usamos .trim() para evitar que el usuario engañe la validación enviando solo espacios
    if (
      !this.registroData.correo_institucional.trim() ||
      !this.registroData.password.trim()
    ) {
      alert('Por favor completa el correo y la contraseña, son obligatorios.');
      return;
    }

    this.cargando = true;
    this.changeDetector.markForCheck();

    try {
      const nuevoUsuario = await this.api.registrarUsuario(this.registroData);

      // 2. Completamos la alerta agregando el nombre del usuario que devolvió la API
      alert('Usuario creado exitosamente: ' + nuevoUsuario.nombre_completo);

      this.router.navigate(['/login']);
    } catch (error: any) {
      console.error('Error en registro:', error);
      alert(
        'Error al registrar. Verifica los datos o si el usuario ya existe.',
      );
    } finally {
      this.cargando = false;
      this.changeDetector.markForCheck();
    }
  }
}
