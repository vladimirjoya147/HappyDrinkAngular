import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {

    if (!this.authService.isAuthenticated()) {
        return this.router.parseUrl('/login');
    }
    const requiredRoles = route.data['roles'] as string[]; 
    if (requiredRoles && requiredRoles.length > 0) {
        const userRoles = this.authService.getRoles();
        const hasRole = requiredRoles.some(r => userRoles.includes(r));

        if (!hasRole) {
            return this.router.parseUrl('/forbidden'); 
        }
    }

    return true;
    }
}
