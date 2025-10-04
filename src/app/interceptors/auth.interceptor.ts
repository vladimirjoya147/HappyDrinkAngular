import { inject } from '@angular/core';
import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../core/services/auth.service';

export function AuthInterceptor(
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
    const auth = inject(AuthService);        
    const token = auth.getToken();

    if (req.url.includes('/auth/login') || !token) {
        console.log(token);
        return next(req);
        
    }

    const cloned = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(cloned);
}