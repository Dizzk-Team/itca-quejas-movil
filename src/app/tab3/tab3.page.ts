import { Component, inject } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonGrid,
  IonCol,
  IonRow,
  IonIcon,
  IonButton,
  IonButtons,
  IonBackButton,
  IonItem,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import {
  arrowUpCircleOutline,
  checkmarkCircleOutline,
  locationSharp,
  peopleOutline,
} from 'ionicons/icons';
import { Router } from '@angular/router';
import { ApiError, QuejasApiService, Reporte } from '../Services/quejas-api.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonGrid,
    IonCol,
    IonRow,
    IonIcon,
    IonButton,
    IonButtons,
    IonBackButton,
    IonItem,
    IonSelect,
    IonSelectOption,
    CommonModule,
    FormsModule,
  ],
})
export class Tab3Page {
  private readonly api = inject(QuejasApiService);
  private readonly router = inject(Router);

  filtroMuro = 'recientes';
  reportes: Reporte[] = [];
  loading = false;
  error = '';
  confirmingIds = new Set<string>();
  confirmationMessages: Record<string, string> = {};
  confirmationStatus: Record<string, 'success' | 'error'> = {};

  constructor() {
    addIcons({
      locationSharp,
      peopleOutline,
      arrowUpCircleOutline,
      checkmarkCircleOutline,
    });
  }

  ionViewWillEnter(): void {
    void this.loadReportes();
  }

  async loadReportes(): Promise<void> {
    this.loading = true;
    this.error = '';

    try {
      this.reportes = await this.api.list();
    } catch (error) {
      console.error('Error al cargar los reportes de la comunidad.', error);
      this.error = 'No se pudieron cargar los reportes. Revisa tu conexión e inténtalo de nuevo.';
    } finally {
      this.loading = false;
    }
  }

  isConfirmedByCurrentUser(reporte: Reporte): boolean {
    const userId = this.api.creatorId;
    return Boolean(
      userId && reporte.confirmaciones_usuarios?.includes(userId),
    );
  }

  isConfirming(reporte: Reporte): boolean {
    return Boolean(reporte.id && this.confirmingIds.has(reporte.id));
  }

  getConfirmationMessage(reporte: Reporte): string {
    return reporte.id ? this.confirmationMessages[reporte.id] ?? '' : '';
  }

  isConfirmationError(reporte: Reporte): boolean {
    return Boolean(reporte.id && this.confirmationStatus[reporte.id] === 'error');
  }

  async confirmarReporte(reporte: Reporte): Promise<void> {
    const userId = this.api.creatorId;
    if (!this.api.isAuthenticated || !userId) {
      await this.router.navigateByUrl('/login');
      return;
    }

    if (!reporte.id || this.confirmingIds.has(reporte.id) || this.isConfirmedByCurrentUser(reporte)) {
      return;
    }

    const reportId = reporte.id;
    this.confirmingIds = new Set(this.confirmingIds).add(reportId);
    this.confirmationMessages = { ...this.confirmationMessages, [reportId]: '' };

    try {
      const reporteActualizado = await this.api.confirm(reportId, userId);
      this.reportes = this.reportes.map((item) =>
        item.id === reportId ? reporteActualizado : item,
      );
      this.confirmationMessages = {
        ...this.confirmationMessages,
        [reportId]: 'Confirmación registrada. Este reporte subió en popularidad.',
      };
      this.confirmationStatus = { ...this.confirmationStatus, [reportId]: 'success' };
    } catch (error) {
      console.error('Error al confirmar el reporte.', error);
      this.confirmationMessages = {
        ...this.confirmationMessages,
        [reportId]: error instanceof ApiError
          ? error.message
          : 'No se pudo confirmar el reporte. Inténtalo de nuevo.',
      };
      this.confirmationStatus = { ...this.confirmationStatus, [reportId]: 'error' };

      if (error instanceof ApiError && error.status === 400) {
        await this.loadReportes();
      }
    } finally {
      const confirmingIds = new Set(this.confirmingIds);
      confirmingIds.delete(reportId);
      this.confirmingIds = confirmingIds;
    }
  }

  get reportesVisibles(): Reporte[] {
    const reportes = [...this.reportes];

    if (this.filtroMuro === 'populares') {
      return reportes.sort(
        (a, b) => (b.confirmaciones_usuarios?.length ?? 0) - (a.confirmaciones_usuarios?.length ?? 0),
      );
    }

    return reportes.sort(
      (a, b) => this.getTimestamp(b) - this.getTimestamp(a),
    );
  }

  getNombreCreador(reporte: Reporte): string {
    return reporte.creador?.nombre_completo || 'Usuario de la comunidad';
  }

  getIniciales(reporte: Reporte): string {
    return this.getNombreCreador(reporte)
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((parte) => parte[0].toLocaleUpperCase())
      .join('');
  }

  getFechaRelativa(reporte: Reporte): string {
    const timestamp = this.getTimestamp(reporte);
    if (!timestamp) return 'Fecha no disponible';

    const minutos = Math.max(0, Math.floor((Date.now() - timestamp) / 60_000));
    if (minutos < 1) return 'Ahora';
    if (minutos < 60) return `Hace ${minutos} min`;

    const horas = Math.floor(minutos / 60);
    if (horas < 24) return `Hace ${horas} h`;

    const dias = Math.floor(horas / 24);
    return `Hace ${dias} ${dias === 1 ? 'día' : 'días'}`;
  }

  private getTimestamp(reporte: Reporte): number {
    const fecha = reporte.fechas?.reporte ?? reporte.created_at;
    if (!fecha) return 0;

    const timestamp = new Date(fecha).getTime();
    return Number.isNaN(timestamp) ? 0 : timestamp;
  }
}
