import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Real-Time Chat App';

  constructor(private router: Router) {}

  startChat() {
    this.router.navigate(['/chat']);
  }
}
