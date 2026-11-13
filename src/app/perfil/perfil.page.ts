import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { QuejasApiService, Usuario } from '../Services/quejas-api.service';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  businessOutline,
  logOutOutline,
  logoWhatsapp,
  mailOutline,
  personCircleOutline,
  personOutline,
} from 'ionicons/icons';
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonIcon,
    IonButton,
  ],
})
export class PerfilPage {
  constructor() {
    addIcons({
      mailOutline,
      logoWhatsapp,
      personOutline,
      personCircleOutline,
      businessOutline,
      logOutOutline,
    });
  }
  private api = inject(QuejasApiService);
  private router = inject(Router);
  private readonly changeDetector = inject(ChangeDetectorRef); ///
  correo_institucional = '';
  password = '';
  loading = false;
  error = '';
  usuarioPerfil: Usuario | null = null; //Se declara para amacenear el usuario actual con sesion iniciada
  cargando: boolean = true;

  abrirEdicion() {
    this.router.navigate(['/editar-perfil']); // Ajusta la ruta si la creaste dentro de un tab específico
  }
  get authenticated(): boolean {
    return this.api.isAuthenticated;
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
  logout(): void {
    this.api.logout();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
