import { Component, inject } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { API_URL } from 'tokens/api-url.token';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './profile.component.html'
})
export class ProfileComponent {
  user: any = null;
  error: string = '';
  private apiUrl = inject(API_URL);

  constructor(private http: HttpClient) {
    const access = localStorage.getItem('access');
    this.http.get(`${this.apiUrl}/auth/profile/`, {
      headers: { Authorization: `Bearer ${access}` }
    }).subscribe({
      next: (data) => this.user = data,
      error: err => this.error = err.error?.detail || 'Failed to load profile'
    });
  }
}
