import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonButton, IonInput } from '@ionic/angular';
import { IonItem, IonList, IonSelect, IonSelectOption, IonTextarea } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { cameraOutline, arrowForwardOutline, trashOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { ApiError, QuejasApiService } from '../Services/quejas-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonList, 
    IonSelect, IonSelectOption, CommonModule, IonTextarea, 
    FormsModule, IonIcon, IonButton, IonInput
  ]
})
export class Tab2Page implements OnInit {
  private readonly api = inject(QuejasApiService);
  private readonly router = inject(Router);
  private readonly changeDetector = inject(ChangeDetectorRef);

  categoria = '';
  ubicacion_exacta = '';
  descripcion = '';
  
  // Archivo e imagen seleccionada
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  saving = false;
  error = '';
  success = false;

  constructor() {
    addIcons({ cameraOutline, arrowForwardOutline, trashOutline });
  }

  ngOnInit(): void {}

  ionViewWillEnter(): void {
    if (!this.api.isAuthenticated) {
      void this.router.navigateByUrl('/tabs/tab1');
    }
  }

  // Método para capturar la foto desde el input file
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validar tamaño (ej. máx 10 MB)
      if (file.size > 10 * 1024 * 1024) {
        this.error = 'La imagen no debe superar los 10 MB.';
        return;
      }
      
      this.selectedFile = file;
      this.error = '';

      // Crear una vista previa de la imagen en local
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        this.changeDetector.markForCheck();
      };
      reader.readAsDataURL(file);
    }
  }

  // Eliminar la foto seleccionada
  removeImage(): void {
    this.selectedFile = null;
    this.imagePreview = null;
  }

  async save(): Promise<void> {
    const categoria = this.categoria.trim();
    const ubicacion_exacta = this.ubicacion_exacta.trim();
    const descripcion = this.descripcion.trim();

    if (!categoria || !ubicacion_exacta || !descripcion || this.saving) return;

    this.saving = true;
    this.error = '';
    this.success = false;

    try {
      const evidencias_url = this.selectedFile ? this.selectedFile.name : '';

      await this.api.create(categoria, ubicacion_exacta, descripcion, evidencias_url);
      
      // Limpiar formulario
      this.categoria = '';
      this.ubicacion_exacta = '';
      this.descripcion = '';
      this.removeImage();
      this.success = true;
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        await this.router.navigateByUrl('/tabs/tab1');
        return;
      }
      this.error = 'No se pudo guardar la información';
    } finally {
      this.saving = false;
      this.changeDetector.markForCheck();
    }
  }
}