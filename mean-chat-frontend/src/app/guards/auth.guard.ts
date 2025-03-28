import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    console.log('AuthGuard: Checking if user is logged in...');
    if (this.authService.isLoggedIn()) {
      console.log('AuthGuard: User is logged in.');
      return true; // Allow access if the user is logged in
    } else {
      console.log('AuthGuard: User is not logged in. Redirecting to /login...');
      this.router.navigate(['/login']); // Redirect to login page if not logged in
      return false;
    }
  }
}