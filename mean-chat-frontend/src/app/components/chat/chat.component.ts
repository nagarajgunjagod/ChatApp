import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Socket } from 'ngx-socket-io';
import { AuthService } from '../../services/auth.service'; // Import AuthService

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  messages: any[] = [];
  newMessage: string = '';
  chatId: string | null = null;
  contactId: string | null = null;
  username: string | null = null; // Store the logged-in user's username

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private socket: Socket,
    public authService: AuthService // Make authService public
  ) {}

  ngOnInit(): void {
    this.chatId = this.route.snapshot.paramMap.get('chatId');
    this.contactId = this.route.snapshot.paramMap.get('contactId');
    this.username = this.authService.getUsername(); 

    console.log('Chat ID:', this.chatId); // Debugging log
    console.log('Contact ID:', this.contactId); // Debugging log
    console.log('username:', this.username); // Debugging log

    if (!this.chatId) {
      console.error('Chat ID is missing.');
      return;
    }

    if (!this.contactId) {
      console.error('Contact ID is missing.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Authorization token is missing.');
      return;
    }

    // Fetch messages between the logged-in user and the contact
    this.http
      .get(`http://localhost:3000/api/messages/${this.contactId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: (messages: any) => {
          this.messages = messages;
        },
        error: (error) => {
          console.error('Error fetching messages:', error);
        },
      });

    // Join the chat room
    this.socket.emit('join-chat', this.chatId);

    // Listen for new messages
    this.socket.on('receive-message', (message: any) => {
      console.log('New message received:', message);
      this.messages.push(message);
    });
  }

  sendMessage(): void {
    const token = localStorage.getItem('token'); // Ensure the token is retrieved correctly
    if (!token) {
      console.error('Authorization token is missing.');
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    this.http
      .post(
        `http://localhost:3000/api/chats/${this.chatId}/messages`,
        { text: this.newMessage },
        { headers }
      )
      .subscribe({
        next: (response) => {
          console.log('Message sent successfully:', response);
          this.messages.push(response); // Add the message to the chat window
          this.newMessage = ''; // Clear the input field
        },
        error: (error) => {
          console.error('Error sending message:', error);
        },
      });
  }

  // Add the logout method
  logout(): void {
    this.authService.logout(); // Log out the user and redirect to the login page
  }
}
