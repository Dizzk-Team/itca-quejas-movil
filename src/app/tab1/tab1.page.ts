import { ChangeDetectorRef, Component, inject } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonIcon,
  IonButton,
  IonButtons,
} from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  buildOutline,
  checkmarkCircleOutline,
  cameraOutline,
  locationSharp,
  logOutOutline,
  peopleOutline,
  timeOutline,
} from 'ionicons/icons';
import { QuejasApiService, Reporte } from '../Services/quejas-api.service';

type Estado = 'pending' | 'in-process' | 'resolve';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonIcon,
    IonButton,
    IonButtons,
    CommonModule,
  ],
})
export class Tab1Page {
  private readonly api = inject(QuejasApiService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  reportes: Reporte[] = [];
  nombre = '';
  loading = false;
  error = '';

  constructor() {
    addIcons({
      timeOutline,
      buildOutline,
      checkmarkCircleOutline,
      cameraOutline,
      locationSharp,
      logOutOutline,
      peopleOutline,
    });
  }

  ionViewWillEnter(): void {
    void this.loadMisReportes();
  }

  async loadMisReportes(): Promise<void> {
    if (!this.api.isAuthenticated) {
      await this.router.navigateByUrl('/login');
      return;
    }

    this.loading = true;
    this.error = '';
    this.cdr.markForCheck();

    try {
      const todos = await this.api.list();
      const miId = this.api.creatorId;
      this.reportes = todos
        .filter((r) => r.creador_id === miId)
        .sort((a, b) => this.getTimestamp(b) - this.getTimestamp(a));
      this.nombre = this.reportes[0]?.creador?.nombre_completo ?? '';
    } catch (error) {
      console.error('Error al cargar mis reportes.', error);
      this.error = 'No se pudieron cargar tus reportes. Revisa tu conexión e inténtalo de nuevo.';
    } finally {
      this.loading = false;
      // La app corre sin zone.js: hay que avisar a Angular que redibuje.
      this.cdr.markForCheck();
    }
  }

  async logout(): Promise<void> {
    this.api.logout();
    await this.router.navigateByUrl('/login');
  }

  getEstado(reporte: Reporte): Estado {
    if (reporte.estado === 'Resuelto') return 'resolve';
    if (reporte.estado === 'En proceso') return 'in-process';
    return 'pending';
  }

  getEstadoTexto(reporte: Reporte): string {
    return { pending: 'Pendiente', 'in-process': 'En proceso', resolve: 'Resuelto' }[
      this.getEstado(reporte)
    ];
  }

  getEstadoIcono(reporte: Reporte): string {
    return {
      pending: 'time-outline',
      'in-process': 'build-outline',
      resolve: 'checkmark-circle-outline',
    }[this.getEstado(reporte)];
  }

  contar(estado: Estado): number {
    return this.reportes.filter((r) => this.getEstado(r) === estado).length;
  }

  getPrimerNombre(): string {
    return this.nombre.split(/\s+/).filter(Boolean)[0] ?? '';
  }

  getIniciales(): string {
    return (
      this.nombre
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0].toLocaleUpperCase())
        .join('') || '👤'
    );
  }

  getFecha(reporte: Reporte): string {
    const ts = this.getTimestamp(reporte);
    if (!ts) return 'Fecha no disponible';
    return new Date(ts).toLocaleDateString('es-SV', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  private getTimestamp(reporte: Reporte): number {
    const fecha = reporte.fechas?.reporte ?? reporte.created_at;
    if (!fecha) return 0;
    const ts = new Date(fecha).getTime();
    return Number.isNaN(ts) ? 0 : ts;
  }
}
