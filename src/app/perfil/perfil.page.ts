import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { QuejasApiService, Usuario } from '../Services/quejas-api.service';
import {
  IonAvatar,
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
  IonToolbar,
  IonAccordion,
  IonAccordionGroup,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  businessOutline,
  logoWhatsapp,
  mailOutline,
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
    IonAvatar,
    IonIcon,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonAccordion,
    IonAccordionGroup,
    IonIcon,
  ],
})
export class PerfilPage {
  constructor() {
    // Registras el icono para poder usarlo en tu HTML
    addIcons({ mailOutline, logoWhatsapp, personOutline, businessOutline });
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
