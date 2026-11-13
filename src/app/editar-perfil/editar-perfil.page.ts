import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonInput,
  IonButton,
  IonList,
  IonButtons,
  IonBackButton,
} from '@ionic/angular';
import { QuejasApiService, Usuario } from '../Services/quejas-api.service';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.page.html',
  styleUrls: ['./editar-perfil.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonItem,
    IonInput,
    IonButton,
    IonList,
    IonButtons,
    IonBackButton,
  ],
})
export class EditarPerfilPage implements OnInit {
  private readonly api = inject(QuejasApiService);
  private readonly router = inject(Router);
  private readonly changeDetector = inject(ChangeDetectorRef);

  perfilData = {
    nombre_completo: '',
  };

  cargando = false;
  usuarioPerfil: Usuario | null = null;
  ngOnInit() {
    // Opcional: Si tienes forma de obtener el usuario actual desde tu API o almacenamiento local,
    // puedes precargar el nombre aquí.
  }
  async ionViewWillEnter() {
    this.cargarDatosUsuario();
  }

  async cargarDatosUsuario() {
    try {
      this.cargando = true;
      // Llamamos al servicio
      this.usuarioPerfil = await this.api.obtenerPerfilUsuario();
    } catch (error) {
      console.error('Error al obtener el perfil:', error);
    } finally {
      this.cargando = false;
      this.changeDetector.markForCheck();
    }
  }
  async actualizarNombre() {
    if (!this.perfilData.nombre_completo.trim()) {
      alert('El nombre no puede estar vacío.');
      return;
    }

    this.cargando = true;
    this.changeDetector.markForCheck();

    try {
      // Llama a tu endpoint de Laravel (updateProfile)
      await this.api.actualizarPerfil({
        nombre_completo: this.perfilData.nombre_completo,
      });

      alert('Nombre actualizado correctamente');

      // Regresa a la pantalla de perfil
      this.router.navigate(['/tabs/perfil']); // Ajusta esta ruta según tu configuración de tabs
    } catch (error: any) {
      console.error('Error al actualizar:', error);
      alert('Hubo un error al actualizar el nombre.');
    } finally {
      this.cargando = false;
      this.changeDetector.markForCheck();
    }
  }
}
