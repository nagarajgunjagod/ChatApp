import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  username: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  register(): void {
    this.http
      .post('http://localhost:3000/auth/register', {
        username: this.username,
        password: this.password,
      })
      .subscribe(
        () => {
          alert('Registration successful! Please log in.');
          this.router.navigate(['/login']);
        },
        (err) => alert('Registration failed: ' + err.error.error)
      );
  }
}
