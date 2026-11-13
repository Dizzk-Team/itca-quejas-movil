import { ChangeDetectorRef, Component, DestroyRef, inject } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonIcon,
  IonButton,
  IonButtons,
  IonAlert,
} from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  buildOutline,
  checkmarkCircleOutline,
  cameraOutline,
  createOutline,
  locationSharp,
  logOutOutline,
  peopleOutline,
  personOutline,
  timeOutline,
  trashOutline,
} from 'ionicons/icons';
import { ApiError, QuejasApiService, Reporte } from '../Services/quejas-api.service';

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
    IonAlert,
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

  /** Reporte que espera confirmación para eliminarse. */
  porEliminar: Reporte | null = null;
  eliminandoId: string | null = null;

  readonly botonesEliminar = [
    { text: 'Cancelar', role: 'cancel' },
    {
      text: 'Eliminar',
      role: 'destructive',
      handler: () => {
        if (this.porEliminar) void this.eliminar(this.porEliminar);
      },
    },
  ];

  constructor() {
    addIcons({
      createOutline,
      trashOutline,
      timeOutline,
      buildOutline,
      checkmarkCircleOutline,
      cameraOutline,
      locationSharp,
      logOutOutline,
      peopleOutline,
      personOutline,
    });

    // Recargar cada vez que se llega a Inicio. ionViewWillEnter no se dispara
    // al volver desde páginas fuera de las pestañas (login, editar reporte).
    const sub = this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd && e.urlAfterRedirects.startsWith('/tabs/tab1')) {
        void this.loadMisReportes();
      }
    });
    inject(DestroyRef).onDestroy(() => sub.unsubscribe());
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

  editar(reporte: Reporte): void {
    if (reporte.id) void this.router.navigate(['/editar-reporte', reporte.id]);
  }

  pedirEliminar(reporte: Reporte): void {
    this.porEliminar = reporte;
  }

  async eliminar(reporte: Reporte): Promise<void> {
    if (!reporte.id || this.eliminandoId) return;

    this.eliminandoId = reporte.id;
    this.error = '';
    this.cdr.markForCheck();

    try {
      await this.api.delete(reporte.id);
      this.reportes = this.reportes.filter((r) => r.id !== reporte.id);
    } catch (error) {
      console.error('Error al eliminar el reporte.', error);
      if (error instanceof ApiError && error.status === 401) {
        await this.router.navigateByUrl('/login');
        return;
      }
      this.error = error instanceof ApiError
        ? error.message
        : 'No se pudo eliminar el reporte. Inténtalo de nuevo.';
    } finally {
      this.eliminandoId = null;
      this.cdr.markForCheck();
    }
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
