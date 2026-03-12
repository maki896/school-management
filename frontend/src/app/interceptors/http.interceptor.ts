import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from '../services/loading.service';
import { AuthService } from '../services/auth.service';
import { finalize, catchError, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
    const loadingService = inject(LoadingService);
    const authService = inject(AuthService);
    const snackBar = inject(MatSnackBar);
    
    // Check if we should ignore loading for some requests
    loadingService.show();

    // Clone request to add auth header
    const token = authService.getToken();
    let authReq = req;
    if (token) {
        authReq = req.clone({
            setHeaders: { 'x-auth-token': token }
        });
    }

    return next(authReq).pipe(
        catchError((err: HttpErrorResponse) => {
            let errorMsg = 'An unexpected error occurred';
            if (err.error && err.error.msg) {
                errorMsg = err.error.msg;
            }

            if (err.status === 401) {
                authService.logout();
                errorMsg = 'Session expired. Please login again.';
            }

            snackBar.open(errorMsg, 'Close', { duration: 4000 });
            return throwError(() => err);
        }),
        finalize(() => loadingService.hide())
    );
};
