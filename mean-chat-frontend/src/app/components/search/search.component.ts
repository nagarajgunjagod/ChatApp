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

  searchUsers(): void {
    console.log('Search button clicked'); // Debugging log

    const token = localStorage.getItem('token');
    if (!this.searchQuery.trim()) {
      console.error('Search query is empty'); // Debugging log
      return;
    }

    this.http
      .get(`http://localhost:3000/api/users/search?username=${this.searchQuery}`, {
        headers: { Authorization: token || '' },
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

  startChat(participantId: string): void {
    console.log('Starting chat with user:', participantId); // Debugging log

    const token = localStorage.getItem('token');
    this.http
      .post(
        'http://localhost:3000/api/chats',
        { participantId },
        { headers: { Authorization: token || '' } }
      )
      .subscribe(
        (chat: any) => {
          console.log('Chat created:', chat); // Debugging log
          this.router.navigate(['/chat', chat._id]); // Navigate to the new chat
        },
        (error) => {
          console.error('Error creating chat:', error); // Debugging log
        }
      );
  }
}
