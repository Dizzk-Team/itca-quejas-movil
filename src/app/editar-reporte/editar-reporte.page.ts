import { ChangeDetectorRef, Component, inject } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  IonItem,
  IonList,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { saveOutline } from 'ionicons/icons';
import { ApiError, QuejasApiService } from '../Services/quejas-api.service';

@Component({
  selector: 'app-editar-reporte',
  templateUrl: 'editar-reporte.page.html',
  styleUrls: ['editar-reporte.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonButton,
    IonIcon,
    IonItem,
    IonList,
    IonSelect,
    IonSelectOption,
    CommonModule,
    FormsModule,
  ],
})
export class EditarReportePage {
  private readonly api = inject(QuejasApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly edificios = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'].map(
    (letra) => `Edificio ${letra}`,
  );

  id = '';
  categoria = '';
  ubicacion_exacta = '';
  descripcion = '';

  loading = false;
  saving = false;
  error = '';
  /** El reporte ya no se puede editar (no existe, no es tuyo o no está pendiente). */
  bloqueado = false;

  constructor() {
    addIcons({ saveOutline });
  }

  ionViewWillEnter(): void {
    void this.cargar();
  }

  async cargar(): Promise<void> {
    if (!this.api.isAuthenticated) {
      await this.router.navigateByUrl('/login');
      return;
    }

    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    this.loading = true;
    this.error = '';
    this.bloqueado = false;
    this.cdr.markForCheck();

    try {
      const reporte = await this.api.getById(this.id);
      if (!reporte) {
        this.error = 'No se encontró el reporte.';
        this.bloqueado = true;
      } else if (reporte.creador_id !== this.api.creatorId || (reporte.estado ?? 'Pendiente') !== 'Pendiente') {
        this.error = 'Solo puedes editar tus reportes que siguen pendientes.';
        this.bloqueado = true;
      } else {
        this.categoria = reporte.categoria;
        this.ubicacion_exacta = reporte.ubicacion_exacta;
        this.descripcion = reporte.descripcion;
      }
    } catch (error) {
      console.error('Error al cargar el reporte.', error);
      this.error = 'No se pudo cargar el reporte. Revisa tu conexión e inténtalo de nuevo.';
    } finally {
      this.loading = false;
      // La app corre sin zone.js: hay que avisar a Angular que redibuje.
      this.cdr.markForCheck();
    }
  }

  async guardar(): Promise<void> {
    const categoria = this.categoria.trim();
    const ubicacion_exacta = this.ubicacion_exacta.trim();
    const descripcion = this.descripcion.trim();

    if (this.saving || this.bloqueado) return;
    if (!categoria || !ubicacion_exacta || !descripcion) {
      this.error = 'Completa todos los campos obligatorios.';
      return;
    }
    if (descripcion.length < 10) {
      this.error = 'La descripción debe tener al menos 10 caracteres.';
      return;
    }

    this.saving = true;
    this.error = '';
    this.cdr.markForCheck();

    try {
      await this.api.update(this.id, { categoria, ubicacion_exacta, descripcion });
      await this.router.navigateByUrl('/tabs/tab1');
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        await this.router.navigateByUrl('/login');
        return;
      }
      if (error instanceof ApiError) {
        const mensajes = Object.values(error.validationErrors ?? {}).flat();
        this.error = mensajes.length ? mensajes.join(' ') : error.message;
      } else {
        this.error = 'No se pudieron guardar los cambios.';
      }
    } finally {
      this.saving = false;
      this.cdr.markForCheck();
    }
  }
}
