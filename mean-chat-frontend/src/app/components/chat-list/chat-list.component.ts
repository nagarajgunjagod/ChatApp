import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css'],
})
export class ChatListComponent implements OnInit {
  chats: any[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    this.http
      .get('http://localhost:3000/api/chats', {
        headers: { Authorization: token || '' },
      })
      .subscribe({
        next: (chats: any) => {
          this.chats = chats;
        },
        error: (error) => {
          console.error('Error fetching chats:', error);
        },
      });
  }

  openChat(contactId: string): void {
    this.router.navigate(['/chat', contactId]);
  }
}
