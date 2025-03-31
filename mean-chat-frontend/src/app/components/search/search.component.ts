import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent {
  searchQuery: string = '';
  searchResults: any[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  // Search for users by username
  searchUsers(): void {
    console.log('Search button clicked'); // Debugging log

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Authorization token is missing.'); // Debugging log
      return;
    }

    if (!this.searchQuery.trim()) {
      console.error('Search query is empty'); // Debugging log
      return;
    }

    this.http
      .get(`http://localhost:3000/api/users/search?username=${this.searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` }, // Ensure Bearer prefix
      })
      .subscribe(
        (results: any) => {
          console.log('Search results:', results); // Debugging log
          this.searchResults = results; // Display the search results
        },
        (error) => {
          console.error('Error searching for users:', error); // Debugging log
        }
      );
  }

  // Start a chat with a specific user
  startChat(participantId: string): void {
    console.log('Starting chat with user:', participantId); // Debugging log

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Authorization token is missing.'); // Debugging log
      return;
    }

    this.http
      .post(
        'http://localhost:3000/api/chats',
        { participantId },
        { headers: { Authorization: `Bearer ${token}` } } // Ensure Bearer prefix
      )
      .subscribe(
        (chat: any) => {
          console.log('Chat created:', chat); // Debugging log
          this.router.navigate(['/chat', chat._id, participantId]); // Navigate to the new chat with chatId and participantId
        },
        (error) => {
          console.error('Error creating chat:', error); // Debugging log
        }
      );
  }
}
