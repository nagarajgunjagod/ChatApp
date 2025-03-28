import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private socket: Socket;
  private readonly backendUrl = 'http://localhost:3000'; // Backend URL

  constructor(private http: HttpClient) {
    this.socket = io(this.backendUrl); // Connect to the backend
  }

  // Fetch all messages from the backend
  getMessages(): Observable<any> {
    return this.http.get(`${this.backendUrl}/messages`);
  }

  // Send a new message
  sendMessage(message: { token: string; text: string }): void {
    this.socket.emit('send-message', message);
  }

  // Listen for new messages
  onNewMessage(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('receive-message', (message) => {
        observer.next(message);
      });
    });
  }
}
