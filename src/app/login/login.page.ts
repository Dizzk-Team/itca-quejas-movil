import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonText, IonTitle, IonToolbar } from '@ionic/angular';
import { RouterLink, Router} from '@angular/router';
import { ApiError, TasksApiService } from '../Services/tasks-api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [IonContent, CommonModule, FormsModule, IonButton]
})
export class LoginPage {

  private readonly api = inject(TasksApiService);
  private readonly router = inject(Router);
  private readonly changeDetector = inject(ChangeDetectorRef);
  email = '';
  password = '';
  loading = false;
  error = '';

  get authenticated(): boolean { return this.api.isAuthenticated; }

  async login(): Promise<void> {
    if (!this.email.trim() || !this.password || this.loading) return;
    this.loading = true;
    this.error = '';
    try {
      await this.api.login(this.email.trim(), this.password);
      this.password = '';
      await this.router.navigateByUrl('/tabs/tab1');
    } catch (error) {
      this.error = error instanceof ApiError && error.status === 401
        ? 'Correo o contraseña incorrectos.'
        : 'No se pudo iniciar sesión. Comprueba que la API esté disponible.';
    } finally {
      this.loading = false;
      this.changeDetector.markForCheck();
    }
  }

  logout(): void {
    this.api.logout();
    this.password = '';
  }

}
