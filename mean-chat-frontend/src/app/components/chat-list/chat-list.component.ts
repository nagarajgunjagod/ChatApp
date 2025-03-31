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
    if (!token) {
      console.error('Authorization token is missing.');
      return;
    }

    console.log('Sending request to /api/chats with token:', token); // Debugging log

    this.http
      .get('http://localhost:3000/api/chats', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: (chats: any) => {
          console.log('Fetched chats:', chats); // Debugging log
          this.chats = chats;
        },
        error: (error) => {
          console.error('Error fetching chats:', error); // Debugging log
        },
      });
  }

  openChat(chatId: string, contactId: string | undefined): void {
    console.log('entered--------------')
    if (!contactId) {
      console.error('Contact ID is missing.');
      return;
    }
    this.router.navigate(['/chat', chatId, contactId]);
  }
}
