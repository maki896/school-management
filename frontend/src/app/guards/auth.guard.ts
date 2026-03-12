import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isLoggedIn()) {
        const userRole = authService.getRole();
        const expectedRoles = route.data['roles'] as Array<string>;

        if (expectedRoles && !expectedRoles.includes(userRole)) {
            router.navigate(['/']);
            return false;
        }
        return true;
    }

    router.navigate(['/login']);
    return false;
};
