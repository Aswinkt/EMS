import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { API_URL } from 'tokens/api-url.token';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  registerForm: FormGroup;
  error: string = '';
  success = false;
  loading: boolean = false;
  private apiUrl = inject(API_URL);

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) return;
    this.loading = true;
    this.error = '';
    this.success = false;

    this.http.post(`${this.apiUrl}/auth/register/`, this.registerForm.value).subscribe({
      next: () => {
        this.success = true;
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: err => {
        this.error = err.error?.detail || 'Registration failed';
        this.loading = false;
      }
    });
  }
}