import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    // Initialize the login form with validation
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login(): void {
    if (this.loginForm.invalid) {
      console.error('Login form is invalid. Please fill in all required fields.');
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: (response: any) => {
        console.log('Login successful:', response);

        const token = response.token;
        if (token) {
          localStorage.setItem('token', token);
          console.log('Token stored in localStorage:', token);
        } else {
          console.error('Login response does not contain a token.');
          return;
        }

        this.router.navigate(['/chat']);
      },
      error: (error: any) => {
        console.error('Login failed:', error);
        if (error.status === 401) {
          console.error('Invalid credentials. Please try again.');
        } else {
          console.error('An unexpected error occurred:', error.message);
        }
      },
      complete: () => {
        console.log('Login request complete');
      },
    });
  }
}
