import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../../core/adapters/auth.service';
import { AuthGateway } from '../../core/ports/auth.gateway';
import { AlertService } from '../services/alert.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthGateway)
  const alert = inject(AlertService)
  alert.show("Veuillez vous connecter pour utiliser cette fonctionnalité")
  return authService.isAuth$;
};
