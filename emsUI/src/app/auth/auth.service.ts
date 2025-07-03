import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'tokens/api-url.token'; // adjust if needed
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = API_URL;

  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/auth/change-password/`,
      { old_password: oldPassword, new_password: newPassword }
    );
  }
}
