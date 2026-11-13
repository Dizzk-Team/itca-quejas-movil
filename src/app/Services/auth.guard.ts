import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { QuejasApiService } from '../Services/quejas-api.service'; // Ajusta la ruta correcta

export const authGuard: CanActivateFn = (route, state) => {
  const apiService = inject(QuejasApiService);
  const router = inject(Router);

  if (apiService.isAuthenticated) {
    return true; // Permite el acceso a la ruta
  } else {
    // Si no está autenticado, redirige al login
    router.navigate(['/login']);
    return false; // Bloquea el acceso a la ruta protegida
  }
};
