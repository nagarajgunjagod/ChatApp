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
  username: string | null = null; // Store the logged-in user's username

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private socket: Socket,
    public authService: AuthService // Make authService public
  ) {}

  ngOnInit(): void {
    const contactId = this.route.snapshot.paramMap.get('contactId');
    const token = localStorage.getItem('token');

    this.http
      .get(`http://localhost:3000/api/messages/${contactId}`, {
        headers: { Authorization: token || '' },
      })
      .subscribe({
        next: (messages: any) => {
          this.messages = messages;
        },
        error: (error) => {
          console.error('Error fetching messages:', error);
        },
      });

    this.chatId = this.route.snapshot.paramMap.get('chatId'); // Retrieve chatId from route
    console.log('Chat ID:', this.chatId); // Debugging log

    // Retrieve the logged-in user's username
    this.username = this.authService.getUsername();
    console.log('Logged-in username:', this.username); // Debugging log

    if (!this.chatId) {
      console.error('Chat ID is missing'); // Debugging log
      return;
    }

    // Fetch messages for the chat
    this.http
      .get(`http://localhost:3000/api/chats/${this.chatId}`, {
        headers: { Authorization: token || '' },
      })
      .subscribe({
        next: (messages: any) => {
          console.log('Fetched messages:', messages); // Debugging log
          this.messages = messages; // Store messages in the component
        },
        error: (error) => {
          console.error('Error fetching messages:', error); // Debugging log
        },
      });

    // Join the chat room
    this.socket.emit('join-chat', this.chatId);

    // Listen for new messages
    this.socket.on('receive-message', (message: any) => {
      console.log('New message received:', message); // Debugging log
      this.messages.push(message); // Add the new message to the chat window
    });
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!this.chatId || !token) {
      console.error('Chat ID or token is missing'); // Debugging log
      return;
    }

    const message = { text: this.newMessage };

    this.http
      .post(
        `http://localhost:3000/api/chats/${this.chatId}/messages`,
        message,
        { headers: { Authorization: token } }
      )
      .subscribe({
        next: (sentMessage: any) => {
          console.log('Message sent successfully:', sentMessage); // Debugging log
          this.socket.emit('send-message', {
            chatId: this.chatId,
            message: sentMessage,
          });
          this.messages.push(sentMessage); // Add the message to the chat window
          this.newMessage = ''; // Clear the input field
        },
        error: (error) => {
          console.error('Error sending message:', error); // Debugging log
        },
      });
  }

  // Add the logout method
  logout(): void {
    this.authService.logout(); // Log out the user and redirect to the login page
  }
}
