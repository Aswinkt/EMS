import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { API_URL } from 'tokens/api-url.token';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginForm: FormGroup;
  error: string = '';
  loading: boolean = false;
  private apiUrl = inject(API_URL);

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;
    this.loading = true;
    this.error = '';

    this.http.post<any>(`${this.apiUrl}/auth/login/`, this.loginForm.value).subscribe({
      next: (response) => {
        localStorage.setItem('access', response.tokens.access);
        localStorage.setItem('refresh', response.tokens.refresh);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.router.navigate(['/profile']);
      },
      error: err => {
        this.error = err.error?.detail || 'Login failed';
        this.loading = false;
      }
    });
  }
}
