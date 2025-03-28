import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private router: Router) {}

  // Check if the user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); // Returns true if a token exists
  }

  // Log out the user
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.router.navigate(['/login']); // Redirect to login page
  }

  // Method to get the logged-in user's ID from the token or local storage
  getUserId(): string | null {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }

    // Decode the token to extract the user ID (assuming JWT structure)
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id || null; // Return the user ID from the token payload
  }

  // Method to get the logged-in user's username
  getUsername(): string | null {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }

    // Decode the token to extract the username (assuming JWT structure)
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.username || null; // Return the username from the token payload
  }
}