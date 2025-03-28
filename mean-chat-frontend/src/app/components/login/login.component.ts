import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  login(): void {
    this.http
      .post('http://localhost:3000/auth/login', {
        username: this.username,
        password: this.password,
      })
      .subscribe({
        next: (response: any) => {
          console.log('Login successful:', response); // Debugging log
          localStorage.setItem('token', response.token);
          localStorage.setItem('username', response.username);
          this.router.navigate(['/chat']); // Redirect to /chat
        },
        error: (err) => {
          console.error('Login failed:', err); // Debugging log
          alert('Login failed: ' + err.error.error);
        },
        complete: () => {
          console.log('Login request complete'); // Debugging log
        },
      });
  }
}
