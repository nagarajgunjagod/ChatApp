import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth'; // Base URL for auth routes

  constructor(private router: Router, private http: HttpClient) {}

  // Check if the user is logged in
  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('isLoggedIn: Token is missing.');
    }
    return !!token; // Returns true if a token exists
  }

  // Log out the user
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    console.log('User logged out. Token and username removed from localStorage.');
    this.router.navigate(['/login']); // Redirect to login page
  }

  // Method to get the logged-in user's ID from the token or local storage
  getUserId(): string | null {
    const token = this.getToken();
    if (!token) {
      console.warn('getUserId: Token is missing.');
      return null;
    }

    try {
      const payload = this.decodeToken(token);
      return payload?.id || null; // Return the user ID from the token payload
    } catch (error) {
      console.error('getUserId: Error decoding token:', error);
      return null;
    }
  }

  // Method to get the logged-in user's username
  getUsername(): string | null {
    const token = this.getToken();
    if (!token) {
      console.warn('getUsername: Token is missing.');
      return null;
    }

    try {
      const payload = this.decodeToken(token);
      return payload?.username || null; // Return the username from the token payload
    } catch (error) {
      console.error('getUsername: Error decoding token:', error);
      return null;
    }
  }

  // Helper method to decode a JWT token
  private decodeToken(token: string): any {
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('decodeToken: Invalid token format:', token);
      throw new Error('Invalid token format');
    }

    try {
      const payload = atob(parts[1]); // Decode the payload part of the token
      return JSON.parse(payload); // Parse the JSON payload
    } catch (error) {
      console.error('decodeToken: Failed to decode token payload:', error);
      throw new Error('Failed to decode token payload');
    }
  }

  // Helper method to safely retrieve the token from localStorage
  private getToken(): string | null {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('getToken: Token is missing or undefined.');
    }
    return token;
  }

  // Login method to authenticate the user
  login(credentials: { username: string; password: string }): Observable<any> {
    const url = `${this.apiUrl}/login`; // Construct the login endpoint URL
    return this.http.post(url, credentials).pipe(
      catchError(this.handleError) // Handle errors
    );
  }

  // Register method to create a new user
  register(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, credentials).pipe(
      catchError(this.handleError)
    );
  }

  // Error handling for HTTP requests
  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      console.error('An error occurred:', error.error.message);
    } else {
      // Backend returned an unsuccessful response code
      console.error(
        `Backend returned code ${error.status}, body was: ${error.error}`
      );
    }
    // Return an observable with a user-facing error message
    return throwError('Something went wrong; please try again later.');
  }
}